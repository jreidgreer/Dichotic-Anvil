var userController = require('../controllers/userController.js');
var itemController = require('../controllers/itemController.js');


// paths that we skip the auth middleware
var middlewareIgnorePaths = [
  "/api/users/signup",
  "/api/users/login"
];

module.exports = function (app, express) {


  // MIDDLEWARE
  //  all requests (except for signup/login) pass through this middleware function, if they do not pass, we cancel the request/response
  //============================================
  app.use(function(req, res, next){

      // if we should ignore the current request
      if(middlewareIgnorePaths.indexOf(req.path) > -1) {
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

  app.post('/api/users/signup', userController.createOne);
  app.post('/api/users/login', userController.verifyLogin);

  // ITEMS
  //============================================
  app.get('/api/items', itemController.retrieveAll);
  app.post('/api/items', itemController.createOne);
  app.get('/api/items/:item_id', itemController.retrieveOne);
  app.put('/api/items/:item_id', itemController.updateOne);
  app.delete('/api/items/:item_id', itemController.deleteOne);

};