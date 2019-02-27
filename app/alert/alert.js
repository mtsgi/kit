app_alert(pid);

function app_alert(_pid) {
    S.dom(_pid).css("min-width", "400px").css("text-align", "center");
    if( System.args[pid] ){
        $("#winc" + _pid + " .alert-title").text(System.args[pid][0]);
        $("#winc" + _pid + " .alert-content").html(System.args[pid][1]);
        if( System.args[pid][2] ){
            $("#wt" + _pid).html("<img src='./app/alert/icon.png'>"+System.args[pid][2]);
        }
        else{
            $("#wt" + _pid).html("<img src='./app/alert/icon.png'>"+System.args[pid][0]);
        }
    }
    $("#winc" + _pid + " .kit-button").on("click", function(){
        close(_pid);
    });
}