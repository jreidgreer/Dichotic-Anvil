var User = require('../models/userModel.js');
var Item = require('../models/itemModel.js');
var Sequelize = require('sequelize');
var db = require('../db');

var Request = db.define('request', {
  borrow_message: Sequelize.String,
  durationDays: Sequelize.Integer,
  approved: Sequelize.Boolean,
  denied: Sequelize.Boolean,
});

Request.hasOne(User, { as: 'Borrower'});
Request.hasOne(Item, { as: 'Item'});

//Create a model using the schema
module.exports = Request;

