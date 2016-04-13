
//require user model
var User = require('../models/userModel.js');
var jwt = require('jwt-simple'); // used to create, sign, and verify tokens


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

exports.verifyLogin = function(req, res, next) {
  var userName = req.body.userName;
  var password = req.body.password;

  console.log('USERNAME======', userName);
  console.log('PASSWORD======', password);

  User.findOne({userName: userName}, function(err, user) {
    if(!user) {
      next(console.error('User not found', err));
    } else {
      user.comparePasswords(password, function(err, compareResult){
        if (err) {
          console.error('Error with password comparison', err);
        }
        if(compareResult) {
          var token = jwt.encode(user, 'shhhhh');
          res.json({token: token});
        } else {
          return next(console.log('Passwords do not match'));
        }
      });
    }
  });
};

exports.authCheck = function (req, res) {
  var token = req.headers['x-access-token'];
  if (!token) {
    res.json({error: 'No token'});
  } else {
    var user = jwt.decode(token, 'shhhhh');
    User.findOne({userName: user.userName}, function(err, foundUser) {
        if (foundUser) {
          res.send(200);
        } else {
          res.send(401);
        }
    })
  }
}

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
