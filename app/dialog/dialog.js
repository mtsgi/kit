app_dialog(pid);

function app_dialog(_pid) {
    S.dom(_pid).css("min-width", "400px").css("text-align", "center");
    if( System.args[pid] ){
        $("#winc" + _pid + " .dialog-title").text(System.args[_pid].title);
        $("#winc" + _pid + " .dialog-content").html(System.args[_pid].content);
    }
    $("#winc" + _pid + " .dialog-cancel").on("click", function(){
        close(_pid);
    });
    $("#winc" + _pid + " .dialog-ok").on("click", function(){
        System.args[_pid].func();
    });
}