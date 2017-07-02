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

//routes
require('./app/routes')(app, {});

//i18n settings
require('./config/i18n')(app);

// Bootstrap application settings
require('./config/express')(app);

app.use(bodyParser.urlencoded({ extended: true }));

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')(app, database);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})
