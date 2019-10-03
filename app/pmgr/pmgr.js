((_pid, _app) => {
    for( let i in process ) {
        _app.dom("#pmgr-tb").append( "<tr><td onclick='System.appInfo(\""+i.id+"\")'><img src='./app/" + process[i].id + "/" + System.appCache[process[i].id].icon +"'>" + process[i].title + "</td><td>" + i + "</td><td>" + process[i].time + "</td><td><a class='kit-hyperlink pmgr-close' data-pmgr-close='"+i+"'>終了</a></td></tr>" );
    }
    setInterval( () => {
        _app.dom("#pmgr-tb").text("");
        for( let i in process ) {
            S.dom( _pid, "#pmgr-tb" ).append( "<tr><td onclick='System.appInfo(\""+i+"\")'><img src='./app/" + process[i].id + "/" + System.appCache[process[i].id].icon +"'>" + process[i].title + "</td><td>" + i + "</td><td>" + process[i].time + "</td><td onclick='System.close(\""+i+"\")'><a class='kit-hyperlink'>終了</a></td></tr>" );
        }
    }, 1000 );
    _app.dom(".pmgr-close").on("click", () => {
        S.close( $(this).attr("data-pmgr-close") );
    });
})(pid, app);
