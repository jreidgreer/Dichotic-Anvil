var Sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');

var db = new Sequelize('borrow', null, null, {
  dialect: 'postgres'
});

var User = db.define('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  userName: { type: Sequelize.STRING, required: true, unique: true },
  password: { type: Sequelize.STRING, required: true },
  salt: Sequelize.STRING,
  picture: Sequelize.STRING
    },
  { // Begin Options
  hooks: {
    beforeCreate: function(user) {
      user.salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.password, user.salt);
    }
  }, // End Hooks
  instanceMethods: {
    comparePasswords: function(inputPassword, callback) {
      callback(bcrypt.compareSync(inputPassword, this.password));
    }
  } // End Instance Methods
});


//======================================================

var Item = db.define('item', {
  itemName : Sequelize.STRING,
  borrowed : Sequelize.BOOLEAN,
  itemDescription: Sequelize.STRING,
  picture: Sequelize.STRING,
});


//======================================================

var Request = db.define('request', {
  borrow_message: Sequelize.STRING,
  durationDays: Sequelize.INTEGER,
  approved: Sequelize.BOOLEAN,
  denied: Sequelize.BOOLEAN,
});

User.hasMany(Item, {as: 'Inventory'});
User.belongsToMany(User, {as: 'Friends', through: 'UserFriends'});
Item.belongsToMany(Request, {as: 'Requests', through: 'ItemRequests'});
Item.belongsTo(User, {as: 'Owner'});
Request.belongsTo(User, { as: 'Borrower'});
Request.hasOne(Item, { as: 'Item'});

db.sync({force: true});

module.exports = {
  db: db,
  Item: Item,
  User: User,
  Request: Request
};