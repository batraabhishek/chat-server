/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        message: {
            type: 'string',
        },
        image: {
            type: 'string',
        },
        isImage: {
            type: 'boolean',
            required: true
        },
        chat: {
            model: 'chat'
        }
    }
};

