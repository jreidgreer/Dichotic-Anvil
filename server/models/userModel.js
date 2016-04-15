var mongoose = require('mongoose');
var Item = require('../models/itemModel.js');  //require Item model to make relational connection to User inventory items
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");


var userSchema = new Schema({

  firstName: String,
  lastName: String,
  userName: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  created_At: Date,
  updated_At: Date,
  inventory: [
    {
      type: Schema.ObjectId, 
      ref: 'Item',
      default: []
    }
  ],
});

userSchema.methods.comparePasswords = function(inputPassword, callback) {
  var actualPassword = this.password
  console.log('INPUT PASSWORD=====', inputPassword)
  console.log('ACTUAL PASSWORD=====', actualPassword)
  bcrypt.compare(inputPassword, actualPassword, function(err, res) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
};

userSchema.pre('save', function(next){
  var user = this;
  var password = this.password;
  bcrypt.genSalt(10, function(err, salt) {
    if(err) {
      return next(err);
    }
    bcrypt.hash(password, salt , null, function(err, hash) {
      if(err) {
        return next(err);
      }

      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

//Create a model using the schema
var User = mongoose.model('User', userSchema);
module.exports = User;
