((_pid) => {
    S.dom(_pid).css("min-width", "400px").css("text-align", "center");
    if( System.args[pid] ){
        S.dom(_pid, ".alert-title").text(System.args[pid][0]);
        S.dom(_pid, ".alert-content").html(System.args[pid][1]);
        if( System.args[pid][2] ){
            App.changeWindowTitle( _pid, System.args[pid][2] );
        }
        else{
            App.changeWindowTitle( _pid, System.args[pid][0] );
        }
    }
})(pid);