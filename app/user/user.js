((_pid) => {
    S.dom(_pid, "#user-name").text(System.username);
    S.dom(_pid, "#user-icon").css( "background", localStorage.getItem( "kit-user-color" ) );
    S.dom(_pid, "#user-lock").on("click", System.lock);
    S.dom(_pid, "#user-settings").on("click", ()=>{
        launch("settings", { "view": "user" });
    });
})(pid);