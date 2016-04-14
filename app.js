'use strict';
// var p = new Promise(function(resolve, reject) {
//     resolve('resolve ok');
// });
// p.then(function(data) {
//     console.log(data);
// });
var http = require('http');
var express = require('express');
var path = require('path'); // 系统路径模块
var app = express();
// 视图引擎配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//使用ejs渲染html模板引擎
app.engine('html', require('ejs').renderFile);
var port = 1337
app.set('port', port);
app.listen(port);
var server = http.createServer(app);
var router = express.Router();
server.on('error', err => {
    console.log(err.message);
    throw err;
});
server.on('listening', function() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? '管道 ' + addr : '端口 ' + addr.port;
    console.log(bind);
});
app.get(['/', '/test'], function(req, res, next) {
    res.render('index.html', {});
});
app.get('/test/sse', function(req, res, next) {

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'types': 'sse',
        'retry': 10000 //最大间隔时间
    });
    var i = 0,
        s = '',
        interval = setInterval(function() {
            i++;
            if (i == 10) {
                clearInterval(interval);
                s = "event:end\n" + "id:" + i + "\n" + "data:sse exec finished\n\n";
                res.write(s);
                // res.write("event:end\n"); //传参event，依照\n 作为结束
                // res.write("id:" + i + "\n");
                // res.write("data:sse exec finished\n\n"); //传参data，依照\n\n 参数终止
            } else {
                s = "event:end\n" + "id:" + i + "\n" + "data:" + (new Date()) + "\n\n";
                res.write(s);
            }
        }, 1000);
});