// BASE SETUP
//============================================

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var mongolab_URI = 'mongodb://dichotic-anvil:6DH6qhtoNywPvV@ds017070.mlab.com:17070/borrow';

// to connect via command line using mongo client:
// mongo ds017070.mlab.com:17070/borrow -u dichotic-anvil -p 6DH6qhtoNywPvV

var dbURI = mongolab_URI || 'mongodb://localhost/borrow';
mongoose.connect(dbURI);

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