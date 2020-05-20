((_pid, _app) => {
    _app.data('swinfo', (() => {
        try {
            if (sw) return `${sw.scope}で有効`;
            else return '無効';
        } catch (error) {
            return 'モバイルではありません';
        }
    })());

    _app.event({
        mobile() {
            location.href = 'mobile.html'
        },
        desktop() {
            location.href = 'index.html'
        }
    });
})(pid, app);
