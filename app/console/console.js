app_console(pid);

function app_console(_pid) {
    let prevCommand = "";

    $("#w" + _pid).resizable({
        alsoResize: "#w" + _pid + " .console-wrapper",
        minWidth: "200"
    });

    $("#winc"+_pid+" .console-exec").click(function(){
        var log = $("#winc"+_pid+" .simple-box").html();
        var exec = $("#winc"+_pid+" .textbox").val();
        prevCommand = exec;
        var _return = JSON.stringify( eval(exec) );
        if( _return ){
            $("#winc"+_pid+" .simple-box").html(exec+"<br><span class='fa fa-arrow-left'></span>");
            $("#winc"+_pid+" .simple-box").append( _return+"<br><div class='console-log'>"+log+"</div>");
        }
        $("#winc"+_pid+" .textbox").val("");
    });

    $("#winc"+_pid+" .textbox").keypress(function(e){
        if(e.which == 13){
            $("#winc"+_pid+" .console-exec").click();
        }
      });

      $(document).on("keydown", "#winc"+_pid+" .textbox", function(e){
        if(e.which == 38){
            $("#winc"+_pid+" .textbox").val(prevCommand);
        }
        else if(e.which == 40){
            $("#winc"+_pid+" .textbox").val("");
        }
      });
}