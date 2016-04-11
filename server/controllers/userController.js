
//require user model
var User = require('../models/userModel.js');

// CRUD ACTIONS
//============================================

exports.createOne = function(req, res) {
  var newUser = req.body;
  User.create(newUser, function(err, newUser) {
    if(err){
      return res.json(err);
    }
    res.json(newUser);
  });
};

exports.retrieveOne = function(req, res) {
  //have to look in req.params to check for the id. Set the _id to to the value in req.params.id
  var query = {_id: req.params.user_id};
  User.findOne(query, function(err, matchingUser){
    if(err){
      return res.json(err);
    } 
    res.json(matchingUser);  
  });
};

exports.retrieveAll = function(req, res) {
  var query = req.query;
  User.find(query, function(err, allUsers){
    if(err){
      return res.json(err);
    } 
    res.json(allUsers);
  });
};

exports.updateOne = function(req, res) {
  var query = {_id: req.params.user_id};
  var updatedProp = req.body;
  var options = {new: true, upsert: true};
  User.findOneAndUpdate(query, updatedProps, options, function(err, matchingUser){
    if(err){
      return res.json(err);
    } 
    res.json(matchingUser);
  });
};

exports.deleteOne = function(req, res) {
  var query = {_id: req.params.user_id};
  User.findOneAndRemove(query, function(err, matchingUser){
    if(err){
      return res.json(err);
    } 
    res.json(matchingUser);
  });
};
