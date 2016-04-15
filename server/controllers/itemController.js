
//require Item model
var Item = require('../models/itemModel.js');

// CRUD ACTIONS
//============================================

// NEEDS MIDDLEWARE
exports.createOne = function(req, res) {
  var newItem = new Item(req.body);
  
  // set the owner to the current users _id

  console.log(req.currentUser);

  newItem.owner = req.currentUser._id;

  newItem.save(function(err) {
    if(err){
      return res.json(err);
    }
    res.json(newItem);
  });
};

// NEEDS MIDDLEWARE
exports.retrieveOne = function(req, res) {
  //have to look in req.params to check for the id. Set the _id to to the value in req.params.id
  var query = {_id: req.params.item_id};
  Item.findById(query, function(err, matchingItem){
    if(err){
      return res.send(err);
    }
    res.json(matchingItem);
  });
};

// NEEDS MIDDLEWARE
exports.retrieveAll = function(req, res) {
  Item.find(function(err, allItems){
    if(err){
      return res.send(err);
    }
    res.json(allItems);
  });
};

// NEEDS MIDDLEWARE
exports.updateOne = function(req, res) {
  var query = {_id: req.params.item_id};
  Item.findById(query, function(err, matchingItem){
    if(err) {
      return res.send(err);
    } else {
    // Update the item
    item = req.body;
     // Save the item with its new name
    item.save(function (err) {
          // As always, We check for errors
      if (err) {
        res.send(err); // Send any errors
      } else {
        res.json({ message: 'Item updated!'});
      }
    });
   }
  });
};

// NEEDS MIDDLEWARE
exports.deleteOne = function(req, res) {
  var query = {_id: req.params.item_id};
  Item.findOneByIdAndRemove(query, function(err, matchingItem){
    if(err){
      return res.send(err);
    }
    res.json(matchingItem);
  });
};
