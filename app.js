var express = require('express');
var escape = require("html-escape");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var WebSocketServer = require('websocket').server;



var app = express();
var httpServer = require('http').Server(app);

var webSocketServer = new WebSocketServer({
    httpServer:httpServer,
    autoAcceptConnections:true,
    maxReceivedFrameSize: 64*1024*1024,
    maxReceivedMessageSize: 64*1024*1024
});

var sockets = [];
webSocketServer.on("connect",function(socket){
    //Speichere alle Chatclients in einem Array
    sockets.push(socket);
    socket.on("message",function(message){
        if(message.type == "utf8"){
            for (var i = 0; i < sockets.length; i++) {
                sockets[i].send(escape(message.utf8Data));
            };
        }
    });

    socket.on("close",function(reasonCode, description){
        //Entferne Chatclient falls er die Verbindung schließt
        sockets.splice(sockets.indexOf(socket),1);
    })
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get("/",function(req,res){
    console.log("hello");
    res.render('index.jade', { title: 'Express' });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



httpServer.listen(3000,function(){
    console.log("Der Express-Chat-Server laeuft auf dem Port 3000");
})

