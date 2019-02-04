app_clock(pid);

function app_clock(_pid) {

    System.avoidMultiple( _pid );

    $("#winc"+_pid+" canvas").addClass("clock-canvas"+_pid);

    // 時計を毎秒描画する
    $(function () {
        setInterval(draw, 10);
    });

    // 時計を描画する
    function draw() {

        // 円のスタイルを定義する
        // radius はキャンバスサイズに対する比率
        var circle = {
            outer: {
                radius: 0.9,
                color: "#2a2a2a"
            },
            inner: {
                radius: 0.85,
                color: "#f6f6f6"
            }
        };

        // 目盛りのスタイルを定義する
        // from, to はキャンバスサイズに対する比率
        var lines = {
            long: {
                from: 0.8,
                to: 0.68,
                width: 3,
                color: "#2a2a2a"
            },
            short: {
                from: 0.8,
                to: 0.75,
                width: 1,
                color: "#2a2a2a"
            }
        };

        // 針のスタイルを設定する
        // length は キャンバスサイズに対する比率
        // ratio は反対側の長さの比率
        var hands = {
            hour: {
                length: 0.43,
                width: 8,
                cap: "round",
                color: "#333",
                ratio: 0.2
            },
            minute: {
                length: 0.67,
                width: 6,
                cap: "round",
                color: "#333",
                ratio: 0.2
            },
            second: {
                length: 0.67,
                width: 2,
                cap: "round",
                color: "#dd3c3c",
                ratio: 0.2
            }
        }

        // キャンバスを設定する
        var canvas = $(".clock-canvas")[0];
        canvas.width = "300"
        canvas.height = "300";
        var context = canvas.getContext("2d");
        var center = {
            x: Math.floor(canvas.width / 2),
            y: Math.floor(canvas.height / 2)
        };
        var radius = Math.min(center.x, center.y);
        var angle;
        var len;

        // 円を描画する
        context.beginPath();
        context.fillStyle = circle.outer.color;
        context.arc(center.x, center.y, radius * circle.outer.radius, 0, Math.PI * 2, false);
        context.fill();
        context.beginPath();
        context.fillStyle = circle.inner.color;
        context.arc(center.x, center.y, radius * circle.inner.radius, 0, Math.PI * 2, false);
        context.fill();

        // 目盛りを描画する
        for (var i = 0; i < 60; i++) {
            angle = Math.PI * i / 30;
            context.beginPath();
            var line = (i % 5 == 0) ? lines.long : lines.short;
            context.lineWidth = line.width;
            context.strokeStyle = line.color;
            context.moveTo(center.x + Math.sin(angle) * radius * line.from, center.y - Math.cos(angle) * radius * line.from);
            context.lineTo(center.x + Math.sin(angle) * radius * line.to, center.y - Math.cos(angle) * radius * line.to);
            context.stroke();
        }

        // 現在時刻を取得する
        var date = new Date();
        var h = date.getHours() % 12;
        var m = date.getMinutes();
        var s = date.getSeconds();

        // 時針を描画する
        angle = Math.PI * (h + m / 60) / 6;
        len = radius * hands.hour.length;
        context.beginPath();
        context.lineWidth = hands.hour.width;
        context.lineCap = hands.hour.cap;
        context.strokeStyle = hands.hour.color;
        context.moveTo(center.x - Math.sin(angle) * len * hands.hour.ratio, center.y + Math.cos(angle) * len * hands.hour.ratio);
        context.lineTo(center.x + Math.sin(angle) * len, center.y - Math.cos(angle) * len);
        context.stroke();

        // 分針を描画する
        angle = Math.PI * (m + s / 60) / 30;
        len = radius * hands.minute.length;
        context.beginPath();
        context.lineWidth = hands.minute.width;
        context.lineCap = hands.minute.cap;
        context.strokeStyle = hands.minute.color;
        context.moveTo(center.x - Math.sin(angle) * len * hands.minute.ratio, center.y + Math.cos(angle) * len * hands.minute.ratio);
        context.lineTo(center.x + Math.sin(angle) * len, center.y - Math.cos(angle) * len);
        context.stroke();

        // 秒針を描画する
        angle = Math.PI * s / 30;
        len = radius * hands.second.length;
        context.beginPath();
        context.lineWidth = hands.second.width;
        context.lineCap = hands.second.cap;
        context.strokeStyle = hands.second.color;
        context.moveTo(center.x - Math.sin(angle) * len * hands.second.ratio, center.y + Math.cos(angle) * len * hands.second.ratio);
        context.lineTo(center.x + Math.sin(angle) * len, center.y - Math.cos(angle) * len);
        context.stroke();
    }
}