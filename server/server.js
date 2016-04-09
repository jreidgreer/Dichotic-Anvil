var express = require('express');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/borrow');
app.use(express.static('client'));

app.get('/', function(req, res) {
  res.send('successful get request');
});

app.post('/', function(req, res) {
});



app.listen(3000);