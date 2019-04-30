app_console(pid);

function app_console(_pid) {
    "use strict";

    let prevCommand = "";
    let cmdHistory = [""];
    let cmdFocus = 0;

    $("#winc"+_pid+" .console-exec").on("click", function(){
        let log = $("#winc"+_pid+" .simple-box").html();
        let exec = $("#winc"+_pid+" .textbox").val();
        if( exec ){
            prevCommand = exec;
            cmdFocus = cmdHistory.length;
            cmdHistory.shift(exec);
            Notification.push("debug", cmdHistory)
            $("#winc"+_pid+" .simple-box").html(exec+"<br><span class='fa fa-arrow-left'></span>");
            try {
                $("#winc"+_pid+" .simple-box").append( "<pre>" + JSON.stringify( eval(exec), null, 4 )+"</pre><div class='console-log'>"+log+"</div>");
            } catch (error) {
                console.log(error);
                $("#winc"+_pid+" .simple-box").append( error +"<br><div class='console-log'>"+log+"</div>");
            }
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
            if( cmdHistory[cmdFocus-1] != undefined ) cmdFocus--;
            $("#winc"+_pid+" .textbox").val(cmdHistory[cmdFocus]);
        }
        else if(e.which == 40){
            if( cmdHistory[cmdFocus+1] != undefined ) cmdFocus++;
            $("#winc"+_pid+" .textbox").val(cmdHistory[cmdFocus]);
        }
      });
}