'use strict';

require('./model/user');

var passport = require('passport'),
	_ = require('lodash'),
	User = require('mongoose').model('User'),
	path = require('path');

	require('./strategies/google')();
	require('./strategies/local')();
	require('./strategies/facebook')();
	require('./strategies/twitter')();

/**
 * Module init function.
 */
module.exports = function() {


	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});


};

