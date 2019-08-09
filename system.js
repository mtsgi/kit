"use strict";

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

    if( localStorage.getItem( "kit-installed" ) ) System.installed = JSON.parse( localStorage.getItem( "kit-installed" ) );

    if( localStorage["kit-userarea"] ) System.userarea = JSON.parse(localStorage["kit-userarea"]);
    if( localStorage["kit-recycle"] ) System.recycle = JSON.parse(localStorage["kit-recycle"]);

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
        System.alert( "セーフブート", "現在、kitをセーフモードで起動しています。<br><a class='kit-hyperlink' onclick='System.reboot()'>通常モードで再起動</a>", "system" );
    }
    else for( let i of System.startup ) if( i != "" ) launch( i );
    
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
    //デスクトップアイコン
    $.getJSON("config/desktop.json", (data) => {
        for( let i in data ){
            $(".desktop-icons").append("<div class='desktop-icon' data-launch='" + i + "'><img src='" + data[i].icon + "'>" + data[i].name + "</div>");
        }
        $(".desktop-icon").on("click", function(){
            launch( $(this).attr("data-launch") );
        });
    }).fail( function() {
        Notification.push( "読み込みに失敗", "デスクトップ(config/desktop.json)の読み込みに失敗しました。", "system" );
    } );
    //ランチャー
    $.getJSON("config/apps.json", System.initLauncher).fail( function() {
        Notification.push( "ランチャー初期化失敗", "アプリケーション一覧(config/apps.json)の読み込みに失敗しました。", "system" );
    } );
    $( "#kit-tasks" ).delegate( ".task", "click", function() {
        System.close( this.id.slice( 1 ) );
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
        $( "#kit-wallpaper" ).css( "filter", "blur(5px)" );
        $( "footer, header, #launcher, #task-ctx, .dropdown, #desktop-" + currentDesktop ).hide();
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
            $( "section, #task-ctx" ).hide();
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

    $("#kit-header-user").on("click", ()=>{
        launch("user");
    });

    //コンテキストメニュー
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

    $( document ).delegate( "a", "click", function() {
        if( this.href ) {
            launch( localStorage.getItem( "kit-default-browser" ), { "url" : this.href } );
            return false;
        }
    } ).on("mousemove", function(event){
        System.mouseX = event.clientX;
        System.mouseY = event.clientY;
    }).delegate( ".textbox", "keypress", function( e ) {
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

function launch( str, args, dir ) {
    pid = processID;
    System.args[pid] = args;
    System.launchpath[pid] = dir || System.appdir + str;

    if( System.appCache[str] ) {
        if( KWS.fullscreen.pid ) KWS.unmax(KWS.fullscreen.pid);
        //app[str].open();
        appData( System.appCache[str] );
    }
    else {
        try{
            $.getJSON( S.launchpath[pid] + "/define.json", appData ).fail( function() {
                Notification.push("kitアプリをロードできません", str + "を展開できませんでした。アプリが存在しないか、クロスオリジン要求がブロックされている可能性があります。詳細:https://kitdev.home.blog/", "system");
                //System.alert( "起動エラー", "アプリケーションの起動に失敗しました<br>アプリケーション" + str + "は存在しないかアクセス権がありません(pid:" + processID + ")。ヘルプは<a class='kit-hyperlink' href='https://kitdev.home.blog/'>こちら</a>" );
            } );
        }
        catch(error){
            Notification.push( "System Error", error, "system" );
        }
    }
}

function appData( data ) {
    var pid = processID;
    process[String( pid )] = {
        id: data.id,
        time: System.time.obj.toLocaleString(),
        isactive: false,
        preventclose: false,
        title: data.name
    };
    System.appCache[data.id] = data;
    let _taskAppend = "<span id='t" + pid + "'>";
    if( data.icon && data.icon != "none" ) _taskAppend += "<img src='" + S.launchpath[pid] + "/" + data.icon + "'>";
    _taskAppend += "<span id='tname" + pid + "'>" + data.name + "<span></span>";
    $( "#tasks" ).append( _taskAppend );
    //タスクバーのクリック挙動
    $( "#t" + pid ).addClass( "task" ).click( function() {
        if( $(this).hasClass("t-active") || $(this).hasClass("task-min") ) KWS.min( pid );
        else{
            $("#w"+pid).css("z-index", KWS.windowIndex + 1);
            KWS.refreshWindowIndex();
        }
    } );
    $( "#t" + pid ).addClass( "task" ).on( "mouseenter", function() {
        $( "#task-ctx-name" ).text( data.name );
        if( data.icon && data.icon != "none" ) $( "#task-ctx-img" ).attr( "src", System.launchpath[pid] + "/" + data.icon );
        else $( "#task-ctx-img" ).hide();
        $( "#task-ctx-ver" ).text( data.version + "/pid:" + pid );
        $( "#task-ctx-info" ).off().on( "click", function() { System.appInfo( pid )} );
        $( "#task-ctx-sshot" ).off().on( "click", function() { S.screenshot(pid, true) } );
        $( "#task-ctx-min" ).off().on( "click", function() { KWS.min( String(pid) ) } );
        if( $(this).hasClass("t-active") ) $( "#task-ctx-front" ).hide();
        else $( "#task-ctx-front" ).show();
        $( "#task-ctx-front" ).off().on( "click", function() {
            $("#w"+pid).css("z-index", KWS.windowIndex + 1);
            KWS.refreshWindowIndex();
        } );
        $( "#task-ctx-close" ).off().on( "click", () => { System.close( String(pid) ) } );
        $( "#task-ctx-kill" ).off().on( "click", () => { System.kill( String(data.id) ) } );
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
    let _windowAppend = "<div id='w" + pid + "'><div id='wt" + pid + "' class='wt'><i class='wmzx'><span id='wm" + pid + "'></span>";
    if( data.support && data.support.fullscreen == true ) _windowAppend += "<span id='wz" + pid + "'></span>";
    _windowAppend += "<span id='wx" + pid + "'></span></i>";
    if( data.icon && data.icon != "none" ) _windowAppend += "<img src='" + S.launchpath[pid]　+ "/" + data.icon + "'>";
    _windowAppend += "<span id='wtname" + pid + "'>" + data.name + "</span></div><div class='winc winc-" + data.id + "' id='winc" + pid + "'></div></div>";
    $( "#desktop-" + currentDesktop ).append( _windowAppend );

    if( data.support && data.support.darkmode == true ) $("#winc"+pid).addClass("winc-darkmode");
    if( KWS.darkmode ) $("#winc"+pid).addClass("kit-darkmode");

    if( data.size ){
        $("#winc"+pid).css("width", data.size.width).css("height", data.size.height);
    }
    if( data.resize ){
        let _minwidth = 200, _minheight = 40;
        if( data.resize.minWidth ) _minwidth = data.resize.minWidth;
        if( data.resize.minHeight ) _minheight = data.resize.minHeight;
        $("#winc"+pid).windowResizable({
            minWidth: _minwidth,
            minHeight: _minheight
        });
    }

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
    $( "#wm" + pid ).addClass( "wm fa fa-window-minimize" ).click( () => KWS.min( String(pid) ) );
    $( "#wz" + pid ).addClass( "wz fas fa-square" ).click( () => KWS.max( String(pid) ) );
    $( "#wx" + pid ).addClass( "wx fa fa-times" ).click( () => System.close( String(pid) ) );
    $( "#winc" + pid ).resizable( {
        minWidth: "200"
    } ).load( System.launchpath[pid] + "/" + data.view, (r, s, x) =>{
        if( s == "error" ){
            Notification.push("起動に失敗:" + x.status, x.statusText);
            return false;
        }
        if( !data.script || data.script != "none" ) $.getScript( System.launchpath[pid] + "/" + data.script, () => App.kaf(pid) ).fail( () =>  App.kaf(pid) );
        else App.kaf(pid);
        if( data.css != "none" && $("#kit-style-"+data.id).length == 0 ){
            $( "head" ).append( '<link href="' + System.launchpath[pid] + '/' + data.css + '" rel="stylesheet" id="kit-style-' + data.id + '"></link>' );
            //Notification.push("debug", "新規スタイルシートの読み込み", data.id);
        }        
        processID++;
        localStorage.setItem( "kit-pid", processID );
    } );
}

//非推奨メソッド
function close( str ) {
    System.close( str )
}

//非推奨メソッド
function kill( str ) {
    System.kill(str)
}

const System = new function() {
    this.version = "0.2.0";
    this.username = localStorage.getItem("kit-username");
    this.appdir = localStorage.getItem("kit-appdir");

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
                S.dialog( "シャットダウンの中断", "pid" + System.appCache[process[i].id].name + "がシャットダウンを妨げています。<br>強制終了してシャットダウンを続行する場合は[OK]を押下してください。", () => {
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

    this.appInfo = function( _pid ){
        let _title = "", _content = "";
        let ac = System.appCache[process[_pid].id];
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

    this.installed = new Array();
 
    //非推奨です(削除予定)。
    this.min = function( _str ) {
        KWS.min( _str );
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
        for( let i in data ){
            $("#launcher-apps").append("<div class='launcher-app' data-launch='" + i + "'><img src='" + data[i].icon + "'>" + data[i].name + "</div>");
        }
        if( !System.bootopt.get("safe") ){
            for( let i of System.installed ){
                $("#launcher-apps").append("<div class='launcher-app' data-define-path='" + i.path + "' data-define-id='" + i.id + "'><img src='" + i.icon + "'>" + i.name + "</div>");
            }
        }
        $(".launcher-app").on("click", function(){
            $("#launch").click();
            if( $(this).attr("data-launch") ) launch( $(this).attr("data-launch") );
            else if( $(this).attr("data-define-path") ){
                launch( $(this).attr("data-define-id"), null, $(this).attr("data-define-path") );
            };
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
    this.version = "3.2.2";
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
        if( KWS.fullscreen.pid ){
            Notification.push("最大化に失敗", "最大化しているウィンドウがあります。");
            return;
        }
        $( "#wt"+_pid ).addClass("wtmaximize");
        $( "#w"+_pid ).css({
            "top": "0px",
            "left": "0px"
        })
        .addClass("windowmaximize")
        .css("z-index", KWS.windowIndex + 1);
        KWS.refreshWindowIndex();

        KWS.fullscreen.prevWidth = $("#winc"+_pid).outerWidth();
        KWS.fullscreen.prevHeight = $("#winc"+_pid).outerHeight();
        KWS.fullscreen.prevTop = $("#w"+_pid).offset().top;
        KWS.fullscreen.prevLeft = $("#w"+_pid).offset().left;

        KWS.resize( _pid, System.display.width, System.display.height - 30 );
        $("footer").hide();
        $("#kit-header-fullscreen").show().on("click", () => {
            KWS.unmax( _pid );
        });
        KWS.fullscreen.pid = _pid;
    }

    this.unmax = function( _pid ){
        if( _pid != KWS.fullscreen.pid ){
            Notification.push("最大化解除に失敗", "対象がフルスクリーンウィンドウではありません。");
            return;
        }
        $( "#wt"+_pid ).removeClass("wtmaximize");
        $( "#w"+_pid ).css({
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
                Notification.push($(this).attr("data-fid"), $(this).val(), "debug");
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

const App = new function() {
    this.changeWindowTitle = ( _pid, _t ) => {
        $( "#tname"+_pid ).text( _t );
        $( "#wtname"+_pid ).text( _t );
        process[_pid].title = _t;
        return App;
    }

    this.context = ( _cid, _obj ) => {
        KWS.context[ _cid ] = _obj;
        return App;
    }

    this.d = new Object();

    this.data = ( _pid, _name ) => {
        let _r;
        if( _name ) _r = App.d[_pid][_name];
        else _r = App.d[_pid];
        return _r;
    }

    this.e = new Object();

    this.event = ( _pid, _name, _event ) => {
        if( !App.e[_pid] ) App.e[_pid] = new Object();
        App.e[_pid][_name] = _event;
        return App;
    }

    this.getPath = ( _pid, _path ) => System.launchpath[_pid] + _path;

    this.kaf = ( _pid ) => {
        let attrs = [
            "[kit-ref]",
            "[kit-e]",
            "[kit-src]",
            "[kit-alert]",
            "[kit-launch]",
            "[kit-close]",
            "[kit-text]",
            "[kit-html]",
            "[kit-bind]"
        ]
        for( let i of S.dom(_pid, ...attrs) ){
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
                $(i).attr("src", System.launchpath[_pid] +"/"+ i.getAttribute("kit-ref") )
            }
            if( i.hasAttribute("kit-alert") ){
                $(i).on("click", ()=> System.alert( System.appCache[ process[_pid].id ].name, i.getAttribute("kit-alert") ) );
            }
            if( i.hasAttribute("kit-launch") ){
                $(i).on("click", ()=> launch( i.getAttribute("kit-launch") ) );
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
            if( i.hasAttribute("kit-bind") ){
                if( App.d[_pid] == undefined ) App.d[_pid] = new Object();
                $(i).on("change", () => App.d[_pid][i.getAttribute("kit-bind")] = $(i).val() );
            }
        }
    }

    this.load = ( _pid, _path ) => {
        S.dom(_pid).load( System.launchpath[_pid] +"/"+ _path, () => {
            App.kaf(_pid);
        } );
        return App;
    }

    this.preventClose = ( _pid, _bool ) => {
        process[_pid].preventclose = _bool || true;
        return App;
    }
}

var process = {}, processID = 0, pid, currentDesktop = 1, currentCTX = "", prevWindowIndex, S;