((_pid) => {
    App.event(_pid, "b", ()=>{
        let _export = encodeURI(JSON.stringify(localStorage));
        let _blob = new Blob([_export], { type: "application/json" });
        const a = document.createElement('a');
        a.download = new Date().toISOString() + '.json';
        a.href = URL.createObjectURL(_blob);
        a.click();
        a.parentNode.removeChild(a);
    });
    App.event(_pid, "r", ()=>{
        //System.dialog("復元の確認", "本当に現在のプロファイルを破棄して復元を実行しますか？", ()=>{
        //    Notification.push( S.dom(_pid, "#bandr-file").val() );
        //});
    });
})(pid);