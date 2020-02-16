"use strict";

//   _    _ _   
//  | | _(_) |_ 
//  | |/ / | __|
//  |   <| | |_ 
//  |_|\_\_|\__|
//
// THIS IS THE KIT KERNEL, KIT APPS FRAMEWORK AND KIT WINDOW SYSTEM
// http://web.kitit.ml/
// https://github.com/mtsgi/kit


$( document ).ready( kit );

function kit() {
    S = System;

    if( localStorage.getItem( "kit-pid" ) ) pid = localStorage.getItem( "kit-pid" );

    if( !localStorage.getItem( "kit-username" ) ) localStorage.setItem( "kit-username", "ユーザー" );
    $( "#kit-header-username" ).text( localStorage.getItem( "kit-username" ) );

    if( localStorage.getItem( "kit-lock" ) == null ) localStorage.setItem( "kit-lock", "false" );

    if( System.bootopt.get("safe") ) $( "#kit-wallpaper" ).css( "background","#404040" );
    else if( localStorage.getItem( "kit-wallpaper" ) ) $( "#kit-wallpaper" ).css( "background", localStorage.getItem( "kit-wallpaper" ) ).css( "background-size", "cover" ).css( "background-position", "center" );

    if( !localStorage.getItem( "kit-default-browser" ) ) localStorage.setItem( "kit-default-browser", "browser" );

    if( localStorage.getItem("kit-fusen") ){
        this.list = JSON.parse(localStorage.getItem("kit-fusen"));
        for( let i in this.list ){
            KWS.fusen.add(this.list[i]);
        }
    }
    
    if( localStorage.getItem("kit-darkmode") == "true" ){
        KWS.darkmode = true;
        $("#kit-darkmode").attr("href", "system/theme/kit-darkmode.css");
        $(".winc-darkmode").addClass("kit-darkmode");
    }

    if( System.bootopt.get("safe") ){
        $("#kit-theme-file").attr("href", "./system/theme/theme-light.css" );
    }
    else{
        if( !localStorage.getItem( "kit-theme" ) ) localStorage.setItem( "kit-theme", "theme-default.css" );
        $("#kit-theme-file").attr("href", "./system/theme/" + localStorage.getItem("kit-theme") );
    }

    if( !localStorage.getItem( "kit-appdir" ) ) localStorage.setItem( "kit-appdir", "./app/" );
    S.appdir = localStorage.getItem( "kit-appdir" );

    if( localStorage.getItem('kit-installed') ) System.installed = JSON.parse( localStorage.getItem('kit-installed') );

    if( localStorage.getItem('kit-screentime') ) KWS.screenTime = JSON.parse( localStorage.getItem('kit-screentime') );

    if( localStorage["kit-userarea"] ) System.userarea = JSON.parse(localStorage["kit-userarea"]);
    if( localStorage["kit-recycle"] ) System.recycle = JSON.parse(localStorage["kit-recycle"]);

    System.moveDesktop( "1" );

    var clockmove;
    if( System.bootopt.get("safe") ) clockmove = setInterval( System.clock, 1000 );
    else  clockmove = setInterval( System.clock, 10 );

    if ( localStorage.getItem("kit-shutted-down") == "false" ) {
        Notification.push("お知らせ", "kitは前回終了時、正しくシャットダウンされませんでした。", "system");
    }
    localStorage.setItem("kit-shutted-down", false);

    Notification.push("kitへようこそ", localStorage["kit-username"] + "さん、こんにちは。", "system", null, null, 'documents/icon.png', [
        {
            label: 'kitについて',
            func: () => System.launch( 'settings', {'view': 'about'} )
        }
    ]);

    if( localStorage.getItem( "kit-startup" ) == undefined ) {
        localStorage.setItem( "kit-startup", new Array( "welcome" ) );
    }
    System.startup = localStorage.getItem( "kit-startup" ).split( "," );
    if( System.bootopt.get("safe") ){
        Notification.push( "セーフブート", "現在、kitをセーフモードで起動しています。", "system" );
        System.alert( "セーフブート", "現在、kitをセーフモードで起動しています。<br><a class='kit-hyperlink' onclick='System.reboot()'>通常モードで再起動</a>", "system" );
    }
    else for( let i of System.startup ) if( i != "" ) System.launch(i);
    
    $("#kit-header-fullscreen").hide();

    //イベントハンドラ
    $( "#desktops" ).click( function() {
        $( "#desktop-" + currentDesktop ).toggleClass( "selected-section" );
    } ).mousedown( function() {
        $( ".window" ).css( "opacity", "0.6" );
    } ).mouseup( function() {
        $( ".window" ).css( "opacity", "1.0" );
    } );
    //タスク一覧
    $( "#footer-tasks" ).click( function() {
        if( $( "#kit-tasks" ).is( ":visible" ) ) {
            $( "#kit-tasks" ).html( "" ).fadeOut( 300 );
        }
        else {
            $( "#task-ctx" ).fadeOut( 200 );
            $( "#kit-tasks" ).html( $( "#tasks" ).html() ).fadeIn( 300 ).css( "z-index", "9997" );
        }
    } );
    $.getJSON("system/testload.json").fail( () => {
        $('#body').append(`<div id='wcors' class="window windowactive" style="top: 70px; left: 50px; width: calc(100% - 100px)">
            <div class="wt">問題が発生しました</div>
            <div class="winc">JSONデータ読み込みに失敗しました。<br>
            クロスオリジン制約によりkitアプリケーションの動作が制限されている場合があります。<br>
            詳細は<a class="kit-hyperlink" onclick="location.href = 'https://mtsgi.github.io/kitdocs/#/cors'">こちらの記事</a>をご確認ください。</div>
        </div>`);
        $('<kit-button-alt class="kit-block kit-text-c m">閉じる</kit-button-alt>').appendTo('#wcors .winc').on('click', ()=>{
            $('#wcors').remove();
        })
    });
    
    $.getJSON("config/desktop.json", (data) => {
        for( let i in data ){
            $(".desktop-icons").append("<div class='desktop-icon' data-launch='" + i + "'><img src='" + data[i].icon + "'>" + data[i].name + "</div>");
        }
        $(".desktop-icon").on("click", function(){
            System.launch( $(this).attr("data-launch") );
        });
    }).fail( function() {
        Notification.push( "読み込みに失敗", "デスクトップ(config/desktop.json)の読み込みに失敗しました。", "system" );
    } );
    
    $.getJSON("config/apps.json", System.initLauncher).fail( function() {
        Notification.push( "ランチャー初期化失敗", "アプリケーション一覧(config/apps.json)の読み込みに失敗しました。", "system" );
    } );
    $( "#kit-tasks" ).delegate( ".task", "click", function() {
        System.close( this.id.slice( 1 ) );
        $( this ).hide();
    } );
    
    $( "#footer-noti" ).click( function() {
        $( "#last-notification" ).hide( "drop", {direction: "right"}, 300 );
        if( $( "#notifications" ).is( ":visible" ) ) {
            $( "#notifications" ).hide( "drop", {direction: "right"}, 300 );
        }
        else {
            $( "#notifications" ).show( "drop", {direction: "right"}, 300 );
        }
    } );
    $( "#last-notification-close" ).click( function() {
        $( "#last-notification" ).hide( "drop", {direction: "right"}, 300 );
    } );
    $("#notifications-dnp").prop("checked", false).on("change", ()=>{
        if( $("#notifications-dnp").is(":checked") ){
            Notification.goodnight = true;
        }
        else Notification.goodnight = false;
    });
    
    $( ".power-button" ).click( function() {
        $( "#notifications" ).hide( "drop", {direction: "right"}, 300 );
        $( "#last-notification" ).hide( "drop", {direction: "right"}, 300 );
        $( "#kit-wallpaper" ).css( "filter", "blur(5px)" );
        $( "footer, header, #launcher, #task-ctx, #kit-sightre, .dropdown, #desktop-" + currentDesktop ).hide();
        $( "#kit-power" ).show();
    } );
    $( "#kit-power-back" ).click( function() {
        $( "section, header, footer, #kit-wallpaper, .dropdown" ).css( "filter", "none" );
        $( "footer, header, #desktop-" + currentDesktop ).show();
        $( "#kit-power" ).hide();
    } );
    $( "#kit-power-shutdown" ).click( function() {
        System.shutdown();
    } );
    $( "#kit-power-reboot" ).click( function() {
        System.reboot();
    } );
    $( "#kit-power-suspend" ).click( function() {
        location.reload();
        $( "section, header, footer, #kit-wallpaper" ).css( "filter", "none" );
        $( "#kit-power" ).fadeOut( 300 );
        System.alert("サスペンド機能", "サスペンド機能はこのバージョンのkitではサポートされていません。");
    } );
    $( "#kit-power-lock" ).click( function() {
        System.lock();
    } );
    $( "#lock-password" ).on( 'keypress', function( e ) {
        if( e.which == 13 ) $( "#lock-unl" ).click();
    } );
    $( "#lock-unl" ).on( 'click', function() {
        if( !localStorage.getItem( "kit-password" ) || $( "#lock-password" ).val() == localStorage.getItem( "kit-password" ) ) {
            $( "header, footer" ).show();
            $( "section, header, footer, #kit-wallpaper" ).css( "filter", "none" );
            $( "#lock-password" ).val( "" );
            System.moveDesktop(1);
        }
        else $( "#lock-password" ).effect( "bounce", {distance: 12, times: 4}, 500 );
    } ).hover( function() {
        $( "#lock-unl span" ).removeClass( "fa-lock" ).addClass( "fa-lock-open" );
    }, function() {
        $( "#lock-unl span" ).removeClass( "fa-lock-open" ).addClass( "fa-lock" );
    } );
    
    $( "#launch" ).click( function() {
        $( "#notifications" ).hide( "drop", {direction: "right"}, 300 );
        if( $( "#launcher" ).is( ":visible" ) ) {
            $( "#kit-wallpaper" ).css( "filter", "none" );
            $( "#desktop-" + currentDesktop ).show();
            $( "#launcher" ).hide();
        }
        else {
            $( "#kit-wallpaper" ).css( "filter", "blur(5px)" )
            $( "section, #task-ctx" ).hide();
            $( "#launcher" ).show();
        }
    } );

    //Sightre
    $('#kit-header-sightre').on('click', () => {
        if($('#kit-sightre').is( ":visible" )) {
            $('#kit-sightre').fadeOut(300);
        }
        else {
            $('#kit-sightre-results').html('');
            $('#kit-sightre').show();
            $('#kit-sightre-form').val('').focus();
        }
    });
    let sightrePrevWord = '';
    $('#kit-sightre-form').on('keypress', (e) => {
        let _word = $('#kit-sightre-form').val();
        if( e.which == 13 && _word ) {
            if( _word == "kit" ){
                S.alert("", "<div style='text-align:left;'>　＿　　　　＿　＿　<br>｜　｜　＿（＿）　｜＿　<br>｜　｜／　／　｜　＿＿｜<br>｜　　　〈｜　｜　｜＿　<br>｜＿｜＼＿ ＼ ＿＼＿＿｜</div><hr>", S.version);
                return;
            }
            $('.kit-sightre-result.-first').click();
            sightrePrevWord = '';
            $('#kit-sightre-form').val('');
            $('#kit-sightre-results').html('');
            $('#kit-sightre').fadeOut(300);
        }
    }).on('keydown keyup change', (e) => {
        let _word = $('#kit-sightre-form').val();
        if( e.which == 27 ) $('#kit-sightre').fadeOut(300);
        else {
            if( _word == sightrePrevWord ) return;
            $('#kit-sightre-results').html('');
            if( !_word ) return;
            sightrePrevWord = _word;
            if( _word.indexOf('kish ') == 0 || _word.indexOf('🥧 ') == 0 ){
                let _cmd = _word.substring( _word.indexOf(" ") + 1 );
                if( _cmd ){
                    $(`<div class='kit-sightre-result -first'>
                            <img class='--icon' src='app/kish/icon.png'/>
                            <div class='--info'>
                                <div class='--name'>${_cmd}</div>
                                <div class='--desc'>kishでコマンドを実行</div>
                            </div>
                            <div class='--open fa fa-arrow-right'></div>
                        </div>`).appendTo('#kit-sightre-results').on('click', () => {
                            System.launch('kish', { 'rc': [ _cmd ] });
                    });
                }
            }
            else if( _word.indexOf('http://') == 0 || _word.indexOf('https://') == 0 || _word.indexOf('localhost') == 0 ){
                $(`<div class='kit-sightre-result -first'>
                        <img class='--icon' src='app/browser/icon.png'/>
                        <div class='--info'>
                            <div class='--name'>${_word}</div>
                            <div class='--desc'>ブラウザでURLを開く</div>
                        </div>
                        <div class='--open fa fa-arrow-right'></div>
                    </div>`).appendTo('#kit-sightre-results').on('click', () => {
                        System.launch( localStorage.getItem('kit-default-browser'), { "url" : _word } );
                });
            }
            else {
                $(`<div class='kit-sightre-result -first'>
                        <img class='--icon' src='system/icons/q.png'/>
                        <div class='--info'>
                            <div class='--name'>${_word}</div>
                            <div class='--desc'>アプリを起動する</div>
                        </div>
                        <div class='--open fa fa-arrow-right'></div>
                    </div>`).appendTo('#kit-sightre-results').on('click', () => {
                        let _args = null;
                        try {
                            if( _word.split(",")[1] ) _args = JSON.parse( _word.split(",").slice(1).join().trim() );
                        }
                        catch(error) {
                            Notification.push("引数の解釈に失敗", error, "system");
                        }
                        System.launch( _word.split(",")[0], _args );
                });
            }
            for( let i in System.apps ){
                if( i.indexOf(_word) == 0 || S.apps[i].name.indexOf(_word) == 0 ){
                    $(`<div class='kit-sightre-result -app'>
                            <img class='--icon' src='${S.apps[i].icon}'/>
                            <div class='--info'>
                                <div class='--name'>${S.apps[i].name}</div>
                                <div class='--desc'>kitアプリケーション - ${i}</div>
                            </div>
                            <div class='--open fa fa-arrow-right'></div>
                        </div>`).appendTo('#kit-sightre-results').on('click', () => {
                        System.launch(i);
                        $('#kit-sightre-results').html('');
                        $('#kit-sightre').fadeOut(300);
                    });
                }
            }
            for( let i in System.userarea ){
                if( i.indexOf(_word) == 0 || i.indexOf(_word) == 0 ){
                    $(`<div class='kit-sightre-result -file'>
                            <i class="fa fa-file --icon"></i>
                            <div class='--info'>
                                <div class='--name'>${i}</div>
                                <div class='--desc'>ファイル - 種類：${S.userarea[i].type} - ユーザー：${System.username}</div>
                            </div>
                            <div class='--open fa fa-arrow-right'></div>
                        </div>`).appendTo('#kit-sightre-results').on('click', () => {
                        System.open(i);
                        $('#kit-sightre-results').html('');
                        $('#kit-sightre').fadeOut(300);
                    });
                }
            }
            $(`<div class='kit-sightre-result -link'>
                    <i class="fa fa-search --icon"></i>
                    <div class='--info'>
                        <div class='--name'>${_word}</div>
                        <div class='--desc'>をWebで検索</div>
                    </div>
                    <div class='--open fa fa-arrow-right'></div>
                </div>`).appendTo('#kit-sightre-results').on('click', () => {
                System.launch( 'browser', { 'url' : 'https://www.bing.com/search?q=' + _word } );
                $('#kit-sightre-results').html('');
                $('#kit-sightre').fadeOut(300);
            });
            $(`<div class='kit-sightre-result -link'>
                    <i class="fab fa-wikipedia-w --icon"></i>
                    <div class='--info'>
                        <div class='--name'>${_word}</div>
                        <div class='--desc'>wikipediaの記事を表示</div>
                    </div>
                    <div class='--open fa fa-arrow-right'></div>
                </div>`).appendTo('#kit-sightre-results').on('click', () => {
                System.launch( 'browser', { 'url' : 'https://ja.wikipedia.org/wiki/' + _word } );
                $('#kit-sightre-results').html('');
                $('#kit-sightre').fadeOut(300);
            });
        }
    });

    $("#dropdown-sound-slider").slider({
        min: 0, max: 100, step: 1, value: 100,
        change: (e, ui) => {
            System.audio.level = ui.value;
            $("#dropdown-sound-level").text(ui.value);
            localStorage.setItem("kit-audio-level", ui.value);
            for( let i in System.audio.list ){
                System.audio.list[i].volume = System.audio.level / 100;
            }
            if( ui.value == 0 ) $("#kit-header-sound-icon").removeClass("fa-volume-up").addClass("fa-volume-mute");
            else $("#kit-header-sound-icon").removeClass("fa-volume-mute").addClass("fa-volume-up");
        }
    });
    if( localStorage["kit-audio-level"] ) System.audio.volume( localStorage["kit-audio-level"] );

    $("#dropdown-sound-silent").prop("checked", false).on("change", ()=>{
        if( $("#dropdown-sound-silent").is(":checked") ){
            System.audio.silent = true;
            $("#kit-header-sound-icon").removeClass("fa-volume-up").addClass("fa-volume-mute");
        }
        else{
            System.audio.silent = false;
            $("#kit-header-sound-icon").removeClass("fa-volume-mute").addClass("fa-volume-up");
        }
    });

    $('#kit-header-user').on('click', () => System.launch('user') );

    $(":root section:not(#desktop-l)").on("contextmenu", function() {
        let _ptelem = $( document.elementFromPoint(S.mouseX, S.mouseY) );
        S.selectedElement = _ptelem;
        S.selectedText = window.getSelection();
        $( "#kit-context-input" ).val( S.selectedText );
        if( $( "#kit-context-input" ).val() == "" ) $("#kit-contextgroup-text").hide();
        else $("#kit-contextgroup-text").show();
        if( _ptelem[0].id == "desktop-" + currentDesktop ){
            $("#kit-contextgroup-desktop").show();
            $("#kit-contextgroup-elem").hide();
        }
        else{
            $("#kit-contextgroup-desktop").hide();
            $("#kit-contextgroup-elem").show();
        }
        $( "#kit-context-elem" ).text( _ptelem.prop("tagName").toLowerCase() + "要素" );
        $("#kit-contextgroup-custom").hide();

        let  _ctxid = _ptelem.attr("data-kit-contextid") || _ptelem.attr("kit-context");
        if( _ctxid ){
            $("#kit-contextgroup-custom").show().html('<div id="kit-context-custom"></div>');
            let  _ctxname = KWS.context[_ctxid].name || _ctxid; 
            $("#kit-context-custom").text( _ctxname );
            for( let i in KWS.context[_ctxid]){
                if( i == "name" ) continue;
                $("#kit-contextgroup-custom").append("<a id='kit-context-" + _ctxid + "-" + i + "'><span class='fa " + KWS.context[_ctxid][i].icon + "'></span> " + KWS.context[_ctxid][i].label +"</a>");
                $("#kit-context-" + _ctxid + "-" + i).on("click", () => {
                    KWS.context[_ctxid][i].function();
                    $("#kit-context").fadeOut(300);
                });
            }
        }
        if( _ptelem[0].id ) $( "#kit-context-elem" ).append( "#" + _ptelem[0].id );
        $( "#kit-context-size" ).text( _ptelem[0].clientWidth + "✕" + _ptelem[0].clientHeight );
        $("#kit-context").toggle().css("left", S.mouseX).css("top", S.mouseY);
        return false;
    });
    $("#kit-context-open").on("click", function(){
        S.alert("要素", S.selectedElement.clone());
    });
    $("#kit-context-save").on("click", function(){
        S.obj2img( S.selectedElement , true );
    });
    $( "#kit-context-search" ).on("click", function(){
        $("#kit-context").fadeOut(300);
        System.launch( 'browser', {'url': `https://www.bing.com/search?q=${$('#kit-context-input').val()}`} );
    });
    $( "#kit-context-input" ).keypress( function( e ) {
        if( e.which == 13 ) $( "#kit-context-search" ).click();
    } );
    $("#kit-context a").on("click", function(){
        $("#kit-context").fadeOut(300);
    });
    $("#kit-context-vacuum").on("click", function(){
        for( let i in process ){
            KWS.vacuum( S.mouseX, S.mouseY );    
        }
        setTimeout(() => {
            $(".window").css("transition", "none");
        }, 500);
    });
    $("#kit-context-fusen").on("click", function(){
        KWS.fusen.add("");
    });


    $("section").on("click", function(){
        $("#kit-context").fadeOut(300);
    })

    $( document ).delegate('a', 'click', function() {
        if( this.href ) {
            System.launch( localStorage.getItem( "kit-default-browser" ), { "url" : this.href } );
            return false;
        }
    } ).on("mousemove", function(e){
        System.mouseX = e.clientX;
        System.mouseY = e.clientY;
    }).delegate('.textbox', 'keypress', function(e) {
        if( e.which == 13 && this.id ){
            if( $("#" + this.id + " + .kit-button").length ){
                Notification.push("debug", this.id, "system");
                $("#" + this.id + " + .kit-button").click();
            }
            else if( $("#" + this.id + " + kit-button").length ){
                Notification.push("debug", this.id, "system");
                $("#" + this.id + " + kit-button").click();
            }
        }
    } );

    window.onresize = () => {
        System.display.width = window.innerWidth;
        System.display.height = window.innerWidth;

        if( KWS.fullscreen.pid ){
            KWS.resize( KWS.fullscreen.pid, System.display.width, System.display.height - 30 );
        }
    }

    if( localStorage.getItem( "kit-lock" ) == "true" ){
        $("section").hide();
        setTimeout(() =>  System.lock(), 100);
    }
}

