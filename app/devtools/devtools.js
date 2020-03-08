((_pid, _app) => {
    _app.data('pid', pid);
    _app.event('load', () => {
        // Initialize
        _app.data('launchpath', null);
        _app.data('defobj', {});
        _app.data('data', {});
        _app.data('args', {});

        _app.data('isopen', true);
        let p = _app.data('pid');
        let lp = System.launchpath[p];
        if(lp) {
            _app.data('launchpath', lp);
            _app.data('defobj', System.appCache[lp]);
            _app.data('support', System.appCache[lp]['support']);
            _app.data('data', App.data(p));
            _app.data('args', System.args[p]);
        }
    });
    _app.event('set', () => {
        App.data(_app.data('pid'), _app.data('key'), _app.data('value'));
        System.alert('値をセット', `プロセス${_app.data('pid')}に "${_app.data('key')}" : "${_app.data('value')}" をセットしました。`);
    });
})(pid, app);
