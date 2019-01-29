app_sample(pid);

function app_sample(_pid){
    $("#winc" + _pid + " #sample-hello").click( function(){
        System.alert("sample","Hello, world!")
    });
} 