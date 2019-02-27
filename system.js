//   _    _ _   
//  | | _(_) |_ 
//  | |/ / | __|
//  |   <| | |_ 
//  |_|\_\_|\__|
//
// THIS IS THE KIT KERNEL AND KIT WINDOW SYSTEM
// http://web.kitit.ml/
// https://github.com/mtsgi/kit


$( document ).ready( Load );

function Load() {
    S = System;

    if( !localStorage.getItem( "kit-pid" ) ) processID = 0;
    else processID = localStorage.getItem( "kit-pid" );

    if( !localStorage.getItem( "kit-username" ) ) localStorage.setItem( "kit-username", "ユーザー" );
    $( "#kit-header-username" ).text( localStorage.getItem( "kit-username" ) );

    if( localStorage.getItem( "kit-wallpaper" ) ) $( "#kit-wallpaper" ).css( "background", localStorage.getItem( "kit-wallpaper" ) ).css( "background-size", "cover" );

    if( !localStorage.getItem( "kit-default-browser" ) ) localStorage.setItem( "kit-default-browser", "browser" );

    if( !localStorage.getItem( "kit-theme" ) ) localStorage.setItem( "kit-theme", "theme-default.css" );
    $("#kit-theme-file").attr("href", "./system/theme/" + localStorage.getItem("kit-theme") );

    if( !localStorage.getItem( "kit-appdir" ) ) localStorage.setItem( "kit-appdir", "./app/" );
    S.appdir = localStorage.getItem( "kit-appdir" );

    if( localStorage["kit-userarea"] ) System.userarea = JSON.parse(localStorage["kit-userarea"]);

    System.moveDesktop( "1" );

    var clockmove = setInterval( System.clock, 10 );

    //スタートアップ
    if( localStorage.getItem( "kit-startup" ) == undefined ) {
        localStorage.setItem( "kit-startup", new Array( "welcome" ) );
    }
    System.startup = localStorage.getItem( "kit-startup" ).split( "," );
    for( i of System.startup ) {
        if( i != "" ) launch( i );
    }
    Notification.push( "kitへようこそ", localStorage["kit-username"] + "さん、こんにちは。", "system" );

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
    //電源管理
    $( ".power-button" ).click( function() {
        $( "#notifications" ).hide( "drop", {direction: "right"}, 300 );
        $( "section, header, footer, #kit-wallpaper" ).css( "filter", "blur(5px)" );
        $( "#kit-power" ).fadeIn( 300 );
    } );
    $( "#kit-power-back" ).click( function() {
        $( "section, header, footer, #kit-wallpaper" ).css( "filter", "none" );
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
        System.moveDesktop( "l" );

        $( "#lock-user-icon" ).css( "background", localStorage.getItem( "kit-user-color" ) );
        $( "section, header, footer" ).css( "filter", "none" );
        $( "#kit-wallpaper" ).css( "filter", "blur(20px)" );
        $( "header, footer, #kit-power" ).hide();

        $( "#lock-username" ).text( localStorage.getItem( "kit-username" ) );
        if( localStorage.getItem( "kit-password" ) ) $( "#lock-password" ).show();
        else $( "#lock-password" ).hide();
    } );
    $( "#lock-password" ).keypress( function( e ) {
        if( e.which == 13 ) $( "#lock-unl" ).click();
    } );
    $( "#lock-unl" ).click( function() {
        if( !localStorage.getItem( "kit-password" ) || $( "#lock-password" ).val() == localStorage.getItem( "kit-password" ) ) {
            $( "header, footer" ).show();
            $( "section, header, footer, #kit-wallpaper" ).css( "filter", "none" );
            $( "#lock-password" ).val( "" );
            System.moveDesktop( currentDesktop );
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
    } );
    $( "#kit-milp-launch" ).click( function() {
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

    //コンテキストメニュー
    $(":root section").on("contextmenu", function() {
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
    });
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
    process[String( pid )] = data;
    System.appCache[data.id] = data;
    $( "#tasks" ).append( "<span id='t" + pid + "'><img src='./app/" + data.id + "/" + data.icon + "'>" + data.name + "</span>" );
    //タスクバーのクリック挙動
    $( "#t" + pid ).addClass( "task" ).click( function() {
        System.min( pid );
    } );
    $( "#t" + pid ).addClass( "task" ).on( "mouseenter", function() {
        $( "#task-ctx-name" ).text( data.name );
        $( "#task-ctx-img" ).attr( "src", "./app/" + data.id + "/" + data.icon );
        $( "#task-ctx-ver" ).text( data.version + "/pid:" + pid );
        $( "#task-ctx-info" ).off().on( "click", function() {appInfo( data.id )} );
        $( "#task-ctx-sshot" ).off().on( "click", function() { S.screenshot(pid, true) } );
        $( "#task-ctx-min" ).off().on( "click", function() { S.min( String(pid) ) } );
        $( "#task-ctx-close" ).off().on( "click", function() { close( String(pid) ) } );
        $( "#task-ctx-kill" ).off().on( "click", function() { kill( String(data.id) ) } );
        const _ctxleft = $( "#t" + pid ).offset().left;
        const _footertop = Number( $( "footer" ).offset().top ) - 215;
        if( _ctxleft != $( "#task-ctx" ).offset().left ) {
            $( "#task-ctx" ).hide();
        }
        $( "#task-ctx" ).css( "left", _ctxleft ).css( "top", _footertop ).show();
    } );
    $( "section, #kit-tasks" ).on( "mouseenter", function() {
        $( "#task-ctx" ).fadeOut( 200 );
    } );
    $( "#t" + pid ).hover( function() {
        prevWindowIndex = $( "#w" + pid ).css( "z-index" );
        $( "#w" + pid ).addClass( "win-highlight" );
        //$("#w"+pid).css("z-index", "9000");
    }, function() {
        $( "#w" + pid ).removeClass( "win-highlight" );
        //$("#w"+pid).css("z-index", prevWindowIndex);
    } );
    $( "#desktop-" + currentDesktop ).append( "<div id='w" + pid + "'><span id='wm" + pid + "'></span><span id='wx" + pid + "'></span><div id='wt" + pid + "' class='wt'><img src='./app/" + data.id + "/" + data.icon + "'>" + data.name + "</div><div class='winc winc-" + data.id + "' id='winc" + pid + "'></div></div>" );
    var windowPos = 50 + ( pid % 10 ) * 20;
    //$( "#w" + pid ).addClass( "window" ).draggable( {cancel: ".winc", stack: ".window"} ).css( "left", windowPos + "px" ).css( "top", windowPos + "px" ).css( "z-index", $( ".window" ).length + 1 );
    $( "#w" + pid ).addClass( "window" ).pep({
        elementsWithInteraction: ".winc, .ui-resizable-handle",
        useCSSTranslation: false,
        disableSelect: false,
        shouldEase:	true,
        initiate: function(){
            $(this.el).addClass("ui-draggable-dragging");
            $(".window").css("zIndex", "1");
            this.el.style.zIndex = 2;
            S.refreshWindowIndex();
        },
        rest: function(){
            this.el.style.transition = "none";
            $(this.el).removeClass("ui-draggable-dragging");
        }
    }).on( "mousedown", function(){
        $(".window").css( "transition", "none" );
    } ).css( "left", windowPos + "px" ).css( "top", windowPos + "px" ).css( "z-index", $( ".window" ).length + 1 );
    $( "#wm" + pid ).addClass( "wm fa fa-window-minimize" ).click( function() {System.min( String( pid ) )} );
    $( "#wx" + pid ).addClass( "wx fa fa-times" ).click( function() {close( String( pid ) )} );
    $( "#winc" + pid ).resizable( {
        minWidth: "200"
    } ).load( "./app/" + data.id + "/" + data.view );

    //スクリプト読み込み
    if( data.script != "none" ) $.getScript( "./app/" + data.id + "/" + data.script );
    if( data.css != "none" ) $( "head link:last" ).append( '<link href="./app/' + data.id + '/' + data.css + '" rel="stylesheet">' );

    processID++;
    localStorage.setItem( "kit-pid", processID );
}

function appInfo( str ){
    let _title = "", _content = "";
    let ac = S.appCache[str];
    if( ac ){
        _title = ac.name + " (" + ac.version + ")";
        _content = "<img style='height: 96px' src='./app/" + ac.id + "/" + ac.icon + "'><br>";
        for( i in ac ){
            _content += "<div style='font-weight: 100'>" + i + " : " + ac[i] + "</div>";
        }
    }
    else _title = "取得に失敗しました";
    S.alert( _title, _content );
}

//pidからアプリケーションを閉じる
function close( str ) {
    var _pid = String( str );
    $( "#w" + _pid ).remove();
    $( "#t" + _pid ).remove();
    $( "#task-ctx" ).hide();
    delete process[_pid];
}

function kill( str ) {
    for( pid in process ) {
        if( process[pid] && process[pid].id == str ) close( pid );
    }
}

const System = new function() {
    this.version = "0.1.0";
    this.username = localStorage.getItem("kit-username");
    this.appdir = localStorage.getItem("kit-appdir");

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
        for( i in process ) {
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

    this.alert = function( title, content, winname ) {
        launch( "alert", [title, content, winname] );
    }

    this.min = function( str ) {
        var _pid = String( str );
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

    this.time = {
        "obj" : null,
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
        S.time.y = Year;
        let Month = DD.getMonth();
        S.time.m = Month;
        let DateN = DD.getDate();
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
        for( i in process ) {
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

    this.refreshWindowIndex = function(){
        for( let i=0; i<$(".window"); i++){
            console.log( $(".window")[i] );
        };
    }

    this.initLauncher = function(data){
        for(i in data){
            $("#launcher-apps").append("<div class='launcher-app' data-launch='" + i + "'><img src='" + data[i].icon + "'>" + data[i].name + "</div>");
        }
        $(".launcher-app").on("click", function(){
            $("#launch").click();
            launch( $(this).attr("data-launch") );
        });
    }
}

const Notification = new function() {
    this.nid = 0;
    this.list = new Object();

    this.push = function( _title, _content, _app ) {
        this.list[this.nid] = {
            "title" : _title,
            "content" : _content,
            "app" : _app
        };
        $( "#last-notification-title" ).text("").text( _title );
        $( "#last-notification-content" ).text("").text( _content );
        $( "#last-notification-app" ).text("").text( _app );
        $( "#last-notification" ).hide().show( "drop", {direction: "right"}, 300 );
        $( "#notifications" ).append( "<div class='notis' id='nt" + this.nid + "'><span class='notis_close' id='nc" + this.nid + "'></span><span><span class='fas fa-comment-alt'></span>" + _title + "</span>" + _content + "</div>" );
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

var process = {};
var processID = 0, currentDesktop = 1;
var currentCTX = "";
var prevWindowIndex, S;