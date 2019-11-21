((_pid, _app) => {
    App.d[_pid] = {
        "username": System.username,
        "usercolor": localStorage.getItem("kit-user-color")
    }

    if( _app.args && _app.args.view ) {
        App.load( _pid, String( System.args[_pid].view ) + ".html" );
    }

    _app.event("update", ()=>{
        $.getJSON("https://api.github.com/repos/mtsgi/kit/tags", (data) => {
            let result = "";
            for( let i in data ){
                result += "<strong>v" + data[i].name;
                if( i == 0 ) result += "(最新)";
                result += `</strong><div class='little'>${data[i].commit.sha}</div>`;
            }
            System.alert(`お使いのkitは${System.version}です`,result);
        });
    } );

    _app.event("username_set", () => {
        _app.data( "username", _app.dom('#settings-username').val() );
        localStorage.setItem( "kit-username", _app.data().username );
        System.username = _app.data().username;
        _app.load('user.html');
        $( "#kit-header-username" ).text( localStorage.getItem( "kit-username" ) );
    });
    _app.event('usercolor_set', () => {
        _app.data( 'usercolor', _app.dom('#settings-user-color').val() )
        localStorage.setItem( "kit-user-color", _app.data().usercolor );
        _app.load('user.html');
    });
    _app.event('userpassword_set', () => {
        localStorage.setItem( "kit-password", _app.dom('#settings-user-password').val() );
        _app.load('user.html');
    });
    _app.event('startup_set', () => {
        localStorage.setItem( "kit-startup", _app.dom('#settings-startup').val() );
    });
    _app.event('wallpaper_set', () => {
        System.changeWallpaper( "url(" + _app.dom('#settings-wallpaper-path').val() + ")" );
    });
    _app.event('background_set', () => {
        System.changeWallpaper( _app.dom('#settings-background').val() );
    });

    _app.dom()
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
})(pid, app);
