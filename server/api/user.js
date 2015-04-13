require('../model/user');  
  
var User = require('mongoose').model('User');

module.exports = function(app) {

	app.get('/api/userinfo', function (request, response) {
		if(request.isAuthenticated()) {
		    User.findOne({
		        _id: request.user._id
		    }, '-salt -password', function(err, user) {
		        response.send({user : user})
		    });
		} else {
			response.send({user : {} })
		}
	   
	});

}