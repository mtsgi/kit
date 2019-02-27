app_settings(pid);

function app_settings(_pid) {

    if( System.args[_pid] && System.args[_pid].view ){
        $("#winc" + _pid).load("./app/settings/"+ String(System.args[_pid].view) +".html");
    }

    $("#winc" + _pid).resizable({
        disabled: "true"
    });

    var wallpapers = ["Bg_2001.dds.png", "Bg_2004.dds.png", "Bg_2008.dds.png", "Bg_2013.dds.png", "Bg_2010.dds.png", "Bg_2012.dds.png"];

    $("#winc" + _pid).css("width", "540px");

    //kitについて
    $("#winc" + _pid).delegate(".settings-about", "click", function () {
        $("#winc" + _pid).load("./app/settings/about.html");
    })
    //ユーザー設定
    .delegate(".settings-user", "click", function () {
        $("#winc" + _pid).load("./app/settings/user.html");
        //$(".textbox").attr("autocomplete", "off");
    })
    .delegate(".settings-username-set", "click", function () {
        localStorage.setItem("kit-username", $('#settings-username').val());
        System.username = $('#settings-username').val();
        $("#winc" + _pid).load("./app/settings/user.html");
        $("#kit-header-username").text( localStorage.getItem("kit-username") );
    })
    .delegate(".settings-user-password-set", "click", function () {
        localStorage.setItem("kit-password", $('#settings-user-password').val());
        $("#winc" + _pid).load("./app/settings/user.html");
    })
    .delegate(".settings-user-color-set", "click", function () {
        localStorage.setItem("kit-user-color", $('#settings-user-color').val());
        $("#winc" + _pid).load("./app/settings/user.html");
    })
    //システム設定
    .delegate(".settings-system", "click", function () {
        $("#winc" + _pid).load("./app/settings/system.html");
        //$(".textbox").attr("autocomplete", "off");
    })
    .delegate(".settings-startup-set", "click", function () {
        localStorage.setItem( "kit-startup", S.dom( _pid, "#settings-startup").val() );
    })
    //壁紙
    .delegate(".settings-wallpaper", "click", function () {
        $("#winc" + _pid).load("./app/settings/wallpaper.html");
    })
    .delegate(".settings-wallpaper-set", "click", function () {
        System.changeWallpaper("url("+String($('#settings-wallpaper-path').val())+")");
    })
    .delegate(".settings-background-set", "click", function () {
        System.changeWallpaper($('#settings-background').val());
    })
    //テーマ
    .delegate(".settings-theme", "click", function () {
        $("#winc" + _pid).load("./app/settings/theme.html");
    })
    //高度な設定
    .delegate(".settings-advanced", "click", function () {
        $("#winc" + _pid).load("./app/settings/advanced.html");
    })
    .delegate(".settings-default", "click", function () {
        $("#winc" + _pid).load("./app/settings/default.html");
    })
    .delegate(".settings-envar-set", "click", function () {
        localStorage.setItem( $("#winc"+_pid+" #settings-envar-key").val(), $("#winc"+_pid+" #settings-envar-val").val() );
        $("#winc" + _pid).load("./app/settings/advanced.html");
    })
    .delegate(".settings-envar-remove", "click", function () {
        if( $("#winc"+_pid+" #settings-envar-rem").val() == "kit-password" ){
            System.alert("設定エラー", "この環境変数は削除できません。");
            return false;
        }
        localStorage.removeItem( $("#winc"+_pid+" #settings-envar-rem").val() );
        $("#winc" + _pid).load("./app/settings/advanced.html");
    });
}