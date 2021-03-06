/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */

// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname);

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var querystring = require('querystring');
var http = require('http');
var requestify = require('requestify');


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
            sendNewMessage(socket, data);
        });

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

function sendNewMessage(socket, data) {

    var dt = new Date();
    data.createdAt = dt.toISOString();
    var url = 'http://localhost:1337/message';
    var postData = {
        message: data.message,
        sender: data.sender,
        userPic: 'http://www.google.com',
        chat: data.chat,
        image: data.image
    };


    requestify.post(url, postData)
        .then(function (response) {
            var jsonBody = response.getBody();
            data.userPic = jsonBody.imagePath;
            delete data.image;
            console.log(data);
            io.to(jsonBody.socketId).emit('new_message', data);
            io.to(socket.id).emit('new_message', data);
        });
}
