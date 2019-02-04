app_document(pid);

function app_document(_pid) {

    $("#w" + _pid).resizable({
        alsoResize: ".document-content",
        minWidth: "200"
    });
}