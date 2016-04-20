var Item = require('./itemModel.js');  //require Item model to make relational connection to User inventory items
var bcrypt = require('bcrypt-nodejs');

var Sequelize = require('sequelize');
var db = require('../db');

var User = db.define('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  userName: { type: Sequelize.STRING, required: true, unique: true },
  password: { type: Sequelize.STRING, required: true },
  picture: Sequelize.STRING
},
{
  hooks: {
    beforeCreate: function(user) {
      var password = user.get('password');

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
        });
      });
    }
  },
  instanceMethods: {
    comparePasswords: function(inputPassword, callback) {
      var actualPassword = this.password;
      bcrypt.compare(inputPassword, actualPassword, function(err, res) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, res);
        }
      });
    }
  }
});

User.hasMany(db.Item, {as: 'Inventory'});
User.hasMany(db.User, {as: 'Friends'});

module.exports = User;
