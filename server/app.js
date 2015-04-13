var config = require('./config');

var express = require('express'), 
    app = express(),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    compression = require('compression'),
    path = require('path'),
    mongoose = require('mongoose');


var ws = require("nodejs-websocket");

var socketServer = ws.createServer(function (conn) {

    conn.on("text", function (message) {
        var messageObject = JSON.parse(message);

        if(messageObject.message.username) {
            conn.username = messageObject.message.username;
        }
        
    });

    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    });

}).listen(3000);

app.use(cookieParser());

app.use(session({ 
    secret: config.session.secret,
    saveUninitialized: true,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(config.db.url, function(err) {
    if (err) {
        console.log('DB connection failed.')
    }
});

require('./passport')();

require('./api/healthcheck')(app);
require('./api/auth')(app);
require('./api/point')(app, socketServer);
require('./api/user')(app);

app.use(compression({
    // only compress files for the following content types
    filter: function(req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    // zlib option for compression level
    level: 3
}));

app.use(express.static(path.resolve('./public')));

app.listen(config.connection.port, function () {
    console.log('App listening at http://%s:%s', config.connection.host, config.connection.port)
});


