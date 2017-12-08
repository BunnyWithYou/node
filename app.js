// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');

// // 创建 application/x-www-form-urlencoded 编码解析
// var urlencodedParser = bodyParser.urlencoded({
//     extended: false
// })

// app.use(express.static('public'));

// app.get('/index.htm', function (req, res) {
//     res.sendFile(__dirname + "/" + "index.htm");
// })
// app.post('/abc', function (req, res) {
//     res.send('123');
//     res.end();
// })

// app.post('/process_post', urlencodedParser, function (req, res) {

//     // 输出 JSON 格式
//     response = {
//         first_name: req.body.first_name,
//         last_name: req.body.last_name
//     };
//     console.log(response);
//     res.end(JSON.stringify(response));
// })

// var server = app.listen(8081, function () {

//     var host = server.address().address
//     var port = server.address().port

//     console.log("应用实例，访问地址为 http://%s:%s", host, port)

// })

var http = require('http');
var fs = require('fs');

var count = 0;
var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', function (error, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(data, 'utf-8');
    });
}).listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
var io = require('socket.io').listen(server);
var message = [];

io.sockets.on('connection', function (socket) {
    count++;
    console.log('User connected' + count + 'users');
    socket.emit('users', {
        number: count
    });
    socket.broadcast.emit('users', {
        number: count
    });
    socket.on('disconnect', function () {
        count--;
        console.log('User disconnected');
        socket.broadcast.emit('users', {
            number: count
        });
    });

    socket.on('pushMessage', function (data) {
        message.push(data.text);
        socket.emit('getMessage', {
            message: message
        });
    });
});