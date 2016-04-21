
//require user model and jwt
<<<<<<< HEAD
var User = require('../models/userModel.js');
var facebookUser = require('../models/userModel.js');
var Request = require('../models/requestModel.js');
=======
var User = require('../db.js').User;
var Request = require('../db.js').Request;
var Friends = require('../db.js').Friends;

<<<<<<< a05c7cd707955a3dd8d0257453a16947d518d250
>>>>>>> 3b69d3346df404155cd5d7f9437eb9ad5e87abd9
=======
>>>>>>> Implement Postgres conversion for users, items, and friends
var jwt = require('jwt-simple'); // used to create, sign, and verify tokens
var Sequelize = require('sequelize');



// CRUD ACTIONS
//============================================


// only these fields get sent to the client from the user model
exports.userWhiteList = [
  "_id",
  "userName",
  "firstName",
  "lastName",
  "inventory",
  "friends",
  "borrowing",
  "picture"
];

// our user object cleaner function
exports.filterUser = function(userObject, currentUser) {
  var responseObject = {};

  // process the whitelist
  for(var k in userObject) {
    if(exports.userWhiteList.indexOf(k) !== -1) {
      responseObject[k] = userObject[k];
    }
  }

  // process the inventory and make sure we only show requests if the user object is the current user
  if(userObject.id.toString() !== currentUser.id.toString())
  {
      for(var i = 0; i < responseObject.inventory.length; i++)
      {
        //console.log(delete responseObject.inventory[i]['requests']);

      }
  }

  return responseObject;
};

// Use this to send out an error to the client
exports.sendError =  function(res, errorString){

  error = {
    success: false,
  };
  if(errorString)
    error['error'] = errorString;

  res.status(403).json(error);
};

// DOES NOT NEED MIDDLEWARE
exports.createOne = function(req, res) {
  var newUser = req.body;
  // console.log('Attempting to create new user with: ', req.body);
  User.create(newUser)
  .then(function(user) {
    
    // create new session
    exports.createNewSessionForUser(user, res);
  })
  .catch(Sequelize.ValidationError, function(error) {
    if(error) {

      console.log('Error Caught by User Controller: ', error);

      // user probably already exists, refuse request
      exports.sendError(res, 'Username already exists');

      return;
    }
  })
};

// DOES NOT NEED MIDDLEWARE
exports.verifyLogin = function(req, res) {

  var userName = req.body.userName;
  var password = req.body.password;

<<<<<<< a05c7cd707955a3dd8d0257453a16947d518d250
  if (req.user) {
    facebookUser.findOne({'facebook.id': req.user.id }, function(err, fbUser) {
      if (!fbUser) {
        exports.sendError(res, 'Invalid user');
      } else {
        exports.createNewSessionForUser(fbUser, res);
      }
    });
    return;
  }

  console.log('USERNAME======', userName);
  console.log('PASSWORD======', password);

  User.findOne({userName: userName}, function(err, user) {

=======
>>>>>>> Implement Postgres conversion for users, items, and friends
  User.findOne({where: {userName: userName}})
  .then( function(user) {

    if(!user) {
      // no user with that username in database
      exports.sendError(res, 'Invalid username or password');
    } else {
      // compare the bcrypt passwords
      user.comparePasswords(password, function(compareResult){
        if(compareResult) {
          // create new session
          exports.createNewSessionForUser(user, res);
        } else {
          exports.sendError(res, 'Invalid username or password');
        }
      });
    }
  })
  .catch(function(err) {
    console.log('An Error Occured Logging In: ', err);
  });
};


// creates a new jwt-session for a newly created or newly logged in user
exports.createNewSessionForUser = function (user, res) {
  var session = {
      userName: user.userName,
      created: Date.now(),
  };
  var sessionSecret = 'shhhhh';
  // encrypt the session with ONLY our session vars so that we don't over-encrypt (all subdocuments and un-necessary fields)
  var token = jwt.encode(session, sessionSecret);
  console.log('Creating new session for user:' + user.userName + ' token: ' + token);

  // dish out response that we made the session
  res.status(201).send({
    token: token,
    success: true
  });
};

// REQUIRES MIDDLEWARE
exports.getUser = function(req, res) {

  var userId = req.params.user_id;

  //checks if the param send in the route is 'me' and resets the currentUser id to userId
  if(userId === 'me') {
    // map to the current userId
    userId = req.currentUser.id;
  }

  var isMe = (userId.toString() === req.currentUser.id.toString());
  console.log('userId is: ', userId);
  if(!userId) {
    res.status(500).send('userId undefined.');
    return;
  }
  User.findOne({
    attributes: {
      exclude: ['password', 'salt']
    },
    where: {id: userId}
  })
  .then(function(foundUser) {
        if (foundUser){
          var sentUser = foundUser.dataValues;

          var foundUserFriends = foundUser.getFriends(req.currentUser.id, function(friends) {
            sentUser.friends = friends.map(function(friend) {
              return friend.dataValues;
            });

            foundUser.getInventory()
            .then(function(foundUserInventory){
              sentUser.inventory = foundUserInventory.map(function(item) {
                return item.dataValues;
              });
              if (isMe) { 
                query = {'approved': true, 'BorrowerId': req.currentUser.id};
                Request.findAll({
                  where: query
                  // include: ['Item']
                })
                .then(function(results) {
                  sentUser.borrowing = results;
                  res.json(exports.filterUser(sentUser, req.currentUser));
                })
                .catch(function(err) {
                  console.log('An Error Occured Loading Requests: ', err);
                });
              }
              else {
                //otherwise just dish out the object
                res.json(exports.filterUser(foundUser.dataValues, req.currentUser));
              }
            })
            .catch(function(err) {
              console.log('An Error Occured Loading Inventory: ', err);
            })
          });
        } else {
            exports.sendError(res, 'No user found with that ID');
        }
    })
  .catch(function(err) {
    console.log('Error Finding User', err);
  });

};


// OUR "IS LOGGED IN?" MIDDLEWARE FUNCTION
exports.authCheck = function (req, res, authCallback) {
  var token = req.headers['x-access-token'];
<<<<<<< a05c7cd707955a3dd8d0257453a16947d518d250
  console.log(req.user);
  if (!token && !req.user) {

    callback(false);

  } else if (!req.user) {
=======
>>>>>>> Implement Postgres conversion for users, items, and friends
  if (!token) {
    authCallback(false);
  } else {

    var user = null;
    try {
      user = jwt.decode(token, 'shhhhh');
    }
    catch(err) {
      user = null;
    }

    // bad token
    if(!user) {
      authCallback(false);
      return;
    }

    User.findOne({
      where: {userName: user.userName}
    }).then(function(foundUser) {
        if (foundUser){
            // we have the currently logged in user, set the currentUser variable on the request so that we can use it everywhere
            
            req.currentUser = foundUser.dataValues;

            foundUser.getFriends(req.currentUser.id, function(foundUserFriends) {
              console.log('Friends returned by model: ', foundUserFriends);
              req.currentUser.friends = foundUserFriends.map(function(friend) {
                return friend.dataValues;
              });

              authCallback(true);
            });
        } else {

            authCallback(false);
        }
<<<<<<< a05c7cd707955a3dd8d0257453a16947d518d250
    });
  } else if (req.user) {
    callback(req.user);
    }
=======
    })
>>>>>>> Implement Postgres conversion for users, items, and friends
    .catch(function(err) {
      console.log('Error Finding User During authCheck: ', err);
    });
  }
};

