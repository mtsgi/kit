app_browser(pid);

function app_browser(_pid){
    $("#w" + _pid).resizable({
        alsoResize: ".resize-also",
        minWidth: "200"
    });
}