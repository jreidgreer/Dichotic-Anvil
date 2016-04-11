
//require Item model
var Item = require('../models/itemModel.js');

// CRUD ACTIONS
//============================================

exports.createOne = function(req, res) {
  var newItem = req.body;
  Item.create(newItem, function(err, newItem) {
    if(err){
      return res.json(err);
    }
    res.json(newItem);
  });
};

exports.retrieveOne = function(req, res) {
  //have to look in req.params to check for the id. Set the _id to to the value in req.params.id
  var query = {_id: req.params.item_id};
  Item.findOne(query, function(err, matchingItem){
    if(err){
      return res.json(err);
    } 
    res.json(matchingItem);  
  });
};

exports.retrieveAll = function(req, res) {
  var query = req.query;
  Item.find(query, function(err, allItems){
    if(err){
      return res.json(err);
    } 
    res.json(allItems);
  });
};

exports.updateOne = function(req, res) {
  var query = {_id: req.params.item_id};
  var updatedProp = req.body;
  var options = {new: true, upsert: true};
  Item.findOneAndUpdate(query, updatedProps, options, function(err, matchingItem){
    if(err){
      return res.json(err);
    } 
    res.json(matchingItem);
  });
};

exports.deleteOne = function(req, res) {
  var query = {_id: req.params.item_id};
  Item.findOneAndRemove(query, function(err, matchingItem){
    if(err){
      return res.json(err);
    } 
    res.json(matchingItem);
  });
};