async function launch( str, args, dir ) {
    while(System.launchLock) await System.ajaxWait();
    System.launchLock = true;

    let _pid = pid;
    System.args[_pid] = args;
    let _path = dir || System.appdir + str;
    System.launchpath[_pid] = _path;

    if( System.appCache[_path] ) {
        if( KWS.fullscreen.pid ) KWS.unmax(KWS.fullscreen.pid);
        appData( System.appCache[_path] );
    }
    else {
        try{
            $.getJSON( S.launchpath[_pid] + '/define.json', appData ).fail( () => {
                Notification.push('kitアプリをロードできません。', `${str}を展開できませんでした。`, 'system');
            } );
        }
        catch(error){
            Notification.push( "System Error", error, "system" );
        }
    }
}

async function appData(data) {
    if(data.support && data.support.multiple == false){
        if( Object.values(process).map(p => p.id).includes(data.id) ){
            Notification.push('多重起動エラー', `アプリケーション「${data.name}」の多重起動は許可されていません。`, 'system');
            System.launchLock = false;
            return;
        }
    }
    let _pid = pid;
    process[String( _pid )] = {
        id: data.id,
        time: System.time.obj.toLocaleString(),
        isactive: false,
        preventclose: false,
        title: data.name
    };
    System.appCache[System.launchpath[pid]] = data;
    app = new App(_pid);
    let _taskAppend = `<span id='t${_pid}'>`;
    if( data.icon && data.icon != "none" ) _taskAppend += `<img src='${S.launchpath[_pid]}/${data.icon}'>`;
    _taskAppend += `<span id='tname${_pid}'>${data.name}<span></span>`;
    $( "#tasks" ).append( _taskAppend );
    $( "#t" + _pid ).addClass( "task" ).on({
        click: function() {
            if( process[_pid].isactive || $(this).hasClass("task-min") ) KWS.min( _pid );
            else{
                $("#w"+_pid).css("z-index", KWS.windowIndex + 1);
                KWS.refreshWindowIndex();
            }
        },
        mouseenter: function() {
            $("#task-ctx-name").text(data.name || 'アプリ名なし');
            if( data.icon && data.icon != "none" ) $("#task-ctx-img").attr( "src", System.launchpath[_pid] + "/" + data.icon );
            else $( "#task-ctx-img" ).hide();
            $("#task-ctx-ver").text(data.version + "/pid:" + _pid);
            $("#task-ctx-info").off().on("click", function() { System.appInfo( _pid )});
            $("#task-ctx-sshot").off().on("click", function() { S.screenshot(_pid, true) });
            $("#task-ctx-min").off().on("click", function() { KWS.min( String(_pid) ) });
            if( $(this).hasClass("t-active") ) $( "#task-ctx-front" ).hide();
            else $( "#task-ctx-front" ).show();
            $("#task-ctx-front").off().on('click', function() {
                $("#w"+_pid).css("z-index", KWS.windowIndex + 1);
                KWS.refreshWindowIndex();
            });
            $("#task-ctx-close").off().on("click", () => System.close(_pid));
            $("#task-ctx-kill").off().on("click", () => System.kill( data.id));
            const _ctxleft = $(this).offset().left, _ctxtop = window.innerHeight - $(this).offset().top;
            if( _ctxleft != $("#task-ctx").offset().left ) $("#task-ctx").hide();
            $("#task-ctx").css("left", _ctxleft).css("bottom", _ctxtop).show();
        }
    } );
    $( "section, #kit-tasks" ).on( "mouseenter", function() {
        $( "#task-ctx" ).fadeOut( 200 );
    } );
    $( "#t" + _pid ).on({
        mouseenter: () => {
            prevWindowIndex = $( "#w" + _pid ).css( "z-index" );
            $( "#w" + _pid ).addClass( "win-highlight" );
        },
        mouseleave: () => $( "#w" + _pid ).removeClass( "win-highlight" )
    });

    let _windowAppend = "<div id='w" + _pid + "'><div id='wt" + _pid + "' class='wt'><i class='wmzx'><span id='wm" + _pid + "'></span>";
    if( data.support && data.support['fullscreen'] == true ) _windowAppend += "<span id='wz" + _pid + "'></span>";
    _windowAppend += "<span id='wx" + _pid + "'></span></i>";
    if( data.icon && data.icon != "none" ) _windowAppend += "<img src='" + S.launchpath[_pid]　+ "/" + data.icon + "'>";
    _windowAppend += "<span id='wtname" + _pid + "'>" + data.name + "</span></div><div class='winc winc-" + data.id + "' id='winc" + _pid + "'></div></div>";
    $( "#desktop-" + currentDesktop ).append( _windowAppend );

    if( data.support && data.support['darkmode'] == true ) $("#winc"+_pid).addClass("winc-darkmode");
    if( KWS.darkmode ) $("#winc"+_pid).addClass("kit-darkmode");

    if( data.size ){
        $("#winc"+_pid).css("width", data.size.width).css("height", data.size.height);
    }
    if( data.resize ){
        let _minwidth = 200, _minheight = 40;
        if( data.resize.minWidth ) _minwidth = data.resize.minWidth;
        if( data.resize.minHeight ) _minheight = data.resize.minHeight;
        $("#winc"+_pid).windowResizable({
            minWidth: _minwidth,
            minHeight: _minheight
        });
    }

    let windowPos = 50 + ( _pid % 10 ) * 20;
    KWS.windowIndex ++;
    $( "#w"+_pid ).addClass( "window" ).pep({
        elementsWithInteraction: ".winc, .ui-resizable-handle",
        useCSSTranslation: false,
        disableSelect: false,
        shouldEase:	true,
        initiate: function(){
            $(this.el).addClass("ui-draggable-dragging");
            KWS.windowIndex ++;
            this.el.style.zIndex = KWS.windowIndex;
            KWS.refreshWindowIndex();
        },
        stop: function(){
            this.el.style.transition = "none";
            $(this.el).removeClass("ui-draggable-dragging");
        }
    }).on( "mousedown", function(){
        $(".window").css( "transition", "none" );
        $(this).css("z-index", KWS.windowIndex + 1);
        KWS.refreshWindowIndex();
    } ).css( "left", windowPos + "px" ).css( "top", windowPos + "px" ).css( "z-index",  KWS.windowIndex );
    KWS.refreshWindowIndex();
    if( data.support && data.support['fullscreen'] == true ) $( `#wt${_pid}` ).on("dblclick", () => KWS.max( _pid ));
    $( `#wm${_pid}` ).addClass("wm fa fa-window-minimize").on("click", () => KWS.min( _pid ));
    $( `#wz${_pid}` ).addClass("wz fas fa-square").on("click", () => KWS.max( _pid ));
    $( `#wx${_pid}` ).addClass("wx fa fa-times").on("click", () => System.close( _pid ));
    $( "#winc" + _pid ).resizable( {
        minWidth: "200"
    } ).load( System.launchpath[_pid] + "/" + data.view, (r, s, x) => {
        if( s == "error" ){
            Notification.push("起動に失敗:" + x.status, x.statusText);
            return false;
        }
        if( !data.script || data.script != "none" ) $.getScript( System.launchpath[_pid] + "/" + data.script, () => {
            if( !data.support || data.support['kaf'] != false ) App.kaf(_pid);
            pid++;
        }).fail( () => {
            App.kaf(_pid);
            pid++;
        });
        else if( !data.support || data.support['kaf'] != false ){
            App.kaf(_pid);
            pid++;
        }
        else pid++;
        if( data.css != "none" && $("#kit-style-"+data.id).length == 0 ){
            $( "head" ).append( '<link href="' + System.launchpath[_pid] + '/' + data.css + '" rel="stylesheet" id="kit-style-' + data.id + '"></link>' );
        }
        localStorage.setItem( "kit-pid", pid );
        System.launchLock = false;
    } );
}

