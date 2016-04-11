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

var userRouter = require('./routers/userRouter.js');
var itemRouter = require('./routers/itemRouter.js');

// points to user and item routers at respective routes
app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);

app.get('/', function(req, res) {
  res.json({message: 'Ready to go!'});
});

app.post('/', function(req, res) {
});

// START THE SERVER
//============================================
app.listen(port, function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Borrow App up and running on port: ' + port);
});