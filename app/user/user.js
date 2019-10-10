((_pid, _app) => {
    _app.dom("#user-icon").css("background", localStorage.getItem("kit-user-color"));
    _app.event("lock", ()=>{
        System.lock();
    });
    S.dom(_pid, "#user-settings").on("click", ()=>{
        launch("settings", { "view": "user" });
    });
})(pid, app);
