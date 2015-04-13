module.exports = function(app) {
	
	//health check for Docker
	app.get('/_ah/health', function(req, res) {
	    res.set('Content-Type', 'text/plain');
	    res.send(200, 'ok');
	});

	app.get('/_ah/start', function(req, res) {
	    res.set('Content-Type', 'text/plain');
	    res.send(200, 'ok');
	});

	app.get('/_ah/stop', function(req, res) {
	    res.set('Content-Type', 'text/plain');
	    res.send(200, 'ok');
	    process.exit();
	});

}