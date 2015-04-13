module.exports = {

	connection : {
		port : 8080,
		host : 'localhost'
	},

	db : {
		url : 'mongodb://108.59.83.65/stressmap'
	},

	session : {
		secret : 'stress42map24secret'
	},

	google : {
		clientID : '634988465482-4tanucoul2veruirj6mvv69l74llca5g.apps.googleusercontent.com',
		clientSecret : 'LlK3wi2b0FIEXuOVY-2PZ75G',
		callbackURL : '/api/auth/google/callback'
	},
	
	facebook : {
		clientID : '426618484157529',
		clientSecret: 'e3082dfc7e60c0bd379cf1f71d83b5b8',
		callbackURL: '/api/auth/facebook/callback'
	},

	twitter : {

		clientID : 'Jm3gz4yGhFtaSZLralSsNmfTc',
		clientSecret : 'fE75C2fXozZ5L8wF9YzrJJvT39qJP8rV9EDgfOBw0L3IjJkySr',
		callbackURL : '/api/auth/twitter/callback'

	}

};