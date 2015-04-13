require('../model/user');  
var User = require('mongoose').model('User'),
    users = require('../users/users.server.controller');
    passport = require('passport'),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    request = require('request');

module.exports = function(app) {

    app.use(jsonParser);

    app.route('/api/auth/google').get(passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.route('/api/auth/google/callback').get(users.oauthCallback('google'));


    app.route('/api/auth/facebook').get(passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.route('/api/auth/facebook/callback').get(users.oauthCallback('facebook'));


    app.route('/api/auth/twitter').get(passport.authenticate('twitter'));
    app.route('/api/auth/twitter/callback').get(users.oauthCallback('twitter'));


    app.route('/api/auth/signout').get(users.signout);

    app.route('/api/auth/signup').post(users.signup);

    app.route('/api/auth/login').post(users.signin);

}