const System = new function() {
    this.version = "0.2.1";
    this.username = localStorage.getItem("kit-username");
    this.appdir = localStorage.getItem("kit-appdir");
    this.loc = { ...location };

    this.bootopt = new URLSearchParams(location.search);

    this.mouseX = 0;
    this.mouseY = 0;

    this.display = {
        "width": window.innerWidth,
        "height": window.innerHeight
    }

    this.selectedElement = null;
    this.selectedText = null;

    this.dom = function(_pid, ..._elems) {
        let q = "";
        if( !_elems.length ) q = ",#winc" + _pid;
        else for( let i of _elems ){
            q += ",#winc" + _pid + " " + i;
        }
        return $( q.substring(1) );
    }

    this.qs = ( _pid, ..._elems ) => {
        let q = "";
        if( !_elems.length ) q = ",#winc" + _pid;
        else for( let i of _elems ) q += ",#winc" + _pid + " " + i;
        return document.querySelectorAll( q.substring(1) )
    }

    this.userarea = new Object();
    this.recycle = new Object();

    this.appCache = {};
    //アプリ引数
    this.args = {};
    //アプリ起動パス
    this.launchpath = {};

    this.support = $.support;
    this.debugmode = false;

    this.battery = null;

    this.log = new Array();
    this.noop = () => {}

    this.launchLock = false;
    
    this.waitLaunchUnlock = (callback) => {
        setTimeout(()=>{
            if(this.ajaxLock){
                this.waitLaunchUnlock(callback);
            }else{
                return callback();
            }
        }, 100)
    }

    this.ajaxWait = () =>{
        return new Promise(resolve =>{
             System.waitLaunchUnlock(resolve);
        });
    }

    this.setBattery = function(){
        if( navigator.getBattery ) navigator.getBattery().then((e)=>{
            let _lv =  e.level * 100;
            System.battery = _lv;
            return _lv;
        });
    }

    this.screenshot = function( _pid, _popup ){
        let _elem = document.querySelector("body");
        if( _pid ) _elem = document.querySelector("#w"+_pid);
        html2canvas( _elem ).then(canvas => {
            if( _popup ){
                canvas.style.border = "1px solid #909090";
                S.save( canvas.toDataURL("image/png"), "image" );
            }
            return canvas;
        });
    }

    this.obj2img = function( _obj, _popup ){
        let _elem = _obj[0];
        html2canvas( _elem ).then(canvas => {
            if( _popup ){
                canvas.style.border = "1px solid #909090";
                S.save( canvas.toDataURL("image/png"), "image" );
            }
            return canvas;
        });
    }

    this.save = function(data, type){
        System.launch("fivr", { "save" : data, "type" : type });
    }

    this.open = function(filename){
        System.launch("fivr", { "open" : filename });
    }

    this.preventClose = function( _pid ){
        if( !process[_pid] ) return false;
        process[_pid].preventclose = true;
        return true;
    }
    
    this.shutdown = function(_opt) {
        $( "#last-notification-close" ).click();
        $( "#kit-power-back" ).click();
        for( let i in process ) {
            if( process[i].preventclose == true ){
                S.dialog( "シャットダウンの中断", "pid" + System.appCache[System.launchpath[i]].name + "がシャットダウンを妨げています。<br>強制終了してシャットダウンを続行する場合は[OK]を押下してください。", () => {
                    process[i].preventclose = false;
                    System.shutdown();
                } );
                return false;
            }
            else System.close( i );
        }
        $( "section" ).hide();
        $( "body" ).css( "background-color", "black" );
        $( "header, footer" ).fadeOut( 300 );
        $( "#kit-wallpaper" ).fadeOut( 1500 );
        if( _opt == "reboot" ) location.href = "autorun.html";
        localStorage.setItem("kit-shutted-down", true);
    }

    this.reboot = function() {
        System.shutdown("reboot");
    }

    this.lock = function(){
        System.moveDesktop( "l" );

        $( "#lock-user-icon" ).css( "background", localStorage.getItem( "kit-user-color" ) );
        $( "section, header, footer" ).css( "filter", "none" );
        $( "#kit-wallpaper" ).css( "filter", "blur(20px)" );
        $( "header, footer, #kit-power" ).hide();

        $( "#lock-username" ).text( localStorage.getItem( "kit-username" ) );
        if( localStorage.getItem( "kit-password" ) ) $( "#lock-password" ).show();
        else $( "#lock-password" ).hide();
    }

    this.alert = function( title, content, wtitle ) {
        System.launch("alert", [title, content, wtitle]);
    }

    this.dialog = function( title, content, func ){
        System.launch("dialog", {
            "title": title,
            "content": content,
            "func": func
        });
    }

    this.appInfo = function( _pid ){
        let _title = "", _content = "";
        let ac = System.appCache[S.launchpath[_pid]];
        let _lp = System.launchpath[_pid];
        if( ac ){
            _title = ac.name + " " + ac.version;
            if( ac.icon && ac.icon != "none" ) _content = "<img style='height: 96px' src='" + _lp + "/" + ac.icon + "'><br>";
            for( let i in ac ){
                if( typeof ac[i] != "object" ) _content += "<div><span style='font-weight: 100'>" + i + " </span>" + ac[i] + "</div>";
            }
            _content += "<br><span style='font-weight: 100'>起動パス " + _lp + "</span><br><br>"
        }
        else _title = "取得に失敗しました";
        System.alert( _title, _content );
    }

    this.apps = new Object();
    this.installed = new Array();

    this.close = function( _str ) {
        let _pid = String( _str );
        $( "#w" + _pid ).remove();
        $( "#t" + _pid ).remove();
        $( "#task-ctx" ).hide();
        delete process[_pid];
        KWS.refreshWindowIndex();
    }

    this.kill = function( _str ){
        for( let _pid in process ) {
            if( process[_pid] && process[_pid].id == _str ) System.close( _pid );
        }
    }
    
    this.vacuum = function( _left, _top ){
        KWS.vacuum( _left, _top ); //非推奨です(削除予定)。
    }

    this.time = {
        "obj" : new Date(),
        "y" : "1970",
        "m" : "1",
        "d" : "1",
        "h" : "00",
        "i" : "00",
        "s" : "00",
        "ms" : "0"
    }

    this.clock = function() {
        let DD = new Date();
        S.time.obj = DD;
        let Year = DD.getFullYear();
        S.time.day = DD.getDay();
        S.time.y = Year;
        let Month = ( "00" + Number(DD.getMonth()+1) ).slice( -2 );
        S.time.m = Month;
        let DateN = ( "00" + DD.getDate() ).slice( -2 );
        S.time.d = DateN;
        let Hour = ( "00" + DD.getHours() ).slice( -2 );
        S.time.h = Hour;
        let Min = ( "00" + DD.getMinutes() ).slice( -2 );
        S.time.i = Min;
        let Sec = ( "00" + DD.getSeconds() ).slice( -2 );
        S.time.s = Sec;
        $( ".os-time" ).text( Hour + ":" + Min + ":" + Sec );
        let MS = DD.getMilliseconds();
        S.time.ms = MS;
        let circle = {
            outer: { radius: .9, color: "transparent" },
            inner: { radius: .85, color: "transparent" }
        }
        let lines = {
            long: { from: .8, to: .7, width: 2, color: "#303030" },
            short: { from: .8, to: .75, width: 1, color: "#a0a0a0" }
        }
        let hands = {
            hour: { length: .4, width: 3, cap: "butt", color: "#303030", ratio: .2 },
            minute: { length: .67, width: 2, cap: "butt", color: "#303030", ratio: .2 },
            second: { length: .67, width: 1, cap: "butt", color: "dodgerblue", ratio: .2 }
        }
        let canvas = $(".dropdown-clock-canvas")[0];
        canvas.width = "200", canvas.height = "200";
        let context = canvas.getContext("2d");
        let center = { x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) };
        let radius = Math.min(center.x, center.y), angle, len;
        context.beginPath();context.fillStyle = circle.outer.color;
        context.arc(center.x, center.y, radius * circle.outer.radius, 0, Math.PI * 2, false);
        context.fill();context.beginPath();context.fillStyle = circle.inner.color;
        context.arc(center.x, center.y, radius * circle.inner.radius, 0, Math.PI * 2, false);
        context.fill();
        for( let i=0; i<60; i++ ){
            angle = Math.PI * i / 30;
            context.beginPath();
            let line = ( i%5 == 0 ) ? lines.long : lines.short;
            context.lineWidth = line.width, context.strokeStyle = line.color;
            context.moveTo(center.x + Math.sin(angle) * radius * line.from, center.y - Math.cos(angle) * radius * line.from)
            context.lineTo(center.x + Math.sin(angle) * radius * line.to, center.y - Math.cos(angle) * radius * line.to);
            context.stroke();
        }
        angle = Math.PI * ( Number(Hour)+Number(Min)/60 ) / 6, len = radius * hands.hour.length;
        context.beginPath(), context.lineWidth = hands.hour.width;
        context.lineCap = hands.hour.cap, context.strokeStyle = hands.hour.color;
        context.moveTo(center.x - Math.sin(angle) * len * hands.hour.ratio, center.y + Math.cos(angle) * len * hands.hour.ratio);
        context.lineTo(center.x + Math.sin(angle) * len, center.y - Math.cos(angle) * len), context.stroke();
        angle = Math.PI * ( Number(Min)+Number(Sec) / 60) / 30, len = radius * hands.minute.length;
        context.beginPath(), context.lineWidth = hands.minute.width;
        context.lineCap = hands.minute.cap, context.strokeStyle = hands.minute.color;
        context.moveTo(center.x - Math.sin(angle) * len * hands.minute.ratio, center.y + Math.cos(angle) * len * hands.minute.ratio);
        context.lineTo(center.x + Math.sin(angle) * len, center.y - Math.cos(angle) * len), context.stroke();
        angle = Math.PI * Number(Sec) / 30, len = radius * hands.second.length;
        context.beginPath(), context.lineWidth = hands.second.width;
        context.lineCap = hands.second.cap, context.strokeStyle = hands.second.color;
        context.moveTo(center.x - Math.sin(angle) * len * hands.second.ratio, center.y + Math.cos(angle) * len * hands.second.ratio);
        context.lineTo(center.x + Math.sin(angle) * len, center.y - Math.cos(angle) * len), context.stroke();
    }

    this.changeWallpaper = function( str ) {
        $( "#kit-wallpaper" ).css( "background", str ).css( "background-size", "cover" );
        localStorage.setItem( "kit-wallpaper", str )
    }

    this.moveDesktop = function( str ) {
        str = String( str );
        $( "section" ).hide();
        $( "#desktop-" + str ).show();
        $( "#desktops" ).html( "<span class='far fa-clone'></span>Desktop" + str );
        currentDesktop = str;
    }

    this.avoidMultiple = function( _pid, _alert ) {
        let _id = process[_pid].id;
        let _cnt = 0;
        for( let i in process ) {
            if( process[i].id == _id ) _cnt += 1;
        }
        Notification.push( "debug", _cnt );
        if( _cnt > 1 ) {
            System.close( _pid );
            if( !_alert ){
                System.alert( "多重起動", "アプリケーション" + _id + "が既に起動しています。このアプリケーションの多重起動は許可されていません。" );
            }
        }
        return _cnt;
    }

    this.resizable = function( _pid, _elem, _width, _height ){
        let E = ".winc";
        if( _elem ) E = String( _elem );
        if( !_width ) _width = null;
        if( !_height ) _height = "100";
        $("#w" + _pid).resizable({
            alsoResize: "#w" + _pid + " " + E,
            minWidth: _width,
            minHeight: _height
        });
    }

    this.initLauncher = function(data){
        $("#launcher-apps").html("");
        System.apps = data;
        for( let i in data ){
            $('#launcher-apps').append(`<div class='launcher-app' data-launch='${i}'><img src='${data[i].icon}'>${data[i].name}</div>`);
        }
        if( !System.bootopt.get('safe') ){
            for( let i of System.installed ){
                $('#launcher-apps').append(`<div class='launcher-app' data-launch='${i.path}' data-define-id='${i.id}'><img src='${i.icon}'>${i.name}</div>`);
            }
        }
        $('.launcher-app').on('click', function(){
            $('#launch').click();
            System.launch( $(this).attr('data-launch') );
        });
    }

    this.launch = async function(path, args) {
        while(this.launchLock) await this.ajaxWait();
        this.launchLock = true;

        let _pid = pid;
        System.args[_pid] = args;
        let _path = path;
        if(_path.lastIndexOf('/') == _path.length - 1) {
            _path = _path.substring(0, _path.length - 1);
        }
        else if(_path.indexOf('/') == -1) {
            _path = System.appdir + _path;
        }

        System.launchpath[_pid] = _path;
    
        if( System.appCache[_path] ) {
            if( KWS.fullscreen.pid ) KWS.unmax(KWS.fullscreen.pid);
            appData( System.appCache[_path] );
        }
        else {
            try{
                $.getJSON( _path + '/define.json', appData ).fail( () => {
                    Notification.push('kitアプリをロードできません。', `${_path}を展開できませんでした。`, 'system');
                } );
            }
            catch(error){
                Notification.push( "System Error", error, "system" );
            }
        }
    }

    this.clip = new function(){
        this.content = null;
        this.history = new Array();

        this.set = function( content ){
            this.content = content;
            this.history.push(content);
            return content;
        }
        this.get = ()=>{ return this.content }
    }

    this.config = new function(){
        this.apps = new Object();
    }

    this.audio = new function(){
        this.level = localStorage["kit-audio-level"] || 100;
        this.silent = false;

        this.list = new Array();

        this.volume = function( _level ){
            $("#dropdown-sound-slider").slider("value", _level);
        }

        this.play = function( _audioid, _src ){
            if( !System.audio.list[_audioid] ){
                System.audio.list[_audioid] = new Audio(_src);
                System.audio.list[_audioid].volume = System.audio.level / 100;
            }
            System.audio.list[_audioid].play();
        }

        this.get = function( _audioid ){
            return System.audio.list[_audioid];
        }

        this.pause = function( _audioid ){
            System.audio.list[_audioid].pause();
        }

        this.stop = function( _audioid ){
            System.audio.list[_audioid].pause();
            System.audio.list[_audioid] = null;
        }

        this.seek = function( _audioid, _time ){
            System.audio.list[_audioid].fastSeek(_time);
        }

        this.mute = function( _audioid, _bool ){
            System.audio.list[_audioid].muted = _bool;
        }
    }
}

