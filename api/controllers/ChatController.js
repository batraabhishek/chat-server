/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    getPendingMessages: function (req, res) {

        var userId = req.param('id');

        Chat.find({user: userId}).populate('messages').exec(function (error, chats) {

            if (error) {
                res.json(error)
            } else {
                res.json(chats)
            }
        });
    },

    createNewMessage: function (req, res) {

        console.log('Create new message');

        var message = req.param('message');
        var fromUser = req.param('sender');
        var image = req.param('image');
        var toUser = req.param('toUser');
        var isImage = req.param('isImage');

        console.log('From User ' + fromUser);
        console.log('To User ' + toUser);

        Chat.findOne({sender: fromUser, user: toUser}).exec(function (error, chat) {

            var messageData = {
                message: message,
                image: image,
                chat: chat,
                isImage: isImage
            };

            console.log(messageData);

            if (error) {
                return res.json(error);
            } else if (chat) {
                messageData.chat = chat;
                console.log('Creating new message');
                createMessage(res, messageData, toUser)
            } else {
                var chatData = {
                    sender: fromUser,
                    user: toUser,
                    messages: []
                }

                console.log('Creating new chat');
                createChat(res, chatData, messageData, toUser)
            }
        });
    }
};

function createChat(res, chatData, messageData, toUser) {
    Chat.create(chatData).exec(function (error, chat) {

        if (error) {
            return res.json(error);
        } else if (chat) {
            messageData.chat = chat;
            console.log('Chat created, now creating message');
            createMessage(res, messageData, toUser);
        }
    });
}

function createMessage(res, messageData, toUser) {
    Message.create(messageData).exec(function (error, message) {
        if (error) {
            res.json(error);
        } else {
            User.findOneById(toUser).exec(function (error, user) {
                if (error) {
                    res.json(error)
                } else if (user) {
                    console.log('Message created');
                    message.socketId = user.socketId;
                    findChatById(res, message);
                } else {
                    res.json({error: 'User not found'});
                }

            });
        }
    });
}

function findChatById(res, message) {

    Chat.findOneById(message.chat).populate('sender').exec(function (error, chat) {

        if (error) {
            res.json(error)
        } else {
            message.chat = chat;

            console.log('Sending response')
            console.log(message);

            res.json(message);
        }
    })
}

