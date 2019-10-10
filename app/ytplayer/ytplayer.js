((_pid, _app) => {
    $("#w" + _pid).resizable({
        alsoResize: ".ytplayer-area",
        minWidth: "200"
    });

    _app.dom().delegate(".ytplayer-play", "click", () => {
        _app.dom(".ytplayer-area").attr("src", "https://www.youtube.com/embed/"+ _app.dom("#ytplayer-src").val() +"?&showinfo=0&iv_load_policy=3&fs=0&modestbranding=1");
    }).delegate(".ytplayer-nico", "click", () => {
        _app.dom(".ytplayer-area").attr("src", "https://embed.nicovideo.jp/watch/"+ _app.dom("#ytplayer-src").val() +"?&showinfo=0&iv_load_policy=3&fs=0&modestbranding=1");
    });
})(pid, app);