const KWS = new function(){
    this.version = "3.2.3";
    this.active = null;

    this.darkmode = false;

    this.changeWindowTitle = function( _pid, _str ){
        $("#tname"+_pid).text( _str );
        $("#wtname"+_pid).text( _str );
    }

    this.min = function( _str ) {
        let _pid = String( _str );
        if( $( "#w" + _pid ).is( ":visible" ) ) {
            $( "#w" + _pid ).css("transition", "none").hide( "drop", {direction: "down"}, 300 );
            $( "#task-ctx" ).effect( "bounce", {distance: 12, times: 1}, 400 );
            $( "#t" + _pid ).addClass( "task-min" );
        }
        else {
            $( "#w" + _pid ).show( "drop", {direction: "down"}, 300 );
            $( "#task-ctx" ).effect( "bounce", {distance: 12, times: 1}, 400 );
            $( "#t" + _pid ).removeClass( "task-min" );
        }
    }

    this.fullscreen = {
        "pid": null,
        "prevWidth": null,
        "prevHeight": null,
        "prevTop": 0,
        "prevLeft": 0
    }

    this.max = function( _pid ){
        let _appcache = System.appCache[System.launchpath[_pid]];
        if( KWS.fullscreen.pid || _appcache.support.fullscreen != true ){
            Notification.push('最大化に失敗', 'ウィンドウの最大化に失敗しました。', 'system');
            return;
        }
        KWS.fullscreen.prevWidth = $("#winc"+_pid).outerWidth();
        KWS.fullscreen.prevHeight = $("#winc"+_pid).outerHeight();
        KWS.fullscreen.prevTop = $("#w"+_pid).offset().top;
        KWS.fullscreen.prevLeft = $("#w"+_pid).offset().left;
        KWS.fullscreen.pid = _pid;
        $( "#wt"+_pid ).addClass("wtmaximize");
        $( "#w"+_pid ).css({
            "top": "0px",
            "left": "0px"
        })
        .addClass("windowmaximize")
        .css("z-index", KWS.windowIndex + 1);
        KWS.refreshWindowIndex();
        KWS.resize( _pid, System.display.width, System.display.height - 30 );
        $("footer").hide();
        $("#kit-header-fullscreen").show().on('click', () => KWS.unmax( _pid ));
    }

    this.unmax = function( _pid ){
        if( _pid != KWS.fullscreen.pid ){
            Notification.push("最大化解除に失敗", "対象がフルスクリーンウィンドウではありません。");
            return;
        }
        $('#wt'+_pid).removeClass("wtmaximize");
        $('#w'+_pid).css({
            "top": KWS.fullscreen.prevTop,
            "left": KWS.fullscreen.prevLeft
        })
        .removeClass("windowmaximize");
        $("footer").show();
        $("#kit-header-fullscreen").hide().off();
        KWS.resize( _pid, KWS.fullscreen.prevWidth, KWS.fullscreen.prevHeight );
        KWS.fullscreen.pid = null;
        KWS.fullscreen.prevWidth = null;
        KWS.fullscreen.prevHeight = null;
        KWS.fullscreen.prevTop = null;
        KWS.fullscreen.prevLeft = null;

        if( !System.appCache[System.launchpath[_pid]].size.height ) {
            System.qs(_pid)[0].style.height = "auto";
        }
    }

    this.vacuum = function( _left, _top ){
        for( let i in process ){
            $("#w"+i).css("transition", ".5s all ease").css("left", _left ).css("top", _top );
        }
        setTimeout(() => {
            $(".window").css("transition", "none");
        }, 500);
    }

    this.active = null;
    this.windowIndex = 1;

    this.refreshWindowIndex = function(){
        let num = $(".window").length;
        let array = new Array();
        let obj = new Object();
        for( let i = 0; i < num; i++ ){
            obj = { id: $(".window")[i].id, zindex: $(".window")[i].style.zIndex };
            array.push( obj );
        };
        array.sort( (a,b) => {
            return Number(a.zindex - b.zindex);
        } );
        for( let i in array ){
            document.getElementById(array[i].id).style.zIndex = i;
            let _pid = String(array[i].id).substring(1);
            if( i == num-1 ){
                $("#"+array[i].id).addClass("windowactive");
                $("#t"+_pid).addClass("t-active");
                KWS.active = _pid;
                process[_pid].isactive = true;
                KWS.screenPrevSwitched = new Date();
                localStorage.setItem('kit-screentime', JSON.stringify(KWS.screenTime));
            }
            else{
                $("#"+array[i].id).removeClass("windowactive");
                $("#t"+_pid).removeClass("t-active");
                process[_pid].isactive = false;
                if( KWS.active == _pid ){
                    let _diff = (new Date() - KWS.screenPrevSwitched);
                    let _appid = process[_pid].id
                    if( !KWS.screenTime[_appid] ) KWS.screenTime[_appid] = new Number();
                    if( _diff < 0 ) Notification.push('debug', 'スクリーンタイムの記録に失敗しました。', 'system')
                    else KWS.screenTime[_appid] += _diff;
                }
            }
        }
        KWS.windowIndex = num;
    }

    this.front = function( _pid ) {
        $(`#w${_pid}`).css("z-index", KWS.windowIndex + 1);
        KWS.refreshWindowIndex();
    }

    this.resize = function( _pid, _width, _height ){
        if( _width ) $("#winc"+_pid).css("width", _width)
        if( _height ) $("#winc"+_pid).css("height", _height);
    }

    this.setTheme = function(_name){
        localStorage.setItem('kit-theme', _name);
        if(_name != 'none') $('#kit-theme-file').attr('href', `./system/theme/${localStorage.getItem('kit-theme')}`);
        else $('#kit-theme-file').attr('href', '');
        System.moveDesktop(currentDesktop);
    }

    this.screenTime = new Object();

    this.screenPrevSwitched = new Date();

    this.fusen = new function(){
        this.fid = 0;
        this.list = new Object();

        this.add = function(_text){
            KWS.fusen.list[KWS.fusen.fid] = String(_text);
            $("#desktop-"+currentDesktop).append("<div class='kit-fusen' id='kit-f"+KWS.fusen.fid+"'><i class='fa fa-quote-left'></i><textarea class='kit-fusen-textarea kit-selectable' data-fid='"+KWS.fusen.fid+"' kit-context='fusen'>"+_text+"</textarea></div>");
            $("#kit-f"+KWS.fusen.fid).css({
                "left": Number(KWS.fusen.fid)*40 + 20,
                "top": Number(KWS.fusen.fid)*10 + 100,
            }).pep({
                elementsWithInteraction: ".kit-fusen-textarea",
                useCSSTranslation: false,
                disableSelect: false,
                shouldEase:	true,
                initiate: function(){
                    $(this.el).css("ui-opacity", "0.7");
                },
                stop: function(){
                    this.el.style.transition = "none";
                    $(this.el).css("ui-opacity", "1.0");
                }
            })
            $(".kit-fusen-textarea").off().on("change",function(){
                KWS.fusen.list[$(this).attr("data-fid")] = $(this).val();
                localStorage.setItem("kit-fusen", JSON.stringify( KWS.fusen.list ));
            });
            localStorage.setItem("kit-fusen", JSON.stringify( KWS.fusen.list ));
            KWS.fusen.fid++;
        }

        this.remove = function(_fid){
            delete KWS.fusen.list[_fid];
            localStorage.setItem("kit-fusen", JSON.stringify( KWS.fusen.list ));
            $("#kit-f"+_fid).remove();
        }
    }

    this.addCustomContext = function( _elem, _contextid, _obj ){
        KWS.context[_contextid] = _obj;
    }

    this.context = {
        "fusen" : {
            "name" : "ふせん",
            "delete" : {
                "label" : "ふせんを削除",
                "icon" : "fa-trash-alt",
                "function" : function(){
                    KWS.fusen.remove( S.selectedElement.attr("data-fid") );
                }
            },
            "copy" : {
                "label" : "ふせんを複製",
                "icon" : "fa-copy",
                "function" : function(){
                    KWS.fusen.add( KWS.fusen.list[S.selectedElement.attr("data-fid")] );
                }
            }
        }
    }
}

