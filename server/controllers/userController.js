
//require user model
var User = require('../models/userModel.js');

// CRUD ACTIONS
//============================================

exports.createOne = function(req, res) {
  var newUser = req.body;
  User.create(newUser, function(err, user) {
    if(err) {
      return res.json(err);
    }
    res.json(user);
  });
};

exports.verifyLogin = function(req, res) {
  var username = {userName: req.body.userName};
  User.findOne(username, function(err, user) {
    if(!user) {
      res.send({error: 'no user found'});
    } else {
      if (req.body.password === user.password) {
        res.send({
          username: user.userName,
          inventory: user.inventory
        });
      } else {
        res.send({error: 'invalid email or password'});
      }
    }
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
  var updatedProps = req.body;
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
