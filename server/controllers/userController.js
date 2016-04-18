
//require user model and jwt
var User = require('../models/userModel.js');
var jwt = require('jwt-simple'); // used to create, sign, and verify tokens


// CRUD ACTIONS
//============================================


// only these fields get output'd to the client from the user model
exports.userWhiteList = [
  "_id",
  "userName",
  "firstName",
  "lastName",
  "inventory",
  "friends"
];

// our user object cleaner function
exports.filterUser = function(user_object, current_user) {
  var response_object = {};

  // process the whitelist
  for(var k in user_object) {
    if(exports.userWhiteList.indexOf(k) > -1) {
      response_object[k] = user_object[k];
    } 
  }

  // process the inventory and make sure we only show requests if the user object is the current user
  if(user_object._id.toString() !== current_user._id.toString())
  {
      for(var i = 0; i < response_object.inventory.length; i++)
      {
        //console.log(delete response_object.inventory[i]['requests']);

      }
  }

  return response_object;
};

// Use this to dish out an error to the client
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
  User.create(newUser, function(err, user) {
    if(err) {

      console.log(err);

      // user probably already exists, refuse request
      exports.sendError(res, 'Username already exists');

      return;
    }

    // create new session
    exports.createNewSessionForUser(user, res);
  });
};

// DOES NOT NEED MIDDLEWARE
exports.verifyLogin = function(req, res) {

  var userName = req.body.userName;
  var password = req.body.password;

  console.log('USERNAME======', userName);
  console.log('PASSWORD======', password);

  User.findOne({userName: userName}, function(err, user) {
    if(!user) {
      // no user with that username in database
      exports.sendError(res, 'Invalid username or password');

    } else {

      // compare the bcrypt passwords
      user.comparePasswords(password, function(err, compareResult){

        if (err) {
          // unknown bcrypt compare error
          console.error('Error with password comparison', err);
        }

        if(compareResult) {

            // create new session
            exports.createNewSessionForUser(user, res);
        } else {

          exports.sendError(res, 'Invalid username or password');
        }

      });
    }
  });
};


// creates a new jwt-session for a newly created or newly logged in user
exports.createNewSessionForUser = function (user, res) {

  var session_vars = {
      userName: user.userName,
      created: Date.now(),
  };

  var session_secret = 'shhhhh';

  // encrypt the session with ONLY our session vars so that we don't over-encrypt (all subdocuments and un-necessary fields)
  var token = jwt.encode(session_vars, session_secret);
          
  console.log('Creating new session for user: [' + user.userName + '] --> token: [' + token + ']');

  // dish out response that we made the session
  res.status(201).json({
    token: token,
    success: true
  });
};

// REQUIRES MIDDLEWARE
exports.getUser = function(req, res) {

  var userId = req.params.user_id;
  if(userId === 'me') {
    // map to the current userId
    userId = req.currentUser._id;
  }

  User.findOne({_id: userId})
  .populate(['inventory',
   'friends',
   {
    path: 'inventory',
    // Get friends of friends - populate the 'friends' array for every friend
    populate: { path: 'requests' }
  }])
  .exec(function(err, foundUser) {
        if (foundUser){
          
          // clean up friends with filter
          for(var i = 0; i < foundUser.friends.length; i++)
          {
            foundUser.friends[i] = exports.filterUser(foundUser.friends[i], req.currentUser);

            // remove friends of friends so it doesn't become a recursive mess
            delete foundUser.friends[i].friends;
          }

          res.json(exports.filterUser(foundUser, req.currentUser));

        } else {
            exports.sendError(res, 'No user found with that ID');
        }
    })

};


// OUR "IS LOGGED IN?" MIDDLEWARE FUNCTION
exports.authCheck = function (req, res, cb) {
  var token = req.headers['x-access-token'];
  if (!token) {

    cb(false);

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
      cb(false);
      return;
    }

    User.findOne({userName: user.userName}, function(err, foundUser) {
        if (foundUser){

            // we have the currently logged in user, set the currentUser variable on the request so that we can use it everywhere
            req.currentUser = foundUser;
            cb(true);

        } else {

            cb(false);
        }
    })
  }
}

// NEEDS MIDDLEWARE
exports.retrieveAll = function(req, res) {
    
    // update to pull all users with inventory 

    User.find()
    .populate('inventory friends')
    .exec(function(err, results) {

        if(!results || results.length < 1)
        {
          exports.sendError(res, 'No users');
          return;
        }

        console.log(results);

        var ret = [];

        // loop over results and filter using white list
        for(var i = 0; i < results.length; i++) {

          // skip me
          if (results[i]._id.toString() === req.currentUser._id.toString()) {
            continue;
          }

          var user = results[i];

            // clean up friends with filter
          for(var j = 0; j < user.friends.length; j++)
          {
            user.friends[j] = exports.filterUser(user.friends[j], req.currentUser);

            // remove friends of friends so it doesn't become a recursive mess
            delete user.friends[j].friends;
          }

          // push onto ret
          ret.push(exports.filterUser(user, req.currentUser));
        }

        res.json(ret);
        
      })

};

// NEEDS MIDDELWARE
exports.addFriend = function(req, res) {

  // get userId they are trying to add, and verify that they exist, and that we aren't already friends with them

  var userId = req.body.userName;

  User.findOne({userName: userId}, function(err, foundUser) {

    if(!foundUser)
    {
      // user does not exist
      exports.sendError(res, 'No user with that ID was found');
      return;
    }

    // check if we are already friends with them
    var already_friends = false;
    for(var i = 0; i < req.currentUser.friends.length; i++)
    {
        if(req.currentUser.friends[i].toString() === foundUser._id.toString())
        {
          already_friends = true;
          break;
        }
    }

    if(already_friends)
    {
      // we're already friends with this person
      exports.sendError(res, 'Already friends with that user');
      return;
    }


    // add them
    User.update({ _id: req.currentUser._id },
      { $push: { friends: foundUser }}, function(err, raw) {

      });

    res.json({success: true, message: 'Added User'});

  });
}
// NEEDS MIDDLEWARE
exports.updateOne = function(req, res) {
  var query = {_id: req.params.user_id};
  var updatedProps = req.body;
  var options = {new: true, upsert: true};
  User.findOneAndUpdate(query, updatedProps, options, function(err, matchingUser){
    if(err){
      return res.json(err);
    }
    res.json(matchingUser);
  });
};

// NEEDS MIDDLEWARE
exports.deleteOne = function(req, res) {
  var query = {_id: req.params.user_id};
  User.findOneAndRemove(query, function(err, matchingUser){
    if(err){
      return res.json(err);
    }
    res.json(matchingUser);
  });
};
