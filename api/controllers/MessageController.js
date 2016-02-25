/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    deleteMessages: function (req, res) {

        var ids = JSON.parse(req.param(ids));q
        Message.destroy({id: ids}).exec(function (error) {

            if (error) {
                return res.json(error)
            } else {
                return res.ok();
            }
        });

    }
};

