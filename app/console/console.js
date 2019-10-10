( ( _pid, _app ) => {
    let prevCommand = "";
    let cmdHistory = [""];
    let cmdFocus = 0;

    _app.dom('.console-exec').on( "click", function() {
        let log = _app.dom(".simple-box").html();
        let exec = _app.dom(".textbox").val();
        if( exec ) {
            prevCommand = exec;
            cmdFocus = cmdHistory.length;
            cmdHistory.shift( exec );
            Notification.push( "debug", cmdHistory )
            _app.dom('.simple-box').html( exec + "<br><span class='fa fa-arrow-left'></span>" );
            try {
                _app.dom('.simple-box').append( "<pre>" + JSON.stringify( eval( exec ), null, 4 ) + "</pre><div class='console-log'>" + log + "</div>" );
            } catch( error ) {
                _app.dom('.simple-box').append( error + "<div class='console-log'>" + log + "</div>" );
            }
        }
        _app.dom('.textbox').val('');
    } );

    _app.dom('.textbox').keypress( function( e ) {
        if( e.which == 13 ) _app.dom(".console-exec").click();
    } );

    _app.dom('.textbox').on( 'keydown', function( e ) {
        if( e.which == 38 ) {
            if( cmdHistory[cmdFocus - 1] != undefined ) cmdFocus--;
            _app.dom(" .textbox").val( cmdHistory[cmdFocus] );
        }
        else if( e.which == 40 ) {
            if( cmdHistory[cmdFocus + 1] != undefined ) cmdFocus++;
            _app.dom(".textbox").val( cmdHistory[cmdFocus] );
        }
    } );
} )( pid, app );
