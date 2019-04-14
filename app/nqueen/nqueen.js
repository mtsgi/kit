app_nqueen( pid );

function app_nqueen( _pid ) {
    //1辺の長さ
    var nqueenSize;
    //置いたクイーンの個数
    var nqueenNum = 0;
    S.dom( _pid, "#nqueen-start" ).on( "click", function() {
        //初期化
        nqueenSize = Number($( "#nqueen-size" ).val());
        if( nqueenSize < 0 ) nqueenSize = nqueenSize * -1;
        if( nqueenSize > 500 && !S.debugmode ){
            S.alert("Nクイーン", "数値が大きすぎます。");
            return;
        };
        nqueenNum = 0;
        $( "#nqueen-num" ).text( nqueenNum );
        $( "#nqueen-table" ).html( "" );
        $( "#nqueen-result" ).hide().text( "" );
        //テーブルを生成
        var nqueenAppend = "";
        for( var i = 1; i < nqueenSize * nqueenSize + 1; i++ ) {
            if( i % nqueenSize == 1 ) nqueenAppend += "<tr>";
            nqueenAppend += "<td id='" + i + "'></td>";
            if( i % nqueenSize == 0 ) nqueenAppend += "</tr>";
        }
        $( "#nqueen-table" ).append( nqueenAppend );
        //ふれると列と行を表示する
        $( ".winc-nqueen td" ).hover( function() {
            var row = Math.floor( Number( this.id - 1 ) / nqueenSize ) + 1;
            var col = Number( this.id ) % nqueenSize;
            if( col == 0 ) col = nqueenSize;
            $( ".nqueen-footer" ).text( row + "行目" + col + "列目" );
        } );
        //マスをクリック
        $( ".winc-nqueen td" ).click( function() {
            let masu = Number( this.id );
            let row = Math.floor( Number( this.id - 1 ) / nqueenSize ) + 1;
            let col = Number( this.id ) % nqueenSize;
            if( col == 0 ) col = nqueenSize;
            //赤いところには置けない
            if( $( this ).hasClass( "red" ) ) {
                S.alert( "Nクイーン", "そこには置けないよ！" );
                return;
            }
            //クイーンの行動範囲を赤く塗る
            let redCount = 0;
            for( i in $( "td" ) ) {
                var k = ( Number( i ) + 1 );
                //同じ行を赤くする
                var k_row = Math.floor( ( k - 1 ) / nqueenSize ) + 1
                if( k_row == row ) {
                    $( "#" + k ).addClass( "red" );
                }
                //同じ列を赤くする
                var k_col = k % nqueenSize
                if( k_col == 0 ) k_col = nqueenSize;
                if( k_col == col ) {
                    $( "#" + k ).addClass( "red" );
                }
                //ななめ
                for( n = 1; n < nqueenSize; n++ ) {
                    if( k_row == row + n && k_col == col + n ) $( "#" + k ).addClass( "red" );
                    else if( k_row == row + n && k_col == col - n ) $( "#" + k ).addClass( "red" );
                    else if( k_row == row - n && k_col == col + n ) $( "#" + k ).addClass( "red" );
                    else if( k_row == row - n && k_col == col - n ) $( "#" + k ).addClass( "red" );
                }
                //赤いマス数カウント
                if( $( "#" + k ).hasClass( "red" ) ) redCount++;
            }
            $( this ).addClass( "red" );
            $( this ).text( "♕" );
            nqueenNum++;
            $( "#nqueen-num" ).text( nqueenNum );
            if( nqueenNum == nqueenSize ) {
                S.alert( "Nクイーン", nqueenSize + "クイーンに成功！おめでとうございます！" );
                $( "#nqueen-tweet" ).attr( "href", "https://twitter.com/intent/tweet?url=http://j.mp/n-queen&text=" + nqueenSize + "%E3%82%AF%E3%82%A4%E3%83%BC%E3%83%B3%E3%81%AB%E6%88%90%E5%8A%9F%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F" ).show()
                return;
            }
            if( redCount == nqueenSize * nqueenSize ) {
                S.alert( "Nクイーン", "失敗です。再チャレンジしてください" );
                return;
            }
        } );
    } );
}