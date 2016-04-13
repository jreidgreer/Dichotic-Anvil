// BASE SETUP
//============================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/borrow');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('client'));

var port = process.env.PORT || 3000;

// ROUTES FOR OUR API
//============================================
require('./routers/routes.js')(app, express);

// START THE SERVER
//============================================
app.listen(port, function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Borrow App up and running on port: ' + port);
});