const Notification = new function() {
    this.nid = 0;
    this.list = new Object();

    this.goodnight = false;
    this.sound = null;

    this.push = function( _title, _content, _app, _pid, _action, _img, _buttons ) {
        let _nid = this.nid;
        if( !System.debugmode && ( _title == "debug" || _app == "debug" ) ){
            return false;
        }
        Notification.list[_nid] = {
            title: _title,
            content: _content,
            app: _app,
            time: System.time.obj.toLocaleString(),
            pid: _pid,
            action: () => {
                if( typeof _action == 'function' ) _action();
                else if( _pid ) KWS.front(_pid);
                $('#notifications').hide('drop', {direction: 'right'}, 300);
            },
            img: _img
        };
        if( _pid && System.appCache[System.launchpath[_pid]] ){
            _app = `<img src='${System.launchpath[_pid]}/${System.appCache[System.launchpath[_pid]].icon}'>${System.appCache[System.launchpath[_pid]].name}`;
        }
        if( !this.goodnight ){
            if( this.sound ) System.audio.play( "n" + this.nid, this.sound );
            $('#last-notification-title').text('').text( _title );
            $('#last-notification-content').text('').text( _content );
            $('#last-notification-app').text('').html( _app );
            $('#last-notification').hide().show('drop', {direction: "right"}, 300).off().on('click', Notification.list[this.nid].action);
            if( _img ) $('#last-notification-img').attr('src', _img).show();
            else $('#last-notification-img').attr('src', '').hide();
        }
        let imgtag = '';
        if( _img ) imgtag = `<img src='${_img }' alt='' class='notis_img'>`;
        $(`<div class='notis' id='nt${_nid}'>
                ${imgtag}
                <span class='notis_close' id='nc${_nid}'></span>
                <div class='notis_app'>${_app}</div>
                <span>${_title}</span>
                ${_content}
                <div class='notis_buttons'></div>
                <div class='notis_time'>${System.time.obj.toTimeString()}</div>
            </div>`).appendTo('#notifications').on('click', Notification.list[this.nid].action);
        $(`#nc${_nid}`).on('click', (e) => {
            e.stopPropagation();
            $(`#nt${_nid}`).fadeOut(300);
        });
        $('#last-notification-buttons').html('');
        if( _buttons ){
            for( let b of _buttons ){
                $(`<a>${b.label}</a>`).appendTo('#last-notification-buttons').on('click', (e) => {
                    e.stopPropagation();
                    b.func();
                });
                $(`<a>${b.label}</a>`).appendTo(`#nt${_nid} .notis_buttons`).on('click', (e) => {
                    e.stopPropagation();
                    b.func();
                });
            }
        }
        this.nid ++;
        return (this.nid - 1);
    }
}

