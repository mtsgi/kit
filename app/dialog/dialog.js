((_pid, _app) => {
    _app.event('ok', () => {
        System.args[_pid].func();
        _app.close();
    });
})(pid, app);
