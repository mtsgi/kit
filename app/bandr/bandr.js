((_pid, _app) => {
    _app.event('b', () => {
        let _export = encodeURI(JSON.stringify(localStorage));
        let _blob = new Blob([_export], { type: "text/plain" });
        const a = document.createElement('a');
        a.download = new Date().toISOString() + '.kitbackup';
        a.href = URL.createObjectURL(_blob);
        document.getElementById('bandr-download').href = URL.createObjectURL(_blob);
        a.click();
        a.parentNode.removeChild(a);
    });

    _app.event('r', (e) => {
        const result = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(result);
        reader.addEventListener('load', ()=>{
            System.dialog("復元の確認", "本当に現在のプロファイルを破棄して復元を実行しますか？", () => {
                System.dialog("復元を実行しますか？", _app.dom('#bandr-file').val() + "から現在のプロファイルが上書きされます(異なるプロファイルを復元しようとしている場合は必ず現在のプロファイルのバックアップファイルを保存してから復元を行ってください)。", () => {
                    try {
                        let _obj = JSON.parse( decodeURI( reader.result ) );
                        let _list = new Array();
                        for( let i in _obj ){
                            if( i.indexOf("kit-") == 0 ){
                                Notification.push("debug", i, "system");
                                localStorage[i] = _obj[i];
                                _list.push(i);
                            }
                        }
                        _app.load('r3.html');
                        System.alert( "復元の完了", "次の項目をkitシステムのプロファイルとして読み込みました:<hr>" + _list + "<hr>次の情報をシステムのプロファイルに再現しました:<hr>" + reader.result );
                    } catch (error) {
                        System.alert( "復元のエラー", `次のエラーにより、復元は完了しませんでした(以前のプロファイルが維持されています)。kitのバックアップファイル以外を選択している可能性があります。<blockquote>${error}</blockquote>` );
                        return false;
                    }
                });
            });
        });
    });

    _app.event('reboot', ()=> System.reboot());
})(pid, app);
