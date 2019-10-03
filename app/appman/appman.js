( ( _pid, _app ) => {
    S.avoidMultiple( pid, true );
    $.getJSON( "config/apps.json", function( data ) {
        $( "#appman-list1" ).html( "" );
        for( i in data ) {
            _app.dom( "#appman-list1" ).append( `<a class='appman-app'><img src='${data[i].icon}'><br>${data[i].name}<span>${i}</span></a>` );
        }
    } );
    for( i of System.installed ) {
        _app.dom( "#appman-list2" ).append( `<a class='appman-app'><img src='${i.icon}'><br>${i.name}<span>${i.id}</span></a>` );
    }
} )( pid, app );
