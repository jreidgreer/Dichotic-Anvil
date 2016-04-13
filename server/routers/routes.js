var userController = require('../controllers/userController.js');
var itemController = require('../controllers/itemController.js');

module.exports = function (app, express) {

  // USERS
  //============================================
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