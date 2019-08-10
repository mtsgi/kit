((_pid) => {
    App.changeWindowTitle( _pid, System.args[pid][2] || System.args[pid][0] );
})(pid);