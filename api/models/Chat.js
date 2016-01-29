/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        user1: {
            model: 'user'
        },
        user2: {
            model: 'user'
        },
        messages: {
            collection: 'message',
            via: 'chat'
        }

    }
};

