((_pid, _app) => {
    _app.data('pid', pid);
    _app.event('load', () => {
        // Initialize
        _app.data({
            launchpath: null,
            defobj: {},
            data: {},
            args: {},
            isopen: true
        });

        let p = _app.data('pid');
        let lp = System.launchpath[p];
        if (lp) {
            _app.data({
                launchpath: lp,
                defobj: System.appCache[lp],
                support: System.appCache[lp]['support'],
                data: App.data(p),
                args: System.args[p]
            });
        }
    });
    _app.event('set', () => {
        App.data(_app.data('pid'), _app.data('key'), _app.data('value'));
        System.alert('値をセット', `プロセス${_app.data('pid')}に "${_app.data('key')}" : "${_app.data('value')}" をセットしました。`);
    });
})(pid, app);
