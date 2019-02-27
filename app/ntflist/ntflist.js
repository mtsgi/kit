S.avoidMultiple(pid, true);

((_pid) => {
    for( i in Notification.list ){
        S.dom(_pid, ".ntflist-list")
        .append("<div class='ntflist-items'><span class='ntflist-a'>" + i + "</span><span class='ntflist-b'>" + Notification.list[i].title + "</span><span class='ntflist-c'>" + Notification.list[i].content + "</span><span class='ntflist-d'>" + Notification.list[i].app + "</span>");
    }
})(pid)