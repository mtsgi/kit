app_fivr( pid );

KWS.context.fivr = {
    "name": "ファイルについて",
    "open": {
        "label": "Fivrで開く",
        "icon" : "fa-external-link-square-alt",
        "function" : function(){
            S.open( S.selectedElement.attr("data-fivr") );
        }
    },
    "delete": {
        "label": "ゴミ箱へ移動",
        "icon" : "fa-trash-alt",
        "function" : function(){
            System.recycle[S.selectedElement.attr("data-fivr")] = System.userarea[S.selectedElement.attr("data-fivr")];
            delete System.userarea[S.selectedElement.attr("data-fivr")];
            localStorage["kit-userarea"] = JSON.stringify(System.userarea);
            localStorage["kit-recycle"] = JSON.stringify(System.userarea);
            S.alert("ファイルの削除", "ファイルをゴミ箱に移動しました:" +  S.selectedElement.attr("data-fivr") );
            fivr_load();
        }
    }
}

function app_fivr(_pid){
    //openの時
    if( S.args[_pid] && S.args[_pid].open ){
        $("#winc" + _pid).load("./app/fivr/open.html");
        setTimeout(() => {
            App.changeWindowTitle( _pid, S.args[_pid].open );
            if( S.userarea[S.args[_pid].open].type == "image" ){
                S.dom( _pid, "#fivr-open" ).html( "<img src='" + S.userarea[S.args[_pid].open].data + "'>" );
            }
            else if( S.userarea[S.args[_pid].open].type == "text" ){
                S.dom( _pid, "#fivr-open" ).html( "<div class='fivr-text' data-simplebar>" + String(S.userarea[S.args[_pid].open].data) + "</div>" );
            }
            else if( S.userarea[S.args[_pid].open].type == "element" ){
                S.dom( _pid, "#fivr-open" ).html( S.userarea[S.args[_pid].open].data );
            }
            else{
                S.dom( _pid, "#fivr-open" ).html( JSON.stringify(S.userarea[S.args[_pid].open].data) );
            }
        }, 20);
    }
    //saveの時
    if( S.args[_pid] && S.args[_pid].save ){
        $("#winc" + _pid).load("./app/fivr/save.html");
        setTimeout(() => {
            //ファイル一覧を取得
            fivr_load();
            //Preview by file-type
            if( S.args[_pid].type == "image" ){
                S.dom( _pid, "#fivr-preview" ).html( "<img src='" + S.args[_pid].save + "' alt='preview'>" );
            }
            else{
                S.dom( _pid, "#fivr-preview" ).html( S.args[_pid].save );
            }
            S.dom( _pid, "#fivr-filetype" ).text( "タイプ:" + S.args[_pid].type +" /形式:"+typeof S.args[_pid].save );
            new SimpleBar( S.dom( _pid, "#fivr-preview" )[0] );
            S.dom( _pid, "#fivr-filename" ).val("");

            $("#fivr-preview").resizable({
                ghost: true
            });
            //Saving
            S.dom( _pid, "#fivr-save-button" ).on("click", function(){
                if( S.dom( _pid, "#fivr-filename" ).val().length == 0 ){
                    S.alert( "ファイルの保存" , "ファイル名を入力してください。");
                    return false;
                }
                else if( S.userarea[S.dom( _pid, "#fivr-filename" ).val()] ){
                    S.alert( "ファイルの保存" , "そのファイル名はすでに存在しています。");
                    return false;
                }
                System.userarea[S.dom( _pid, "#fivr-filename" ).val()] = {
                    "type": S.args[_pid].type,
                    "data": S.args[_pid].save
                }
                localStorage["kit-userarea"] = JSON.stringify(System.userarea);
                S.alert( "ファイルの保存" , "ユーザー領域にファイル「"+S.dom( _pid, "#fivr-filename" ).val()+"」を保存しました。");
                S.close( _pid );
            });
        }, 100);
        return false;
    }
    let path = "root";
    if( S.args[_pid] && S.args[_pid].path ){
        path = S.args[_pid].path;
    }
    S.dom( _pid, "#fivr-path" ).val( path );
    fivr_load();

    //再読込
    S.dom( _pid, "#fivr-load" ).on("click", function(){
        fivr_load();
    });

    function fivr_load(){
        S.dom( _pid, "#fivr-files").html("");
        let cnt = 0;
        for( i in S.userarea ){
            S.dom( _pid, "#fivr-files").append("<div class='fivr-file' data-fivr='"+i+"' kit-context='fivr'><span class='fa fa-file'></span> " + i + "<span class='fivr-file-type'>" + S.userarea[i].type + "</span></div>");
            cnt ++;
        }
        if( cnt == 0 ) S.dom( _pid, "#fivr-files").append("<div>表示するファイルがありません。<br>ファイルや要素を保存するとここに表示されます。</div>");
        //open
        S.dom( _pid, ".fivr-file" ).on("click", function(){
            S.open( $(this).attr("data-fivr") );
        });
    }
}