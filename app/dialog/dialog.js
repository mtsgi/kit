((_pid) => {
    App.event( _pid, "ok", ()=>{
        System.args[_pid].func();
        System.close(_pid);
    } );
})(pid);
