/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var randomstring = require("randomstring");

module.exports = {

    updateSocketId: function (req, res) {

        var userId = req.param('user');
        var socketId = req.param('socketId');
        User.update({id: userId}, {socketId: socketId}).exec(function afterwards(err, updated) {

            if (err) {
                return res.json(err);
            } else {
                return res.json({updated: updated[0].name});
            }
        });

    },

    addMessage: function (req, res) {

        var message = req.param('message');
        var sender = req.param('sender');
        var chat = req.param('chat');
        var userPic = req.param('image');

        var dir = 'uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        var path = dir + '/' + randomstring.generate(16) + ".jpg";

        var messageJson = {
            message: message,
            sender: sender,
            chat: chat,
            userPic: path
        };

        fs.writeFile(path, new Buffer(image, 'base64'), function (error) {
            if (error) {
                console.log(error);
            }
        });

        Message.create(messageJson).exec(function createCb(error, created) {

            var chatId = created.chat;
            Chat.findById(chatId).exec(function (error, chat) {
                var otherUser = created.sender == chat[0].user1 ? chat[0].user2 : chat[0].user1;
                User.findById(otherUser).exec(function (error, user) {
                    return res.json(user);
                });
            });

            Chat.update({id: created.chat}, {lastMessage: created.id}).exec(function afterwards(error, updated) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(updated);
                }
            });
        });
    },

    userLogin: function (req, res) {
        var userName = req.param('username');
        var password = req.param('password');

        if (!userName || !password) {
            return res.send(404, {error: 'Username/Password cannot be empty'});
        } else {
            User.findOne({username: userName, password: password}).exec(function findOneCB(err, user) {

                if (err || !user) {
                    return res.send(404, {error: 'Username/Password wrong'});
                } else {
                    return res.json(user);
                }
            });
        }

    },

    findUserChats: function (req, res) {
        var userId = req.param('userId');
        console.log(userId);

        Chat.find({
            or: [
                {user1: userId},
                {user2: userId}
            ]
        }).populate('user1')
            .populate('user2')
            .populate('lastMessage')
            .exec(function (err, chats) {
                if (err) {
                    return res.json(err);
                } else {
                    return res.json(chats);
                }
            });
    },

    saveBase64Image: function (req, res) {

        var dir = 'uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        var path = dir + '/' + randomstring.generate(12) + ".jpg";

        var image = req.param('image');
        fs.writeFile(path, new Buffer(image, 'base64'), function (error) {

            if (!error) {
                return res.json({data: path});
            } else {
                return res.json(error);
            }
        });

    }

};

