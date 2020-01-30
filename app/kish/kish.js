((_pid, _app) => {

    $.getJSON(_app.getPath("kish_config.json"), (data) => {
        let props = ["background","font-family","font-size","font-weight","color","text-align","text-shadow","background-size","background-attachment","backdrop-filter"];
        KWS.resize(_pid, data.width || "", data.height || "");
        if( data.styles ) for( let i in data.styles ){
            if( props.includes(i) ){
                _app.dom('#kish-wrapper').css( i, data.styles[i] );
                if( i == "backdrop-filter" ) _app.dom().css( i, data.styles[i] );
            }
        }
    });

    let kishHistory = [], kishCur = -1;

    const Kish = new function(){
        this.dir = "~";

        this.cat = function(arg){
            let path = arg.split(" ", 1), _r = "";
            if( S.userarea[path] ) _r = "<pre><code>" + JSON.stringify( System.userarea[path].data + "</code></pre>", null, 4 );
            else _r = "File not found: " + path;
            return _r;
        }

        this.clear = function(arg){
            let args = arg.split(" ");
            let num = Number(args[0]);
            if( !num ) _app.dom('#kish-out').html('');
            return false;
        }

        this.dialog = (arg, func) => {
            if(func){
                Kish.print(`${arg} <code>y/n</code>`);
                _app.data('dialogFunc', func);
            }
        }

        this.echo = function(arg){
            _r = arg;
            if( typeof arg == "object" ) _r = JSON.stringify(arg, null, 4);
            return _r;
        }

        this.eval = arg => eval(arg);
    
        this.exec = function(arg){
            let cmd = arg.split(" ", 1);
            let args = "";
            kishHistory.unshift( arg );
            kishCur = -1;
            if( arg.indexOf(" ") != -1 ) args = arg.substring( arg.indexOf(" ") + 1 );
            _app.dom('#kish-out').append(`<div class='kish-item'><i class='fa fa-dollar-sign'></i><span class='kish-highlight'>${cmd} </span>${args}</div>`);
            if( !Kish[cmd] ){
                _app.dom('#kish-out').append(`<div class='kish-item'><i class='fa fa-angle-double-right'></i> kishコマンドは存在しません：${cmd}</div>`);
                return false;  
            }
            let exec = `Kish.${cmd}('${args}')`;
            try {
                let rtn = eval(exec)
                if( typeof rtn == "object" ) rtn = JSON.stringify(rtn, null, 4);
                if( rtn ) _app.dom('#kish-out').append(`<div class='kish-item'><span class='kish-from'>${cmd}</span><i class='fa fa-angle-double-right'></i>${rtn}</div>`);            
            }
            catch (error) {
                _app.dom('#kish-out').append(`<div class='kish-item'><span class='kish-from'>${cmd}</span><i class='fa fa-exclamation-triangle'></i>${error}</div>`);
            }
        }

        this.exit = () => _app.close();

        this.gitinfo = () => {
            let branchRequest = new XMLHttpRequest();
            branchRequest.onreadystatechange = () => {
                if(branchRequest.readyState === XMLHttpRequest.DONE){
                    let branch = branchRequest.responseText.match(/ref:\s?(.*)/)[1];
                    let messageRequest = new XMLHttpRequest();
                    messageRequest.onreadystatechange = () => {
                        if(messageRequest.readyState === XMLHttpRequest.DONE){
                            let message = messageRequest.responseText;
                            Kish.print(`<kit-badge class='-orange kit-font-m'>${branch}</kit-badge><div class='kit-font-s'>Message: ${message}</div>`, 'gitinfo');
                        }
                    }
                    messageRequest.open('GET', './.git/COMMIT_EDITMSG');
                    messageRequest.send();
                }
            }
            branchRequest.open('GET', './.git/HEAD');
            branchRequest.send();
        }

        this.install = function(arg){
            let args = arg.split(" ");
            let iobj = new Object();
            $.getJSON( args[0] + "define.json" , function( data ){
                iobj.path = args[0];
                iobj.id = data.id;
                iobj.name = data.name;
                iobj.icon = args[0] + data.icon;
                iobj.version = data.version;
                if( args[1] ) iobj.kpt = args[1];
                _app.data('iobj', iobj);
                Kish.dialog(`Are you sure to install ${iobj.name}?`, () => {
                    if(_app.data('iobj')){
                        System.installed.push(_app.data('iobj'));
                        localStorage.setItem("kit-installed", JSON.stringify(System.installed));
                        Kish.print("An app was installed from " + args[0], "install");
                        $.getJSON("config/apps.json", System.initLauncher);
                    }
                    else return 'Installation error occurred.';
                    _app.data('iobj'. null);
                });

            }).fail( function() {
                Kish.print("Faild to install an app from " + args[0], "install");
            } );
            return "Start installing...";
        }
    
        this.kish = () => 'kish v0.5.0';

        this.kpt = arg => {
            let [_cmd, _appid, _ver, _opt] = arg.split(' ');
            const APIEP = 'https://kpkg.herokuapp.com/api/v1/apps/';
            if(!_cmd) return 'Usage: kpt [command] [appid] [version]';
            if(_cmd == 'update'){
                let count = 0, installed = [...System.installed], itr = 0;
                _app.data('replaceInstalled', installed);
                for(let [index, i] of installed.entries()) {
                    if(i.kpt){
                        installed = _app.data('replaceInstalled');
                        $.getJSON( APIEP + i.kpt, (data) => {
                            if(data.status == 'FAILED') Kish.print(`Unknown app: ${i.kpt}`, 'kpt');
                            else if(data.status == 'SUCCESS'){
                                let defver = data.versions[0].def_version || data.versions[0].name;
                                if(i.version != defver){
                                    Kish.print(`${i.kpt} <strong class='kit-badge -green'>${i.version}</strong><span class='kit-font-s'>${i.path}</span> → <strong class='kit-badge -limegreen'>${defver}</strong><span class='kit-font-s'>${data.versions[0].path}</span>`, 'kpt');
                                    installed[index]['version'] = defver;
                                    installed[index]['path'] = data.versions[0].path;
                                    installed[index]['name'] = data.data.name;
                                    installed[index]['icon'] = data.versions[0].path + data.versions[0].icon;
                                    _app.data('replaceInstalled', installed);
                                    count ++;
                                }
                                else Kish.print(`${i.kpt} <strong class='kit-badge -black'>${i.version}</strong> is already up to date.`, 'kpt');
                            }
                        });
                    }
                    itr ++;
                }
                Kish.dialog(`Are you sure you want to try to updates about following app(s)?`, ()=> {
                    let newInstalled = _app.data('replaceInstalled');
                    System.installed = newInstalled;
                    localStorage.setItem("kit-installed", JSON.stringify(System.installed));
                    Kish.print(`Completed updating ${count} app(s).`, 'kpt');
                    $.getJSON("config/apps.json", System.initLauncher);
                });
                return;
            }
            if(!_appid) return 'Please put the app id and try again.';
            $.getJSON( APIEP + _appid, (data) => {
                if(data.status == 'FAILED') Kish.print(data.error || 'ERROR', 'kpt');
                else if(data.status == 'SUCCESS'){
                    let _verdata;
                    switch (_cmd) {
                        case 'install':
                        case 'i':
                            if(!_ver) _ver = 'latest';
                            _verdata = data.versions[0];
                            for(let i of data.versions) {
                                if(i.name == _ver) _verdata = i;
                            }
                            if(_opt == '-y') Kish.install(_verdata.path);
                            else Kish.dialog(`Would you install "${data.data.name}" version ${_verdata.name}(${_verdata.public_uid}) on your kit?`, () => {
                                Kish.install(`${_verdata.path} ${data.data.appid}`);
                            });
                            break;
                        case 'uninstall':
                            let _path;
                            for(let i of System.installed) {
                                if(i.kpt == _appid) _path = i.path;
                            }
                            if(_opt == '-y') Kish.uninstall(_path);
                            else Kish.dialog(`Would you uninstall "${_appid} from ${_path}"?`, () => {
                                Kish.uninstall(_path);
                            });
                            break;
                        case 'update':
                            break;
                        case 'search':
                        case 's':
                            Kish.print(`The app "${data.data.appid}" is found on kpt.
                                        <h1>${data.data.name} <span class='kit-sub'>${data.data.appid}</span></h1>
                                        <code class='kit-block'>${data.data.desc.replace(/\n/gi, '<br>') || 'No description.'}</code>
                                        <div class='kit-sub'>Registered : ${data.data.created_at}</div>
                            `, 'kpt');
                            for(let i of data.versions) {
                                if(!_ver || i.name == _ver) {
                                    Kish.print(`Version "${i.name}" :
                                                <h3>${i.public_uid}</h3>
                                                <code class='kit-block'>${i.desc.replace(/\n/gi, '<br>') || 'No description.'}</code>
                                                <div class='kit-sub'>Path : ${i.path}</div>
                                                <div class='kit-sub'>Registered : ${i.created_at}</div>
                                    `, 'kpt');
                                }
                            }
                            break;
                        default:
                            Kish.print('Command not found.', 'kpt');
                            break;
                    }
                }
            });
        }

        this.launch = function(arg){
            args = arg.split(" ");
            System.launchpath[pid] = System.appdir + args[0];
            $.getJSON( "./app/" + args[0] + "/define.json", appData ).fail( function() {
                System.launchpath[pid] = args[0];
                $.getJSON( args[0] + "/define.json", appData ).fail( function() {
                    Kish.print("Faild to launch an App: " + args[0], "launch");
                } );
            } );
        }

        this.load = function(arg){
        }

        this.ls = function(){
            let _r = "<strong>/</strong><ul>";
            for( let i in System.userarea ) _r += `<li>${i}</li>`;
            _r += "</ul>";
            return _r;
        }

        this.n = () => {
            let func = _app.data('dialogFunc');
            if(func){
                Kish.print('Canceled.');
                _app.data('dialogFunc', null);
            }
            else{
                return 'There is nothing to cancel.';
            }
        }

        this.open = function(arg){
            if( !arg ) return "ファイル名を指定してください";
            else System.open(arg);
        }

        this.print = function(arg, from){
            let _from = "";
            if( from ){
                _from = "<span class='kish-from'>" +from+ "</span><i class='fa fa-angle-double-right'></i> "
            }
            S.dom(_pid, "#kish-out").append( "<div class='kish-item'>" + _from + arg + "</div>" );          
        }

        this.uninstall = function(arg){
            let count = 0;
            for( let i in System.installed ){
                if( System.installed[i].path == arg ){
                    System.installed.splice(i, 1);
                    count ++;
                }
            }
            localStorage.setItem("kit-installed", JSON.stringify(System.installed));
            $.getJSON("config/apps.json", System.initLauncher);
            return count + " app(s) was uninstalled from kit.";
        }

        this.ver = () => System.version;

        this.y = () => {
            let func = _app.data('dialogFunc');
            if(func){
                _app.data('dialogFunc', null);
                func.call();
            }
            else return 'There is nothing to exec.';
        }
    }

    _app.dom('#kish-input').on( "keypress keyup keydown", (e) => {
        let input = _app.dom('#kish-input').val().split(' ');
        if( typeof Kish[ input[0] ] == "function" ){
            _app.dom('#kish-curcmd').show().text( input[0] );
        }
        else _app.dom('#kish-curcmd').hide();
    } );

    _app.dom('#kish-input').on('keydown keypress', (e) => {
        if( e.keyCode == 13 && _app.dom('#kish-input').val() ){
            Kish.exec( _app.qs('#kish-input')[0].value );
            _app.dom('#kish-input').val('');
        }
        else if( e.keyCode == 38 ){
            if( kishCur < kishHistory.length - 1 ){
                kishCur ++;
                _app.dom('#kish-input').val( kishHistory[kishCur] );
            }
        }
        else if( e.keyCode == 40 ){
            if( kishCur > 0 ){
                kishCur --;
                _app.dom('#kish-input').val( kishHistory[kishCur] );
            }
            else if( kishCur == 0 ){
                kishCur = -1;
                _app.dom('#kish-input').val('');
            }
        }
    });

    $.getJSON( _app.getPath("kishrc.json"), (data) => {
        for( let i of data.rc ) Kish.exec(i);
    });

    if( _app.args && _app.args['rc'] ){
        for( let i of _app.args['rc'] ) Kish.exec(i);
    }

    _app.changeWindowTitle(`(kish) ${System.username}`);
})(pid, app);
