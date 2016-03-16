process.chdir(__dirname);

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var querystring = require('querystring');
var http = require('http');
var requestify = require('requestify');
var request = require("request");


// Ensure a "sails" can be located:
(function () {
    var sails;

    try {
        sails = require('sails');
    } catch (e) {
        console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
        console.error('To do that, run `npm install sails`');
        console.error('');
        console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
        console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
        console.error('but if it doesn\'t, the app will run with the global sails instead!');
        return;
    }

    // Try to get `rc` dependency
    var rc;
    try {
        rc = require('rc');
        git
    } catch (e0) {
        try {
            rc = require('sails/node_modules/rc');
        } catch (e1) {
            console.error('Could not find dependency: `rc`.');
            console.error('Your `.sailsrc` file(s) will be ignored.');
            console.error('To resolve this, run:');
            console.error('npm install rc --save');
            rc = function () {
                return {};
            };
        }
    }


    // Start server
    sails.lift(rc('sails'));


    var PORT_NO = 8006;
    server.listen(PORT_NO);

    console.log('Starting socket on port: ' + PORT_NO);

    io.on('connection', function (socket) {

        socket.on('register_mobile', function (data) {
            registerMobile(socket, data);
        });

        socket.on('send_new_message', function (data) {
            sendNewMessage(data);
        });

        socket.on('message_acknowledgement', function (data) {
            deleteMessage(data);
        })

    });
})();


function registerMobile(socket, data) {
    var userId = data.userId;
    var url = 'http://localhost:1337/updateSocketId/' + userId + '?socketId=' + encodeURIComponent(socket.id);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    });
}

function sendNewMessage(data) {
    var url = 'http://localhost:1337/message';
    requestify.post(url, data)
        .then(function (response) {
            console.log('Got response');
            var jsonBody = response.getBody();
            console.log(jsonBody);
            jsonBody.image = jsonBody.image;
            jsonBody.sender = jsonBody.chat.sender.id;
            delete jsonBody.chat.messages;
            io.to(jsonBody.socketId).emit('new_message', jsonBody);
        });
}

function deleteMessage(data) {
    var messageId = data.messageId;
    request({
        uri: "http://localhost:1337/message/" + messageId,
        method: "DELETE"
    }, function (error, response, body) {
        console.log('Message Deleted');
        console.log(body);
    });

}
