app_grapes(pid);

function app_grapes(_pid) {
    $("#winc"+_pid+" .grapes-area").attr("id", "grapes-area-"+_pid).resizable({
        minWidth: "200"
    });
    $("head link:last").append('<link href="./app/grapes/grapes.min.css" rel="stylesheet">');
    $.getScript("./app/grapes/grapes.min.js", function () {
        var editor = grapesjs.init({
            container: "#grapes-area-"+_pid,
            width: "700px",
            height: "500px",
            components: '<h3>テキストを入力</h3>',
        });

    });
}