app_alert(pid);

function app_alert(_pid) {
    $("#winc" + _pid).css("width", "400px").css("text-align", "center");
    if( System.args[pid] ){
        $("#winc" + _pid + " .alert-title").text(System.args[pid][0]);
        $("#winc" + _pid + " .alert-content").html(System.args[pid][1]);
        $("#wt" + _pid).html("<img src='./app/alert/icon.png'>"+System.args[pid][0]);
    }
    $("#winc" + _pid + " .kit-button").on("click", function(){
        close(_pid);
    });
}