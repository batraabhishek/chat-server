/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    getPendingMessages: function (req, res) {

        var userId = req.param('id');

        Chat.findOneByUser(id).populate('messages').exec(function (error, chats) {

            if (error) {
                res.json(error)
            } else {
                res.json(chats)
            }

        })

    },

    createNewMessage: function (req, res) {

        console.log('Create new message');

        var message = req.param('message');
        var fromUser = req.param('sender');
        var imageUrl = req.param('imageUrl');
        var toUser = req.param('toUser');

        console.log('From User ' + fromUser);
        console.log('To User ' + toUser);

        Chat.findOne({sender: fromUser, user: toUser}).exec(function (error, chat) {

            var messageData = {
                message: message,
                image: imageUrl,
                chat: chat
            };

            if (error) {
                return res.json(error);
            } else if (chat) {
                messageData.chat = chat;
                createMessage(res, messageData)
            } else {
                var chatData = {
                    sender: fromUser,
                    user: toUser,
                    messages: []
                }

                createChat(res, chatData, messageData)
            }
        });
    }
};

function createChat(res, chatData, messageData) {
    Chat.create(chatData).exec(function (error, chat) {

        if (error) {
            return res.json(error);
        } else if (chat) {
            messageData.chat = chat;
            createMessage(res, messageData);
        }
    });
}

function createMessage(res, messageData) {
    Message.create(messageData).populate('chat').exec(function (error, message) {
        if (error) {
            res.json(error);
        } else {
            User.findOneById(toUser).exec(function (error, user) {
                if (error) {
                    res.json(error)
                } else if (user) {
                    message.socketId = user.socketId;
                    res.json(message);
                } else {
                    res.json({error: 'User not found'});
                }

            });
        }
    });
}

