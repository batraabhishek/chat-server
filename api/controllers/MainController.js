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
            console.log(error);
            console.log(data);

            return res.json(data);
        });

    },

    updateSocketId: function (req, res) {

        var userId = req.param('user');
        var socketId = req.param('socketId');

        console.log(userId);
        console.log(socketId);

        User.update({id: userId}, {socketId: socketId}).exec(function afterwards(err, updated) {

            if (err) {
                return res.json(err);
            } else {
                console.log('Updated user to have name ' + updated[0].name);
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
    }


};

