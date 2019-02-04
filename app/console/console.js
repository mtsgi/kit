app_console(pid);
var prevCommand;

function app_console(_pid) {
    $("#w" + _pid).resizable({
        alsoResize: "#w" + _pid + " .simple-box",
        minWidth: "200"
    });

    $("#winc"+_pid+" .console-exec").click(function(){
        var log = $("#winc"+_pid+" .simple-box").html();
        var exec = $("#winc"+_pid+" .textbox").val();
        prevCommand = exec;
        $("#winc"+_pid+" .simple-box").html(exec+"<br><span class='fa fa-arrow-left'></span>");
        $("#winc"+_pid+" .simple-box").append( JSON.stringify( eval(exec) )+"<br><div class='console-log'>"+log+"</div>");
        $("#winc"+_pid+" .textbox").val("");
    });
    $("#winc"+_pid+" .textbox").keypress(function(e){
        if(e.which == 13){
            $("#winc"+_pid+" .console-exec").click();
        }
        else if(e.which == 38){
            $("#winc"+_pid+" .textbox").val(prevCommand);
        }
      });
}