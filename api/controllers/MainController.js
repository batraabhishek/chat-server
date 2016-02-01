/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getAllChatMessages: function (req, res) {

        var chatId = req.param('chatId');

        Chat.findById(chatId).exec(function (error, data) {
            return res.json(data);
        });

    },

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
        var userPic = req.param('userPic');

        var messageJson = {
            message: message,
            sender: sender,
            chat: chat,
            userPic: userPic
        };

        Message.create(messageJson).exec(function createCb(error, created) {

            var chatId = created.chat;
            Chat.findById(chatId).exec(function (error, chat) {
                console.log(error);
                console.log(chat);
                var otherUser = created.sender == chat[0].user1 ? chat[0].user2 : chat[0].user1;
                console.log(otherUser);
                User.findById(otherUser).exec(function (error, user) {
                    return res.json(user);
                });
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
        }).exec(function (err, chats) {
            if (err) {
                return req.json(err);
            } else {
                for (var i in chats) {
                    Message.findOne({
                        where: {chat: chats[i].id}, sort: 'id DESC'
                    }).exec(function lastMessage(error, message) {
                        if(!error && message) {
                            chats[i].message = message;
                        }

                        if(chats.length -1 == i) {
                            return res.json(chats);
                        }
                    });
                }
            }
        });

    }


};

