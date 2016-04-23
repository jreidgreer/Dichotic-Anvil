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
    }, // End getFriends method
    loadInventory: function(callback) {
      // We have to manually add requests on despite having access to the method
      this.getInventory()
      .then(function(loadedInventory) {
        var currentItem = 0;
        var addRequests = function() {
          if(loadedInventory[currentItem]) {
            // Initialize as empty array
            console.log('Loading Requests Onto Inventory');
            loadedInventory[currentItem].dataValues.requests = [];
            loadedInventory[currentItem].getRequests()
            .then(function(loadedRequests) {
              loadedInventory[currentItem].dataValues.requests = loadedRequests;
              currentItem++;
              return addRequests();
            })
          } else {
            callback(loadedInventory); 
          }
        }
        addRequests();
      })
      .catch(function(err) {
        console.log('An Error Occurred Loading Inventory: ', err);
      })
    }
  } // End Instance Methods
});


//======================================================

var Item = db.define('item', {
  itemName : Sequelize.STRING,
  borrowed : Sequelize.BOOLEAN,
  itemDescription: Sequelize.STRING,
  picture: Sequelize.STRING
});


//======================================================

var Request = db.define('request', {
  borrow_message: Sequelize.STRING,
  duration: Sequelize.INTEGER,
  approved: Sequelize.BOOLEAN,
  denied: Sequelize.BOOLEAN
});

Request.loadRequestsWithItems = function(query, callback) {
  // We have to manually add items on despite having access to the method
  this.findAll(
  {
    where: query
  })
  .then(function(loadedRequests) {
    var currentRequest = 0;
    var addRequests = function() {
      if(loadedRequests[currentRequest]) {
        // Initialize as empty array
        loadedRequests[currentRequest].dataValues.requests = [];
        Item.findOne({where: {id: loadedRequests[currentRequest].Item}})
        .then(function(loadedItem) {
          loadedRequests[currentRequest].dataValues.item = loadedItem;
          currentRequest++;
          return addRequests();
        })
      } else {
        callback(loadedRequests); 
      }
    }
    addRequests();
  })
  .catch(function(err) {
    console.log('An Error Occurred Loading Inventory: ', err);
  })
}

//======================================================

var Friends = db.define('friends', {
  user1: Sequelize.INTEGER,
  user2: Sequelize.INTEGER
});

//======================================================

var Message = db.define('message', {
  message: Sequelize.TEXT,
  title: Sequelize.STRING
});

Message.loadMessages = function(id, callback) {
  Message.findAll({where: {ToUser: id}})
  .then(function(foundMessages) {
    var currentMessage = 0;
    var addUser = function() {
      if(foundMessages[currentMessage]) {
        // Initialize as empty array
        foundMessages[currentMessage].dataValues.foundUserInfo = {};
        User.findOne({
          where: {id: foundMessages[currentMessage].FromUser},
          attributes: {
            exclude: ['password', 'salt']
          }
        })
        .then(function(loadedUser) {
          foundMessages[currentMessage].dataValues.foundUserInfo = loadedUser;
          currentMessage++;
          return addUser();
        })
      } else {
        callback(foundMessages); 
      }
    }
    addUser();
  })
};

//======================================================

User.hasMany(Item, {as: 'Inventory', foreignKey: 'Owner'});

Item.hasMany(Request, {as: 'Requests', foreignKey: 'Item'});

Request.belongsTo(User, { as: 'Borrower'});

// Messaging 
User.hasMany(Message, {as: 'Messages', foreignKey: 'ToUser'});
User.hasMany(Message, {as: 'sentMessages', foreignKey: 'FromUser'});
Message.belongsTo(User, {foreignKey: 'FromUser'});
Message.belongsTo(User, {foreignKey: 'ToUser'});

db.sync({force: true});

module.exports = {
  db: db,
  Item: Item,
  User: User,
  Request: Request,
  Friends: Friends,
  Message: Message
};