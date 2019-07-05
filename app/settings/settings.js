app_settings( pid );

function app_settings( _pid ) {

    if( System.args[_pid] && System.args[_pid].view ) {
        App.load( _pid, String( System.args[_pid].view ) + ".html" );
    }

    $( "#winc" + _pid ).resizable( {
        disabled: "true"
    } );

    var wallpapers = ["Bg_2001.dds.png", "Bg_2004.dds.png", "Bg_2008.dds.png", "Bg_2013.dds.png", "Bg_2010.dds.png", "Bg_2012.dds.png"];

    $( "#winc" + _pid ).css( "width", "540px" );

    $( "#winc" + _pid )

        .delegate( ".settings-username-set", "click", function() {
            localStorage.setItem( "kit-username", $( '#settings-username' ).val() );
            System.username = $( '#settings-username' ).val();
            App.load( _pid, "user.html" );
            $( "#kit-header-username" ).text( localStorage.getItem( "kit-username" ) );
        } )
        .delegate( ".settings-user-password-set", "click", function() {
            localStorage.setItem( "kit-password", $( '#settings-user-password' ).val() );
            App.load( _pid, "user.html" );
        } )
        .delegate( ".settings-user-color-set", "click", function() {
            localStorage.setItem( "kit-user-color", $( '#settings-user-color' ).val() );
            App.load( _pid, "user.html" );
        } )
        .delegate( ".settings-startup-set", "click", function() {
            localStorage.setItem( "kit-startup", S.dom( _pid, "#settings-startup" ).val() );
        } )
        //壁紙
        .delegate( ".settings-wallpaper-set", "click", function() {
            System.changeWallpaper( "url(" + String( $( '#settings-wallpaper-path' ).val() ) + ")" );
        } )
        .delegate( ".settings-background-set", "click", function() {
            System.changeWallpaper( $( '#settings-background' ).val() );
        } )
        //テーマ
        //高度な設定
        .delegate( ".settings-envar-set", "click", function() {
            localStorage.setItem( $( "#winc" + _pid + " #settings-envar-key" ).val(), $( "#winc" + _pid + " #settings-envar-val" ).val() );
            App.load( _pid, "advanced.html" );
        } )
        .delegate( ".settings-envar-remove", "click", function() {
            if( $( "#winc" + _pid + " #settings-envar-rem" ).val() == "kit-password" ) {
                System.alert( "設定エラー", "この環境変数は削除できません。" );
                return false;
            }
            localStorage.removeItem( $( "#winc" + _pid + " #settings-envar-rem" ).val() );
            App.load( _pid, "advanced.html" );
        } );
}