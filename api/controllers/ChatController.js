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

        // find the toUser;

        Chat.findOne({sender: fromUser, user: toUser}).exec(function (error, chat) {


            if (error) {
                return res.json(error);
            } else if (chat) {

                var messageData = {
                    message: message,
                    image: imageUrl,
                    chat: chat
                };

                console.log('Chat found');
                console.log('Adding new message');
                Message.create(messageData).exec(function (error, message) {

                    if (error) {
                        res.json(error);
                    } else {
                        res.json(message);
                    }
                });
            } else {
                // Create Chat
                console.log('Creating new chat');

                var chatData = {
                    sender: fromUser,
                    user: toUser,
                    messages: []
                }

                Chat.create(chatData).exec(function (error, chat) {

                    if (error) {
                        return res.json(error);
                    } else if (chat) {
                        var messageData = {
                            message: message,
                            image: imageUrl,
                            chat: chat
                        };

                        console.log('Creating message')
                        Message.create(messageData).exec(function (error, message) {
                            if (error) {
                                res.json(error);
                            } else {
                                res.json(message);
                            }
                        });
                    }
                });
            }
        });
    }
};