class App {
    constructor(_pid) {
        App.e[_pid] = new Object();
        App.d[_pid] = new Object();
        
        this.process = process[_pid];
        this.cache = System.appCache[System.launchpath[_pid]];

        this.args = System.args[_pid];
        this.close = () => System.close(_pid);
        this.d = App.d[_pid];
        this.dom = (..._args) => System.dom(_pid, ..._args);
        this.e =  App.e[_pid];
        this.ntf = (_title, _content, _action, _img, _buttons) => Notification.push(_title, _content, this.info.id, _pid, _action, _img, _buttons);
        this.qs = (...args) => System.qs(_pid, ...args);
        this.front = () => KWS.front(_pid);

        this.changeWindowTitle = _t => App.changeWindowTitle( _pid, _t );
        this.data = (_name, _value) => App.data(_pid, _name, _value);
        this.event = (_name, _event) => App.event(_pid, _name, _event);
        this.getPath = _path => App.getPath(_pid, _path);
        this.kaf = () => App.kaf(_pid);
        this.load = _path => App.load(_pid, _path);
        this.preventClose = _bool => App.preventClose(_pid, _bool);
    }

    static changeWindowTitle( _pid, _t ) {
        $( "#tname"+_pid ).text( _t );
        $( "#wtname"+_pid ).text( _t );
        process[_pid].title = _t;
        return App;
    }

