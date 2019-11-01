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
    
        this.echo = function(arg){
            _r = arg;
            if( typeof arg == "object" ) _r = JSON.stringify(arg, null, 4);
            return _r;
        }

        this.eval = (arg) => { return eval(arg) }
    
        this.exec = function(arg){
            let cmd = arg.split(" ", 1);
            let args = "";
            kishHistory.unshift( arg );
            kishCur = -1;
            if( arg.indexOf(" ") != -1 ) args = arg.substring( arg.indexOf(" ") + 1 );
            _app.dom('#kish-out').append(`<div class='kish-item'><i class='fa fa-dollar-sign'></i><span class='kish-highlight'>${cmd}</span>${args}</div>`);
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

        this.install = function(arg){
            let args = arg.split(" ");
            let iobj = new Object();
            $.getJSON( args[0] + "define.json" , function( data ){
                iobj.path = args[0];
                iobj.id = data.id;
                iobj.name = data.name;
                iobj.icon = args[0] + data.icon;
                System.installed.push(iobj);
                localStorage.setItem("kit-installed", JSON.stringify(System.installed));
                Kish.print("An app was installed from " + args[0], "install");
                $.getJSON("config/apps.json", System.initLauncher);

            }).fail( function() {
                Kish.print("Faild to install an app from " + args[0], "install");
            } );
            return "Start installing...";
        }
    
        this.kish = () => 'kish v0.4.0';

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
            return count + "app(s) was uninstalled from kit.";
        }

        this.ver = () => System.version;
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
