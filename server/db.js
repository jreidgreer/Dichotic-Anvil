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