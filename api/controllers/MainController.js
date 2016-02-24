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
            } else if (updated) {
                return res.json({updated: updated[0].name});
            } else {
                return res.json({error: 'User does not exist'});
            }
        });

    },

    addMessage: function (req, res) {

        var message = req.param('message');
        var sender = req.param('sender');
        var chat = req.param('chat');
        var image = req.param('image');

        var dir = 'assets/images';
        var filaName = randomstring.generate(16) + ".jpg"
        var path = dir + '/' + filaName;
        var relativepath = 'images/' + filaName;

        var messageJson = {
            message: message,
            sender: sender,
            chat: chat,
            userPic: relativepath
        };

        fs.writeFile(path, new Buffer(image, 'base64'), function (error) {
            if (error) {
                console.log(error);
            } else {
                Message.create(messageJson).exec(function createCb(error, created) {

                    if (error) {
                        return res.json(error);
                    } else {
                        var chatId = created.chat;
                        Chat.findOneById(chatId).exec(function (error, chat) {
                            var otherUser = created.sender == chat.user1 ? chat.user2 : chat.user1;
                            User.findOneById(otherUser).exec(function (error, user) {
                                user.imagePath = relativepath;

                                return res.json(user);
                            });
                        });

                        Chat.update({id: created.chat}, {lastMessage: created.id}).exec(function afterwards(error, updated) {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                });
            }
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

    },

    createNewChatRoom: function (req, res) {

        var user1 = req.param('user1');
        var user2 = req.param('user2');

        console.log('Executed till here');

        Chat.findOne({
            or: [
                {user1: user1, user2: user2},
                {user2: user1, user1: user2}
            ]
        }).exec(function (error, chat) {
            if (error) {
                return res.json(error);
            } else {

                if (chat) {
                    console.log('Chat found');
                    console.log(chat)
                    return res.json(chat);
                } else {
                    console.log('Need to create new chat');
                    var chatData = {
                        user1: user1,
                        user2: user2
                    }

                    Chat.create(chatData).exec(function (error, newChat) {
                        if (error) {
                            console.log(error);
                            return res.json(error);
                        } else {
                            console.log(newChat);
                            newChat.messages = [];
                            return res.json(newChat);
                        }

                    });
                }

            }
        });
    },

    getUsers: function (req, res) {
        var username = req.param('username');
        User.find({
            name: {'!': [username]}
        }).exec(function (error, users) {
            if(error) {
                res.json(error)
            } else {
                res.json(users);
            }
        });
    }

};

