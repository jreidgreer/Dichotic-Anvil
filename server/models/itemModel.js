var User = require('./userModel.js');
var Request = require('./requestModel.js');
var Sequelize = require('sequelize');
var db = require('../db');

var Item = db.define('item', {
  itemName : Sequelize.STRING,
  borrowed : Sequelize.BOOLEAN,
  itemDescription: Sequelize.STRING,
  picture: Sequelize.STRING,
});

Item.belongsToMany(db.Request, {as: 'Requests'});
Item.belongsTo(db.User, {as: 'Owner'});

module.exports = Item;

