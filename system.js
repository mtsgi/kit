//   _    _ _   
//  | | _(_) |_ 
//  | |/ / | __|
//  |   <| | |_ 
//  |_|\_\_|\__|
//
// THIS IS THE KIT KERNEL AND KIT WINDOW SYSTEM
// http://web.kitit.ml/
// https://github.com/mtsgi/kit

$( document ).ready( kit );

function kit() {
    S = System;

    if( !localStorage.getItem( "kit-pid" ) ) processID = 0;
    else processID = localStorage.getItem( "kit-pid" );

    if( !localStorage.getItem( "kit-username" ) ) localStorage.setItem( "kit-username", "ユーザー" );
    $( "#kit-header-username" ).text( localStorage.getItem( "kit-username" ) );

    if( localStorage.getItem( "kit-lock" ) == null ) localStorage.setItem( "kit-lock", "false" );

    if( System.bootopt.get("safe") ) $( "#kit-wallpaper" ).css( "background","#404040" );
    else if( localStorage.getItem( "kit-wallpaper" ) ) $( "#kit-wallpaper" ).css( "background", localStorage.getItem( "kit-wallpaper" ) ).css( "background-size", "cover" );

    if( !localStorage.getItem( "kit-default-browser" ) ) localStorage.setItem( "kit-default-browser", "browser" );

    if( localStorage.getItem("kit-fusen") ){
        this.list = JSON.parse(localStorage.getItem("kit-fusen"));
        for( let i in this.list ){
            KWS.fusen.add(this.list[i]);
        }
    }

    //if( !localStorage.getItem( "kit-debugmode" ) ) localStorage.setItem( "kit-debugmode", "false" );
    //if( localStorage.getItem( "kit-debugmode" ) == "true" ) System.debugmode = true;
    //else System.debugmode = false;

    if( localStorage.getItem("kit-darkmode") == "true" ){
        KWS.darkmode = true;
        $("#kit-darkmode").attr("href", "system/theme/kit-darkmode.css");
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

    if( localStorage["kit-userarea"] ) System.userarea = JSON.parse(localStorage["kit-userarea"]);

    System.moveDesktop( "1" );

    var clockmove;
    if( System.bootopt.get("safe") ) clockmove = setInterval( System.clock, 1000 );
    else  clockmove = setInterval( System.clock, 10 );

    Notification.push( "kitへようこそ", localStorage["kit-username"] + "さん、こんにちは。", "system" );
    //スタートアップ
    if( localStorage.getItem( "kit-startup" ) == undefined ) {
        localStorage.setItem( "kit-startup", new Array( "welcome" ) );
    }
    System.startup = localStorage.getItem( "kit-startup" ).split( "," );
    if( System.bootopt.get("safe") ){
        Notification.push( "セーフブート", "現在、kitをセーフモードで起動しています。", "system" );
        System.alert( "セーフブート", "現在、kitをセーフモードで起動しています。<br><a class='kit-hyperlink' onclick='location.href=\"index.html\";'>通常モードで再起動</a>", "system" );
    }
    else for( let i of System.startup ) if( i != "" ) launch( i );

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
    //ランチャー
    $.getJSON("config/apps.json", System.initLauncher).fail( function() {
        Notification.push( "ランチャー初期化失敗", "アプリケーション一覧(config/apps.json)の読み込みに失敗しました。", system );
    } );
    $( "#kit-tasks" ).delegate( ".task", "click", function() {
        close( this.id.slice( 1 ) );
        $( this ).hide();
    } );
    //通知バー
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
    //電源管理
    $( ".power-button" ).click( function() {
        $( "#notifications" ).hide( "drop", {direction: "right"}, 300 );
        $( "#last-notification" ).hide( "drop", {direction: "right"}, 300 );
        $( "section, header, footer, #kit-wallpaper, .dropdown" ).css( "filter", "blur(5px)" );
        $( "#kit-power" ).fadeIn( 300 );
    } );
    $( "#kit-power-back" ).click( function() {
        $( "section, header, footer, #kit-wallpaper, .dropdown" ).css( "filter", "none" );
        $( "#kit-power" ).fadeOut( 300 );
    } );
    $( "#kit-power-shutdown" ).click( function() {
        System.shutdown();
    } );
    $( "#kit-power-reboot" ).click( function() {
        System.reboot();
    } );
    $( "#kit-power-suspend" ).click( function() {
        $( "section, header, footer, #kit-wallpaper" ).css( "filter", "none" );
        $( "#kit-power" ).fadeOut( 300 );
        System.alert("サスペンド機能", "サスペンド機能はこのバージョンのkitではサポートされていません。");
    } );
    $( "#kit-power-lock" ).click( function() {
        System.lock();
    } );
    $( "#lock-password" ).keypress( function( e ) {
        if( e.which == 13 ) $( "#lock-unl" ).click();
    } );
    $( "#lock-unl" ).click( function() {
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
    //ランチャー起動
    $( "#launch" ).click( function() {
        $( "#notifications" ).hide( "drop", {direction: "right"}, 300 );
        if( $( "#launcher" ).is( ":visible" ) ) {
            $( "#kit-wallpaper" ).css( "filter", "none" );
            $( "#desktop-" + currentDesktop ).show();
            $( "#launcher" ).hide();
        }
        else {
            $( "#kit-wallpaper" ).css( "filter", "blur(5px)" )
            $( "section" ).hide();
            $( "#launcher" ).show();
        }
    } );

    //検索バー
    $( "#milp" ).val( "" ).on( "focus", function() {
        $( "#kit-milp" ).show();
    } ).on( "blur", function() {
        $( "#kit-milp" ).fadeOut( 200 );
    } ).on( 'keydown keyup keypress change', function() {
        $( "#kit-milp-text" ).text( $( this ).val() );
    } ).keypress( function( e ) {
        if( e.which == 13 ) $( "#kit-milp-launch" ).click();
    } );
    $( "#kit-milp-launch" ).click( function() {
        if( $("#milp").val() == "kit" ){
            System.alert("", "<div style='text-align:left;'>　＿　　　　＿　＿　<br>｜　｜　＿（＿）　｜＿　<br>｜　｜／　／　｜　＿＿｜<br>｜　　　〈｜　｜　｜＿　<br>｜＿｜＼＿ ＼ ＿＼＿＿｜</div><hr>", S.version);
            return;
        }
        let _app = $( "#milp" ).val().split(",")[0];
        let _args = null;
        try {
            if( $( "#milp" ).val().split(",")[1] ){
                _args = JSON.parse( $( "#milp" ).val().split(",").slice(1).join() );
            }
        }
        catch(error) {
            Notification.push("引数の解釈に失敗", error, "system");
        }
        launch( _app, _args );
    } );
    $( "#kit-milp-search" ).click( function() {
        launch( "browser", { "url" : "https://www.bing.com/search?q=" + $( "#milp" ).val() } );
    } );
    $( "#kit-milp-wikipedia" ).click( function() {
        launch( "browser", { "url" : "https://ja.wikipedia.org/wiki/" + $( "#milp" ).val() } );
    } );

    //サウンドドロップダウン
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

    //コンテキストメニュー
    $(":root section:not(#desktop-l)").on("contextmenu", function() {
        let _ptelem = $( document.elementFromPoint(S.mouseX, S.mouseY) );
        S.selectedElement = _ptelem;
        $( "#kit-context-input" ).val( _ptelem.text() );
        $( "#kit-context-elem" ).text( _ptelem.prop("tagName").toLowerCase() + "要素" );
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
        launch( "browser", { "url" : "https://www.bing.com/search?q=" + $( "#kit-context-input" ).val() } );
    });
    $( "#kit-context-input" ).keypress( function( e ) {
        if( e.which == 13 ) $( "#kit-context-search" ).click();
    } );
    $("#kit-context a").on("click", function(){
        $("#kit-context").fadeOut(300);
    });

    $("#kit-context-vacuum").on("click", function(){
        for( let i in process ){
            $("#w"+i).css("transition", ".5s all ease").css("left", S.mouseX - Number( $("#w"+i).innerWidth() / 2 ) ).css("top", S.mouseY - Number( $("#w"+i).innerHeight() / 2 ) );
        }
        setTimeout(() => {
            $(".window").css("transition", "none");
        }, 500);
    });

    $("section").on("click", function(){
        $("#kit-context").fadeOut(300);
    })

    $( document ).delegate( "a", "click", function() {
        if( this.href ) {
            launch( localStorage.getItem( "kit-default-browser" ), { "url" : this.href } );
            return false;
        }
    } ).on("mousemove", function(event){
        System.mouseX = event.clientX;
        System.mouseY = event.clientY;
    }).delegate( ".textbox", "keypress", function( e ) {
        if( e.which == 13 && this.id && $("#" + this.id + " + .kit-button") ){
            Notification.push("debug", this.id, "system");
            $("#" + this.id + " + .kit-button").click();
        }
    } );

    if( localStorage.getItem( "kit-lock" ) == "true" ){
        $("section").hide();
        setTimeout(() => {
            System.lock();
        }, 100);
    }
}

function launch( str, args ) {
    pid = processID;
    System.args[pid] = args;
    if( System.appCache[str] ) {
        //app[str].open();
        appData( System.appCache[str] );
    }
    else {
        try{
            $.getJSON( S.appdir + str + "/define.json", appData ).fail( function() {
                System.alert( "起動エラー", "アプリケーションの起動に失敗しました<br>アプリケーション" + str + "は存在しないかアクセス権がありません(pid:" + processID + ")。ヘルプは<a class='kit-hyperlink' href='https://kitdev.home.blog/'>こちら</a>" );
            } );
        }
        catch(error){
            Notification.push( "System Error", error, system );
        }
    }
}

function appData( data ) {
    var pid = processID;
    process[String( pid )] = {
        id: data.id,
        time: System.time.obj.toLocaleString(),
        isactive: false,
        preventclose: false
    };
    System.appCache[data.id] = data;
    $( "#tasks" ).append( "<span id='t" + pid + "'><img src='./app/" + data.id + "/" + data.icon + "'><span id='tname" + pid + "'>" + data.name + "<span></span>" );
    //タスクバーのクリック挙動
    $( "#t" + pid ).addClass( "task" ).click( function() {
        if( $(this).hasClass("t-active") || $(this).hasClass("task-min") ) System.min( pid );
        else{
            $("#w"+pid).css("z-index", KWS.windowIndex + 1);
            KWS.refreshWindowIndex();
        }
    } );
    $( "#t" + pid ).addClass( "task" ).on( "mouseenter", function() {
        $( "#task-ctx-name" ).text( data.name );
        $( "#task-ctx-img" ).attr( "src", "./app/" + data.id + "/" + data.icon );
        $( "#task-ctx-ver" ).text( data.version + "/pid:" + pid );
        $( "#task-ctx-info" ).off().on( "click", function() {appInfo( data.id )} );
        $( "#task-ctx-sshot" ).off().on( "click", function() { S.screenshot(pid, true) } );
        $( "#task-ctx-min" ).off().on( "click", function() { S.min( String(pid) ) } );
        if( $(this).hasClass("t-active") ) $( "#task-ctx-front" ).hide();
        else $( "#task-ctx-front" ).show();
        $( "#task-ctx-front" ).off().on( "click", function() {
            $("#w"+pid).css("z-index", KWS.windowIndex + 1);
            KWS.refreshWindowIndex();
        } );
        $( "#task-ctx-close" ).off().on( "click", function() { close( String(pid) ) } );
        $( "#task-ctx-kill" ).off().on( "click", function() { kill( String(data.id) ) } );
        const _ctxleft = $( "#t" + pid ).offset().left;
        const _ctxtop = window.innerHeight - $( "#t" + pid ).offset().top;
        if( _ctxleft != $( "#task-ctx" ).offset().left ) {
            $( "#task-ctx" ).hide();
        }
        $( "#task-ctx" ).css( "left", _ctxleft ).css( "bottom", _ctxtop ).show();
    } );
    $( "section, #kit-tasks" ).on( "mouseenter", function() {
        $( "#task-ctx" ).fadeOut( 200 );
    } );
    $( "#t" + pid ).hover( function() {
        prevWindowIndex = $( "#w" + pid ).css( "z-index" );
        $( "#w" + pid ).addClass( "win-highlight" );
    }, function() {
        $( "#w" + pid ).removeClass( "win-highlight" );
    } );
    $( "#desktop-" + currentDesktop ).append( "<div id='w" + pid + "'><span id='wm" + pid + "'></span><span id='wx" + pid + "'></span><div id='wt" + pid + "' class='wt'><img src='./app/" + data.id + "/" + data.icon + "'>" + data.name + "</div><div class='winc winc-" + data.id + "' id='winc" + pid + "'></div></div>" );
    if( data.support && data.support.darkmode == true ) $("#winc"+pid).addClass("winc-darkmode");
    var windowPos = 50 + ( pid % 10 ) * 20;
    //$( "#w" + pid ).addClass( "window" ).draggable( {cancel: ".winc", stack: ".window"} ).css( "left", windowPos + "px" ).css( "top", windowPos + "px" ).css( "z-index", $( ".window" ).length + 1 );
    KWS.windowIndex ++;
    $( "#w"+pid ).addClass( "window" ).pep({
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
    $( "#wm" + pid ).addClass( "wm fa fa-window-minimize" ).click( function() {System.min( String( pid ) )} );
    $( "#wx" + pid ).addClass( "wx fa fa-times" ).click( function() {close( String( pid ) )} );
    $( "#winc" + pid ).resizable( {
        minWidth: "200"
    } ).load( "./app/" + data.id + "/" + data.view );

    //スクリプト読み込み
    if( data.script != "none" ) $.getScript( "./app/" + data.id + "/" + data.script );
    if( data.css != "none" && $("#kit-style-"+data.id).length == 0 ){
        $( "head" ).append( '<link href="./app/' + data.id + '/' + data.css + '" rel="stylesheet" id="kit-style-' + data.id + '"></link>' );
        Notification.push("debug", "新規スタイルシートの読み込み", data.id);
    }

    processID++;
    localStorage.setItem( "kit-pid", processID );
}

function appInfo( str ){
    System.appInfo(str) //非推奨です
}

function close( str ) {
    System.close( str ) //非推奨です
}

function kill( str ) {
    System.kill(str) //非推奨です
}

const System = new function() {
    this.version = "0.1.5";
    this.username = localStorage.getItem("kit-username");
    this.appdir = localStorage.getItem("kit-appdir");

    this.bootopt = new URLSearchParams(location.search);

    this.mouseX = 0;
    this.mouseY = 0;

    this.selectedElement = null;

    this.dom = function(_pid, _elements) {
        _elements = _elements || "";
        return $("#winc" + _pid + " " + _elements);
    }

    this.userarea = new Object();

    this.appCache = {};
    //引数
    this.args = {};

    this.support = $.support;
    this.debugmode = false;

    this.battery = null;

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
        launch("fivr", { "save" : data, "type" : type });
    }

    this.open = function(filename){
        launch("fivr", { "open" : filename });
    }
    
    this.shutdown = function() {
        $( "#last-notification-close" ).click();
        $( "#kit-power-back" ).click();
        for( let i in process ) {
            close( i );
            $( "section" ).hide();
        }
        $( "body" ).css( "background-color", "black" );
        $( "header, footer" ).fadeOut( 300 );
        $( "#kit-wallpaper" ).fadeOut( 1500 );
    }

    this.reboot = function() {
        location.reload();
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

    this.alert = function( title, content, winname ) {
        launch( "alert", [title, content, winname] );
    }

    this.dialog = function( title, content, func ){
        launch("dialog", {
            "title": title,
            "content": content,
            "func": func
        })
    }

    this.appInfo = function( str ){
        let _title = "", _content = "";
        let ac = S.appCache[str];
        if( ac ){
            _title = ac.name + " (" + ac.version + ")";
            _content = "<img style='height: 96px' src='./app/" + ac.id + "/" + ac.icon + "'><br>";
            for( let i in ac ){
                _content += "<div><span style='font-weight: 100'>" + i + " </span>" + ac[i] + "</div>";
            }
        }
        else _title = "取得に失敗しました";
        S.alert( _title, _content );
    }

    this.min = function( _str ) {
        KWS.min( _str ); //非推奨です(削除予定)。
    }

    this.close = function( _str ) {
        let _pid = String( _str );
        $( "#w" + _pid ).remove();
        $( "#t" + _pid ).remove();
        $( "#task-ctx" ).hide();
        delete process[_pid];
        KWS.refreshWindowIndex();
    }

    this.kill = function( _str ){
        for( let pid in process ) {
            if( process[pid] && process[pid].id == _str ) System.close( pid );
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
        angle = Math.PI * ( Hour+Min/60 ) / 6, len = radius * hands.hour.length;
        context.beginPath(), context.lineWidth = hands.hour.width;
        context.lineCap = hands.hour.cap, context.strokeStyle = hands.hour.color;
        context.moveTo(center.x - Math.sin(angle) * len * hands.hour.ratio, center.y + Math.cos(angle) * len * hands.hour.ratio);
        context.lineTo(center.x + Math.sin(angle) * len, center.y - Math.cos(angle) * len), context.stroke();
        angle = Math.PI * (Min + Sec / 60) / 30, len = radius * hands.minute.length;
        context.beginPath(), context.lineWidth = hands.minute.width;
        context.lineCap = hands.minute.cap, context.strokeStyle = hands.minute.color;
        context.moveTo(center.x - Math.sin(angle) * len * hands.minute.ratio, center.y + Math.cos(angle) * len * hands.minute.ratio);
        context.lineTo(center.x + Math.sin(angle) * len, center.y - Math.cos(angle) * len), context.stroke();
        angle = Math.PI * Sec / 30, len = radius * hands.second.length;
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
        console.log( _cnt );
        if( _cnt > 1 ) {
            close( _pid );
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
        for( let i in data ){
            $("#launcher-apps").append("<div class='launcher-app' data-launch='" + i + "'><img src='" + data[i].icon + "'>" + data[i].name + "</div>");
        }
        $(".launcher-app").on("click", function(){
            $("#launch").click();
            launch( $(this).attr("data-launch") );
        });
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
    this.version = "3.2.2";
    this.active = null;

    this.darkmode = false;

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

    this.max = function( _pid ){

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
            if( i == num-1 ){
                $("#"+array[i].id).addClass("windowactive");
                $("#t"+String(array[i].id).substring(1)).addClass("t-active");
                KWS.active = String(array[i].id).substring(1);
                process[array[i].id.substring(1)].isactive = true;
            }
            else{
                $("#"+array[i].id).removeClass("windowactive");
                $("#t"+String(array[i].id).substring(1)).removeClass("t-active");
                process[array[i].id.substring(1)].isactive = false;
            }
        }
        KWS.windowIndex = num;
    }

    this.resize = function( _pid, _width, _height ){
        if( _width ) $("#winc"+_pid).css("width", _width)
        if( _height ) $("#winc"+_pid).css("height", _height);
    }

    this.fusen = new function(){
        this.fid = 0;
        this.list = new Object();

        this.add = function(_text){
            KWS.fusen.list[KWS.fusen.fid] = String(_text);
            $("#desktop-"+currentDesktop).append("<div class='kit-fusen' id='kit-f"+KWS.fusen.fid+"'><i class='fa fa-quote-left'></i>"+_text+"</div>");
            $("#kit-f"+KWS.fusen.fid).css("left", Number(KWS.fusen.fid)*20 + 20).pep({
                elementsWithInteraction: ".winc, .ui-resizable-handle",
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
            localStorage.setItem("kit-fusen", JSON.stringify( KWS.fusen.list ));
            KWS.fusen.fid++;
        }

        this.remove = function(_fid){
            delete KWS.fusen.list[_fid];
            localStorage.setItem("kit-fusen", JSON.stringify( KWS.fusen.list ));
            $("#kit-f"+KWS.fusen.fid).remove();
        }
    }
}

const Notification = new function() {
    this.nid = 0;
    this.list = new Object();

    this.goodnight = false;
    this.sound = null;

    this.push = function( _title, _content, _app ) {
        if( !System.debugmode && ( _title == "debug" || _app == "debug" ) ){
            return false;
        }
        this.list[this.nid] = {
            "title" : _title,
            "content" : _content,
            "app" : _app,
            "time" : System.time.obj.toLocaleString()
        };
        if( !this.goodnight ){
            if( this.sound ) System.audio.play( "n" + this.nid, this.sound );
            $( "#last-notification-title" ).text("").text( _title );
            $( "#last-notification-content" ).text("").text( _content );
            $( "#last-notification-app" ).text("").text( _app );
            $( "#last-notification" ).hide().show( "drop", {direction: "right"}, 300 );
        }
        $( "#notifications" ).append( "<div class='notis' id='nt" + this.nid + "'><span class='notis_close' id='nc" + this.nid + "'></span><span><span class='fas fa-comment-alt'></span>" + _title + "</span>" + _content + "<div class='notis_time'>" + System.time.obj.toLocaleString() + "</div></div>" );
        $("#nc" + this.nid).on("click", function(){
            let _nid = this.id.slice(2);
            $("#nt" + _nid).fadeOut(300);
            return false;
        } );
        $("#nt" + this.nid).on("click", function(){
            let _nid = this.id.slice(2);
            if( Notification.list[ _nid ].app != "system" ){
                launch(Notification.list[ _nid ].app);
            }
        } );
        this.nid ++;
        return (this.nid - 1);
    }
}

var process = {}, processID = 0, pid, currentDesktop = 1, currentCTX = "", prevWindowIndex, S;