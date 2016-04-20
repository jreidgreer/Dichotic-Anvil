var User = require('./userModel.js');
var Item = require('./itemModel.js');
var Sequelize = require('sequelize');
var db = require('../db');

var Request = db.define('request', {
  borrow_message: Sequelize.STRING,
  durationDays: Sequelize.INTEGER,
  approved: Sequelize.BOOLEAN,
  denied: Sequelize.BOOLEAN,
});

// Request.hasOne(User, { as: 'Borrower'});
// Request.hasOne(Item, { as: 'Item'});

//Create a model using the schema
module.exports = Request;

