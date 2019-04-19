app_imgdl(pid);

function app_imgdl(_pid){
    S.dom(_pid, ".kit-hyperlink").on("click", ()=>{
        S.alert("Image Loaderのヘルプ", "画像のパス(ローカル／クロスオリジン制約のかからない場所)を入力すると、Fivrでkitの仮想ファイルシステム上に画像を保存します。")
    })
    S.dom(_pid, "#imgdl-load").on("click", ()=>{
        S.dom(_pid, "#imgdl-image").show().attr("src", S.dom(_pid, "#imgdl-path").val())
        S.obj2img( S.dom(_pid, "#imgdl-image") , true );
        setTimeout(() => { S.dom(_pid, "#imgdl-image").hide() }, 200);
    })
}