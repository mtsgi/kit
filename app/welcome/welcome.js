app_welcome(pid);

function app_welcome(_pid) {
    $("#winc" + _pid).css("width", "300px");
    $("#winc" + _pid).delegate(".welcome-detail", "click", function () {
        $("#winc" + _pid).resizable({
            minWidth: "200"
        }).load("./app/welcome/detail.html");
    });
    $("#winc" + _pid).delegate(".welcome-back", "click", function () {
        $("#winc" + _pid).resizable({
            minWidth: "200"
        }).load("./app/welcome/default.html");
    });
    $("#winc" + _pid).delegate(".welcome-close", "click", function () {
        console.log(_pid);
        S.close(_pid);
    });

    $("#winc" + _pid).delegate(".welcome-document", "click", function () {
        launch("document");
    }).delegate(".welcome-help", "click", function () {
        launch("help");
    });
}