// NEEDS MIDDLEWARE
exports.retrieveAll = function(req, res) {
    User.findAll({
      attributes: {
        exclude: ['password', 'salt']
      }
    })
    .then(function(results) {
        if(!results || results.length < 1){
          exports.sendError(res, 'No users');
          return;
        }

        foundUsers = results.map(function(user) {
          return user.dataValues;
        })

        // loop over results and filter using white list
        for(var i = 0; i < foundUsers.length; i++) {
          // skip me
          if (foundUsers[i].id.toString() === req.currentUser.id.toString()) {
            foundUsers.splice(i, 1);
          }

          // var user = foundUsers[i];
          //   // clean up friends with filter
          // for(var j = 0; j < user.friends.length; j++) {
          //   user.friends[j] = exports.filterUser(user.friends[j], req.currentUser);

          //   // remove friends of friends so it doesn't become a recursive mess
          //   delete user.friends[j].friends;
          // }
          // push onto ret
          // ret.push(exports.filterUser(user, req.currentUser));
        }
        res.json(foundUsers);
      })
    .catch(function(err) {
      console.log('An Error Occured Retrieving All Users: ', err);
      res.status(500).send(err);
    });

};

// NEEDS MIDDELWARE
exports.addFriend = function(req, res) {
  // get userId they are trying to add, and verify that they exist, and that we aren't already friends with them
  var userId = req.body.userName;

  User.findOne({where: {userName: userId}})
    .then(function(foundUser) {
    if(!foundUser){
      // user does not exist
      exports.sendError(res, 'No user with that ID was found');
      return;
    }

    // check if we are already friends with them
    var already_friends = false;
    for(var i = 0; i < req.currentUser.friends.length; i++){
        if(req.currentUser.friends[i].id.toString() === foundUser.id.toString()){
          already_friends = true;
          break;
        }
    }
    if(already_friends){
      // we're already friends with this person
      exports.sendError(res, 'Already friends with that user');
      return;
    }
    // add them
    Friends.create({
      user1: req.currentUser.id,
      user2: foundUser.dataValues.id
    })
    .then(function() {
      res.json({success: true, message: 'Added Friend'});
    })
    .catch(function(err) {
      console.log('An Error Occured Adding Friend: ', err);
      res.status(500).send(err);
    })
  })
  .catch(function(err) {
    console.log('An Error Occured Finding User in addFriend: ', err);
  })
}
// NEEDS MIDDLEWARE
exports.updateOne = function(req, res) {
  var query = {id: req.params.userid};
  var updatedProps = req.body;
  User.update(updatedProps, {where: query})
  .then(function(matchingUser){
    res.json(matchingUser);
  })
  .catch(function(err) {
    console.log('An Error Occured Updating User: ', err);
    res.status(500).send(err);
  })
};

// NEEDS MIDDLEWARE
exports.deleteOne = function(req, res) {
  var query = {id: req.params.user_id};
  User.destroy({where: query})
  .catch(function(err) {
    console.log('An Error Occured Deleting Users: ', err);
    res.status(500).send(err);
  });
};
