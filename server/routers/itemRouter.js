var itemRouter = require('express').Router();
var itemController = require('../controllers/itemController.js');

itemRouter.route('/') // to all items (/api/items/)
  .get(itemController.retrieveAll)
  .post(itemController.createOne);


itemRouter.route('/:item_id') // to one specific user (/api/items/:item_id)
  .get(itemController.retrieveOne)
  .put(itemController.updateOne)
  .delete(itemController.deleteOne);

 module.exports = itemRouter;