var userController = require('../controllers/userController.js');
var itemController = require('../controllers/itemController.js');


// paths that we skip the auth middleware
var middlewareIgnorePaths = [
  "/api/users/signup",
  "/api/users/login"
];

module.exports = function (app, express, passport) {

  //FACEBOOK ROUTES
  //============================================
  app.get('/#/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
    // successRedirect: '/#/dashboard',
    // failureRedirect: '/#/login'
  }));
  app.get('/#/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/#/dashboard',
    failureRedirect: '/#/login'
  }),
    function(req, res) {
      var tempPassportSession = req.session.passport;
      req.session.regenerate(function() {
        req.session.passport = tempPassportSession;
        res.redirect('/#/dashboard');
      });
    });

  // MIDDLEWARE
  //  all requests (except for signup/login) pass through this middleware function, if they do not pass, we cancel the request/response
  //============================================
  app.use(function(req, res, next){

      // if we should ignore the current request
      if(middlewareIgnorePaths.indexOf(req.path) !== -1) {
        next();
        return;
      }

      // do the auth check
      userController.authCheck(req, res, function(passedAuthentication)
      {

        // did not pass the auth check, stop the request/response
        if(!passedAuthentication) {
          userController.sendError(res, 'Unauthenticated');
          return;
        }

        // continue the request/response
        next();
      });

  });


  // USERS
  //============================================
  app.get('/api/user/:user_id', userController.getUser);
  app.get('/api/users', userController.retrieveAll);
  app.put('/api/users/:user_id', userController.updateOne);

  // TO ADD A FRIEND
  app.post('/api/user/me/friends', userController.addFriend);

  app.post('/api/users/signup', userController.createOne);
  app.post('/api/users/login', userController.verifyLogin);

  // ITEMS
  //============================================
  app.get('/api/items', itemController.retrieveAll);
  app.post('/api/items', itemController.createOne);

  // TO BORROW AN ITEM
  app.post('/api/items/:item_id/borrow', itemController.borrow);

   // REQUESTS
  //============================================
  app.put('/api/requests/:request_id', itemController.updateRequest);


  app.get('/api/items/:item_id', itemController.retrieveOne);
  app.put('/api/items/:item_id', itemController.updateOne);
  app.delete('/api/items/:item_id', itemController.deleteOne);

};
