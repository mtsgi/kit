( (_pid) => {
    let iobj = new Object();
    S.dom( _pid, "#install-define-decide").on("click", ()=>{
        let define_path = $("#install-define-path").val();
        if( define_path.length == 0 ){
            S.alert("インストーラー", "define.jsonのパスを入力してください。");
            return;
        }

        $.getJSON( define_path + "define.json" , function( data ){
            iobj.define = define_path + "define.json";
            iobj.id = data.id;

            S.dom( _pid, "#install-appid" ).val( data.id );
            S.dom( _pid, "#install-name" ).val( data.name );
            S.dom( _pid, "#install-icon" ).val( define_path + data.icon );

            $("#install-prot1").hide();
            $("#install-prot2").show();
        }).fail( function() {
            S.alert("読み込みに失敗", "define.jsonが存在しないか、アクセスできません。");
        } );;
    });

    S.dom( _pid, "#install-start" ).on("click", ()=>{
        iobj.name = S.dom( _pid, "#install-name" ).val();
        iobj.icon = S.dom( _pid, "#install-icon" ).val();

        console.log(iobj);

        System.installed.push(iobj);
        S.dom( _pid, "#install-done-name" ).text( iobj.name );

        $("#install-prot2").hide();
        $("#install-prot3").show();

        System.initLauncher();
    });

    S.dom( _pid, "#install-close" ).on("click", ()=>{
        System.close(_pid);
    })

} )(pid);