    static context( _cid, _obj ) {
        KWS.context[ _cid ] = _obj;
        return App;
    }

    static data( _pid, _name, _value ) {
        if( _value !== undefined ) {
            S.dom(_pid, `[kit\\:bind=${_name}]`).val( _value );
            S.dom(_pid, `[kit\\:observe=${_name}]`).text( _value );
            if( _value ) S.dom(_pid, `[kit\\:if=${_name}]`).show();
            else S.dom(_pid, `[kit\\:if=${_name}]`).hide();
            return App.d[_pid][_name] = _value;
        }
        else if( _name ) return App.d[_pid][_name];
        else return App.d[_pid];
    }

    static event( _pid, _name, _event ) {
        if( !App.e[_pid] ) App.e[_pid] = new Object();
        if( !_event && App.e[_pid][_name] ) App.e[_pid][_name].call();
        else App.e[_pid][_name] = _event;
        return App;
    }

    static getPath( _pid, _path ) {
        if( String(_path)[0] != '/' ) _path = '/' + _path;
        return System.launchpath[_pid] + _path;
    }

    static kaf( _pid ) {
        let attrs = [
            "[kit-ref]",
            "[kit-e]",
            "[kit-src]",
            "[kit-alert]",
            "[kit-launch]",
            "[kit-close]",
            "[kit-text]",
            "[kit-html]",
            "[kit\\:bind]",
            "[kit\\:observe]",
            "[kit\\:value]",
            "[kit-value]",
            "[kit-color]",
            "[kit\\:if]",
            "[kit-if]"
        ]
        const PID = _pid;
        const DATA = App.data(_pid);
        const ARGS = System.args[_pid];
        for( let i of S.qs(_pid, ...attrs) ){
            if( i.hasAttribute("kit-ref") ){
                $(i).on("click", () => App.load(_pid, i.getAttribute("kit-ref")) );
            }
            if( i.hasAttribute("kit-e") ){
                let _eqs = i.getAttribute("kit-e").split(",");
                for( let k of _eqs ){
                    let _eq = k.split(" ");
                    $(i).on( _eq[1]||"click", App.e[_pid][_eq[0]] );
                }
            }
            if( i.hasAttribute("kit-src") ){
                $(i).attr("src", `${System.launchpath[_pid]}/${i.getAttribute("kit-src")}` );
            }
            if( i.hasAttribute("kit-alert") ){
                $(i).on("click", ()=> System.alert( System.appCache[System.launchpath[_pid]].name, i.getAttribute("kit-alert") ) );
            }
            if( i.hasAttribute("kit-launch") ){
                $(i).on("click", ()=> System.launch( i.getAttribute("kit-launch") ) );
            }
            if( i.hasAttribute("kit-close") ){
                $(i).on("click", ()=> System.close( i.getAttribute("kit-close") || _pid ) );
            }
            if( i.hasAttribute("kit-text") ){
                $(i).text( eval(i.getAttribute("kit-text")) );
            }
            if( i.hasAttribute("kit-html") ){
                $(i).html( eval(i.getAttribute("kit-html")) );
            }
            if( i.hasAttribute("kit:bind") ){
                if( App.d[_pid] == undefined ) App.d[_pid] = new Object();
                $(i).on('keydown keyup keypress change', () => {
                    let _name = i.getAttribute("kit:bind");
                    App.d[_pid][_name] = i.value;
                    S.dom(_pid, `[kit\\:observe=${_name}]`).text( i.value );
                    if( i.value ) S.dom(_pid, `[kit\\:if=${_name}]`).show();
                    else S.dom(_pid, `[kit\\:if=${_name}]`).hide();
                } );
            }
            if( i.hasAttribute("kit:observe") ){
                $(i).text( App.d[_pid][i.getAttribute("kit:observe")] );
            }
            if( i.hasAttribute("kit:value") ){
                $(i).val( App.d[_pid][i.getAttribute("kit:value")] );
            }
            if( i.hasAttribute("kit-value") ){
                $(i).val( eval(i.getAttribute("kit-value")) );
            }
            if( i.hasAttribute("kit-color") ){
                $(i).css('color', i.getAttribute("kit-color"));
            }
            if( i.hasAttribute("kit:if") ){
                if( App.d[_pid][i.getAttribute("kit:if")] ){
                    $(i).show();
                }
                else $(i).hide();
            }
            if( i.hasAttribute("kit-if") ){
                if( eval( i.getAttribute("kit-if")) ){
                    $(i).show();
                }
                else $(i).hide();
            }
        }
    }

    static load( _pid, _path ) {
        if( String(_path)[0] != '/' ) _path = '/' + _path;
        _path = System.launchpath[_pid] + _path;
        S.dom(_pid).load( _path, () => {
            App.kaf(_pid);
            let _appcache = System.appCache[System.launchpath[_pid]];
            if( !KWS.fullscreen.pid && !_appcache.size.height ) {
                System.qs(_pid)[0].style.height = "auto";
            }
        } );
        return App;
    }

    static preventClose( _pid, _bool = true ) {
        process[_pid].preventclose = _bool || true;
        return App;
    }
}

App.d = new Object();
App.e = new Object();
App.version = "2.1.1";

var process = {}, pid = 0, app, currentDesktop = 1, currentCTX = "", prevWindowIndex, S;
