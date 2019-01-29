app_document(pid);

function app_document(_pid) {

    $("#w" + _pid).resizable({
        alsoResize: ".kit-scroll",
        minWidth: "200"
    });
}