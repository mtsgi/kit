((_pid) => {
    for( let i in process ) {
        S.dom( _pid, "#pmgr-tb" ).append( "<tr><td onclick='appInfo(\""+process[i].id+"\")'><img src='./app/" + process[i].id + "/" + System.appCache[process[i].id].icon +"'>" + System.appCache[process[i].id].name + "</td><td>" + i + "</td><td>" + process[i].time + "</td><td><a class='kit-hyperlink pmgr-close' data-pmgr-close='"+i+"'>終了</a></td></tr>" );
    }
    System.resizable(_pid, "#pmgr-box");
    setInterval( () => {
        S.dom( _pid, "#pmgr-tb" ).text("");
        for( let i in process ) {
            S.dom( _pid, "#pmgr-tb" ).append( "<tr><td onclick='appInfo(\""+process[i].id+"\")'><img src='./app/" + process[i].id + "/" + System.appCache[process[i].id].icon +"'>" + System.appCache[process[i].id].name + "</td><td>" + i + "</td><td>" + process[i].time + "</td><td onclick='System.close(\""+i+"\")'><a class='kit-hyperlink'>終了</a></td></tr>" );
        }
    }, 1000 );
    $(".pmgr-close").on("click", ()=>{
        S.close( $(this).attr("data-pmgr-close") );
    });
})(pid);