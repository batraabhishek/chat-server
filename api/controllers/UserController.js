/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    createOrUpdate: function (req, res) {

        var username = req.param('username');
        var number = req.param('number');

        var body = {
            username:username,
            number:number
        };

        User.findOrCreate({number: number}, body, function(error, user) {

            if(error) {
                return res.json(error);
            } else if(user && user.username != username) {

                User.update({number:number}, {username: username}, function (updateError, updatedUser) {
                    if(updateError) {
                        return res.json(error);
                    } else {
                        return res.json(updatedUser);
                    }
                });

            } else {
                return res.json(user);
            }
        });

    }
	
};

