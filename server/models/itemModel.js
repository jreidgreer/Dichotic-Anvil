var User = require('../models/userModel.js');
var Request = require('../models/requestModel.js');
var Sequelize = require('sequelize');
var db = require('../db');

var Item = db.define('item', {
  itemName : Sequelize.String,
  borrowed : Sequelize.Boolean,
  itemDescription: Sequelize.String,
  picture: Sequelize.String,
});

Item.hasMany(Request, {as: 'Requests'});
Item.hasOne(User, {as: 'Owner'});

module.exports = Item;

