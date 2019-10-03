( (_pid, _app) => {
    let iobj = new Object();
    _app.data("appname", "");

    _app.event("define-decide", () => {
        let define_path = _app.data("path");
        if( !define_path || define_path.length == 0 ){
            S.alert("インストーラー", "define.jsonのパスを入力してください。");
            return;
        }

        $.getJSON( define_path + "define.json" , function( data ){
            iobj.path = define_path;
            iobj.id = data.id;

            _app.dom( "#install-appid" ).val( data.id );
            _app.dom( "#install-name" ).val( data.name );
            _app.dom( "#install-icon" ).val( define_path + data.icon );

            _app.dom( "#install-prot1").hide();
            _app.dom( "#install-prot2").show();
        }).fail( function() {
            S.alert("読み込みに失敗", "define.jsonが存在しないか、アクセスできません。");
        } );
    });

    _app.event("start", () => {
        iobj.name = S.dom( _pid, "#install-name" ).val();
        iobj.icon = S.dom( _pid, "#install-icon" ).val();

        System.installed.push(iobj);
        localStorage.setItem("kit-installed", JSON.stringify(System.installed));

        _app.data("appname", iobj.name);
        _app.dom( "#install-prot2").hide();
        _app.dom( "#install-prot3").show();

        $.getJSON("config/apps.json", System.initLauncher);
    });
} )(pid, app);