((_pid, _app) => {
    _app.event('load', () => {
        let _list = _app.qs('.screenTimeList')[0];
        _list.innerHTML = '';
        let _sorted = Object.entries(KWS.screenTime).sort(([a1,a2],[b1,b2]) => b2-a2);
        let _rank = 1;
        for(let i of _sorted){
            let _min = Math.floor(i[1]/60000);
            let _sec = Math.floor(i[1]/1000%60);
            let _insert = `<kit-box><code class='m-r'>${_rank}</code><strong class='kit-left p-0'>${i[0]}</strong>${_min}分 ${_sec}秒</kit-box>`;
            _list.insertAdjacentHTML('beforeend', _insert);
            _rank ++;
        }
    });
    _app.event('load');
})(pid, app);
