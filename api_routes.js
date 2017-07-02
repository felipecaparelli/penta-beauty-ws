// api_routes.js

// Create the service wrapper
var personalityInsights = watson.personality_insights({
  version: 'v2',
  username: '<username>',
  password: '<password>'
});

module.exports = function(app, db) {

	app.get('/', function(req, res) {
	  res.render('index', { ct: req._csrfToken });
	});

	app.post('/api/profile', function(req, res, next) {
	  var parameters = extend(req.body, { acceptLanguage : i18n.lng() });

	  personalityInsights.profile(parameters, function(err, profile) {
		if (err)
		  return next(err);
		else
		  return res.json(profile);
	  });
	});

	app.post('/api/login', function(req, res, next) {
		// Save the access token
		oauth2.ownerPassword.getToken(tokenConfig, (error, result) => {
		  if (error) {
			return console.log('Access Token Error', error.message);
		  }

		  const token = oauth2.accessToken.create(result);
		});
	});
	
	app.post('/api/product', (req, res) => {
		const product = { name: req.body.name, created: req.body.created, status: req.body.status };
		db.collection('products').insert(product, (err, result) => {
		  if (err) { 
			res.send({ 'error': 'An error has occurred' }); 
		  } else {
			res.send(result.ops[0]);
		  }
		});
	});
  
  
};