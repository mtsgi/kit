//   _    _ _   
//  | | _(_) |_ 
//  | |/ / | __|
//  |   <| | |_ 
//  |_|\_\_|\__|
//
//THIS IS THE KIT KERNEL AND KIT WINDOW SYSTEM
//http://web.kitit.ml/

$( document ).ready( Load );

function Load() {
    S = System;

    if( !localStorage.getItem( "kit-pid" ) ) processID = 0;
    else processID = localStorage.getItem( "kit-pid" );

    if( !localStorage.getItem( "kit-username" ) ) localStorage.setItem( "kit-username", "ユーザー" );
    $( "#kit-header-username" ).text( localStorage.getItem( "kit-username" ) );

    if( localStorage.getItem( "kit-wallpaper" ) ) $( "#kit-wallpaper" ).css( "background", localStorage.getItem( "kit-wallpaper" ) ).css( "background-size", "cover" );

    if( !localStorage.getItem( "kit-default-browser" ) ) localStorage.setItem( "kit-default-browser", "browser" );

    System.moveDesktop( "1" );

    var clockmove = setInterval( System.clock, 10 );

    //スタートアップ
    if( localStorage.getItem( "kit-startup" ) == undefined ) {
        localStorage.setItem( "kit-startup", new Array( "welcome" ) );
    }
    System.startup = localStorage.getItem( "kit-startup" ).split( "," );
    for( i in System.startup ) {
        if( System.startup[i] != "" ) launch( System.startup[i] );
    }
    Notification.push( "kitへようこそ", localStorage["kit-username"] + "さん、こんにちは。", processID );

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
    $( "#launcher-apps" ).text( "This function is not implemented yet. / kit ver" + System.version );
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
        System;
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
        $( "#kit-context-search" ).val("");
        $("#kit-context").toggle().css("left", S.mouseX).css("top", S.mouseY);
        return false;
    });
    $( "#kit-context-search" ).keypress( function( e ) {
        if( e.which == 13 ){
            $("#kit-context").fadeOut(300);
            launch( "browser", { "url" : "https://www.bing.com/search?q=" + $( "#kit-context-search" ).val() } );
        }
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
    } ).on("mousemove", function(){
        System.mouseX = event.clientX;
        System.mouseY = event.clientY;
    });

}

function launch( str, args ) {
    appDefine();
    System.args[pid] = args;
    //連想配列から読み込み
    if( System.appCache[str] ) {
        //app[str].open();
        appData( System.appCache[str] );
    }
    //jsonから読み込み
    else {
        $.getJSON( "./app/" + str + "/define.json", appData ).fail( function() {
            System.alert( "起動エラー", "アプリケーションの起動に失敗しました<br>詳細：アプリケーション" + str + "は存在しないかアクセス権がありません(pid:" + processID + ")" );
        } );
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
        $( "#task-ctx-close" ).off().on( "click", function() {close( String( pid ) )} );
        $( "#task-ctx-min" ).off().on( "click", function() {System.min( String( pid ) )} );
        $( "#task-ctx-kill" ).off().on( "click", function() {kill( String( data.id ) )} );
        const _ctxleft = $( "#t" + pid ).offset().left;
        const _footertop = Number( $( "footer" ).offset().top ) - 185;
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
    $( "#w" + pid ).addClass( "window" ).draggable( {cancel: ".winc", stack: ".window"} ).css( "left", windowPos + "px" ).css( "top", windowPos + "px" ).css( "z-index", $( ".window" ).length + 1 );
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

//アプリケーションの内容を定義
function appDefine() {
    pid = processID;
    //app["welcome"] = new Application("welcome", "ようこそ", "far fa-comment-dots", "<div style='text-align:center;padding:4px 12px'><div style='font-size:22px'><strong>kit</strong>Desktop <span style='color:silver'>beta</span></div>バージョン0.0<br>キットデスクトップ環境へようこそ<br><a class='button close-this' onclick='page(\detail\)'>詳細</a> <a class='button' id='close-"+pid+"' onclick='close("+pid+")'>閉じる</a></div>", "0.0.0");
}

const System = new function() {
    this.version = "0.0.6";
    this.username = localStorage["kit-username"];

    this.mouseX = 0;
    this.mouseY = 0;

    this.dom = (_pid, _elements) => {
        return $("#winc" + _pid + " " + _elements);
    }

    this.appCache = {};
    //引数
    this.args = {};

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

    this.alert = function( title, content ) {
        launch( "alert", [title, content] );
    }

    this.min = function( str ) {
        var _pid = String( str );
        if( $( "#w" + _pid ).is( ":visible" ) ) {
            $( "#w" + _pid ).hide( "drop", {direction: "down"}, 300 );
            $( "#task-ctx" ).effect( "bounce", {distance: 12, times: 1}, 400 );
            $( "#t" + _pid ).addClass( "task-min" );
        }
        else {
            $( "#w" + _pid ).show( "drop", {direction: "down"}, 300 );
            $( "#task-ctx" ).effect( "bounce", {distance: 12, times: 1}, 400 );
            $( "#t" + _pid ).removeClass( "task-min" );
        }
    }

    this.clock = function() {
        DD = new Date();
        var Hour = ( "00" + DD.getHours() ).slice( -2 );
        var Min = ( "00" + DD.getMinutes() ).slice( -2 );
        var Sec = ( "00" + DD.getSeconds() ).slice( -2 );
        $( ".os-time" ).text( Hour + ":" + Min + ":" + Sec );
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
    }

    this.avoidMultiple = function( _pid ) {
        var _id = process[_pid].id;
        var _cnt = 0;
        for( i in process ) {
            if( process[i].id == _id ) _cnt += 1;
        }
        console.log( _cnt );
        if( _cnt > 1 ) {
            close( _pid );
            System.alert( "多重起動", "アプリケーション" + _id + "が既に起動しています。このアプリケーションの多重起動は許可されていません。" );
        }
        return _cnt;
    }
}

const Notification = new function() {
    this.push = function( _title, _content, _app ) {
        $( "#last-notification-title" ).text( _title );
        $( "#last-notification-content" ).text( _content );
        $( "#last-notification-app" ).text( _app );
        $( "#last-notification" ).show( "drop", {direction: "right"}, 300 );
        $( "#notifications" ).append( "<div class='notis'><span><span class='fas fa-comment-alt'></span>" + _title + "</span>" + _content + "</div>" );
    }
}

var process = {};
var processID = 0, currentDesktop = 1;
var currentCTX = "";
var prevWindowIndex;
var S;