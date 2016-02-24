/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var randomstring = require("randomstring");

module.exports = {

    updateSocketId: function (req, res) {

        var userId = req.param('user');
        var socketId = req.param('socketId');
        User.update({id: userId}, {socketId: socketId}).exec(function afterwards(err, updated) {

            if (err) {
                return res.json(err);
            } else if (updated) {
                console.log(updated);
                return res.json(updated);
            } else {
                return res.json({error: 'User does not exist'});
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
            username: {'!': [username]}
        }).exec(function (error, users) {
            if (error) {
                res.json(error)
            } else {
                res.json(users);
            }
        });
    }

};

