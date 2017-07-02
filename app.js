/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const credentials = {
  client: {
    id: '<client-id>',
    secret: '<client-secret>'
  },
  auth: {
    tokenHost: 'https://api.oauth.com'
  }
};

const tokenConfig = {
  username: 'usuario',
  password: '123456' 
};

var express    = require('express'),
  app          = express(),
  bodyParser   = require('body-parser'),
  mongoose 	   = require('mongoose'),
  Schema 	   = mongoose.Schema,
  MongoClient  = require('mongodb').MongoClient,
  jwt 		   = require('jsonwebtoken'),
  oauth2 	   = require('simple-oauth2').create(credentials),
  watson       = require('watson-developer-cloud'),
  extend       = require('util')._extend,
  i18n         = require('i18next');
  
  
var ProductSchema = new Schema({
  name: {
    type: String,
    Required: 'Por favor, preencha o nome do produto'
  },
  created: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Products', ProductSchema);

//i18n settings
require('./config/i18n')(app);

// Bootstrap application settings
require('./config/express')(app);

// Create the service wrapper
var personalityInsights = watson.personality_insights({
  version: 'v2',
  username: '<username>',
  password: '<password>'
});

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


app.get('/api/shop', function (req, res) {
   //item
	//console.log(req.body);
	res.end(req.body);
})

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

app.listen(port);

console.log('listening at:', port);
