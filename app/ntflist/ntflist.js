((_pid, _app) => {
    S.avoidMultiple(_pid, false);
    for( i in Notification.list ){
        _app.dom(".ntflist-list")
        .append("<div class='kit-pane hover'><span class='ntflist-a'>" + i + "</span><span class='ntflist-b'>" + Notification.list[i].title + "</span><span class='ntflist-c'>" + Notification.list[i].content + "</span><span class='kit-sub'>" + Notification.list[i].app + "</span><br><span class='kit-sub'>" + Notification.list[i].time + "</span>");
    }
})(pid, app);
