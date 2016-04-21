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
    },
    getFriends: function(currentUserId, callback) {
      Friends.findAll({
        where: {
          $or: [{user1: currentUserId}, {user2: currentUserId}]
        }
      })
      .then(function(friendPairIds) {
        var friendIds = [];
        for(var i =0; i < friendPairIds.length; i++) {
          // Get the non-current user id
          friendIds.push(friendPairIds[i].dataValues.user1 === currentUserId ? friendPairIds[i].dataValues.user2 : friendPairIds[i].dataValues.user1);
        }
        User.findAll({
          attributes: {
            exclude: ['password', 'salt']
          },
          where: {id: friendIds}
        })
        .then(function(foundFriends) {
          callback(foundFriends);
        })
        .catch(function(err) {
          console.log('An Error Occured Finding Friends via getFriends model: ', err);
        });
      });
    } // End getFriends method
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

//======================================================

var Friends = db.define('friends', {
  user1: Sequelize.INTEGER,
  user2: Sequelize.INTEGER
});

User.hasMany(Item, {as: 'Inventory', foreignKey: 'Owner'});
// User.hasMany(User, {as: 'Friends'});
// User.belongsToMany(User, {as: 'Friends', through: 'UserFriends'});

// Item.belongsToMany(Request, {as: 'Requests', through: 'ItemRequests'});
// Item.belongsTo(User, {as: 'Owner', });

Request.belongsTo(User, { as: 'Borrower'});
Request.hasOne(Item, { as: 'Item'});

db.sync({force: true});

module.exports = {
  db: db,
  Item: Item,
  User: User,
  Request: Request,
  Friends: Friends
};