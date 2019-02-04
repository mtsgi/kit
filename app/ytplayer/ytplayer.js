app_ytplayer(pid);

function app_ytplayer(_pid) {
    $("#w" + _pid).resizable({
        alsoResize: ".ytplayer-area",
        minWidth: "200"
    });

    $("#winc" + _pid).delegate(".ytplayer-play", "click", function () {
        $("#winc" + _pid + " .ytplayer-area").attr("src", "https://www.youtube.com/embed/"+ $("#winc" + _pid + " #ytplayer-src").val() +"?&showinfo=0&iv_load_policy=3&fs=0&modestbranding=1");
    }).delegate(".ytplayer-nico", "click", function () {
        $("#winc" + _pid + " .ytplayer-area").attr("src", "https://embed.nicovideo.jp/watch/"+ $("#winc" + _pid + " #ytplayer-src").val() +"?&showinfo=0&iv_load_policy=3&fs=0&modestbranding=1");
    });
}