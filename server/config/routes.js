var userController = require('../controllers/userController.js');
var itemController = require('../controllers/itemController.js');

// paths that we skip the auth middleware
var middlewareIgnorePaths = [
  '/api/users/signup',
  '/api/users/login',
  '/auth/facebook',
  '/auth/facebook/callback'
];

module.exports = function (app, express, passport) {

  //isAuth
  var isAuth = function(req, res, next) {
    req.isAuthenticated() ? next() : res.status(403).send('Error: Not Authorized.');
  };

  //FACEBOOK ROUTES
  //============================================

  //API endpoints for signIn, signUp, and checkAuth
  app.get('/api/users/signedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : false);
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
      successRedirect: '/#/dashboard',
      failureRedirect: '/#/'
  }));

  app.get('/logout', function(req, res) {
    console.log('logged out');
    req.session.destroy(function(err) {
      res.redirect('/');
    });
  });

  // MIDDLEWARE
  //  all requests (except for signup/login) pass through this middleware function, if they do not pass, we cancel the request/response
  //============================================
  app.use(function(req, res, next){
    console.log('Request ' + req.method + ' to ' + req.url);
      // if we should ignore the current request
      if(middlewareIgnorePaths.indexOf(req.path) !== -1) {
        next();
        return;
      }

      // do the auth check
      userController.authCheck(req, res, function(passedAuthentication){

        // did not pass the auth check, stop the request/response
        if(!passedAuthentication) {
          console.log('Authentication Failed - NON-PASSPORT VERSION BACK-END');
          userController.sendError(res, 'Unauthenticated');
          return;
        }

        // continue the request/response
        next();
      });

  });
  
  var logger = function(req, res, next) {
    // Loggin Middleware for Testing
    console.log('Request ' + req.method + ' to ' + req.url);
    next();
  };

  // USERS
  //============================================
  app.get('/api/user/:user_id', logger, userController.getUser);
  app.get('/api/users', logger, userController.retrieveAll);
  app.put('/api/users/:user_id', logger, userController.updateOne);

  // TO ADD A FRIEND
  app.post('/api/user/me/friends', logger, userController.addFriend);

  app.post('/api/users/signup', logger, userController.createOne);
  app.post('/api/users/login', logger, userController.verifyLogin);

  // ITEMS
  //============================================
  app.get('/api/items', logger, itemController.retrieveAll);
  app.post('/api/items', logger, itemController.createOne);

  // TO BORROW AN ITEM
  app.post('/api/items/:item_id/borrow', logger, itemController.borrow);

   // REQUESTS
  //============================================
  app.put('/api/requests/:request_id', logger, itemController.updateRequest);


  app.get('/api/items/:item_id', logger, itemController.retrieveOne);
  app.put('/api/items/:item_id', logger, itemController.updateOne);
  app.delete('/api/items/:item_id', logger, itemController.deleteOne);

};
