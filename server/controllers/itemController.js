
//require Item model
var Item = require('../models/itemModel.js');
var Request = require('../models/requestModel.js');

// CRUD ACTIONS
//============================================

// Use this to dish out an error to the client
exports.sendError =  function(res, errorString){

  error = {
    success: false,
  };
  if(errorString)
    error['error'] = errorString;

  res.status(403).json(error);
};

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

// NEEDS MIDDELWARE
exports.borrow = function(req, res) {

  var item_id = req.params.item_id;

  // validate duration
  var borrow_message = req.body.message || '';
  var duration_days = parseInt(req.body.duration);
  if(isNaN(duration_days) || duration_days < 1 || duration_days > 7)
  {
    exports.sendError(res, 'Invalid duration');
    return;
  }


  // pull item from database
  Item.findOne({_id: item_id}, function(err, item) {
      if(!item)
      {
        exports.sendError(res, 'Item does not exist');
        return;
      }

      // make sure item is not already borrowed
      if(item.borrowed)
      {
        exports.sendError(res, 'Item is already borrowed');
        return;
      }

      // create new request object
      var newRequest = new Request();
      newRequest.borrow_message = borrow_message;
      newRequest.duration = duration_days;
      newRequest.borrower = req.currentUser._id;
      newRequest.item = item._id;

      newRequest.save(function(err){

        if(err){
          exports.sendError(res, 'Error creating new borrow request');
          return;
        }

        res.json(newRequest);

      });

  });

}

// NEEDS MIDDELWARE
exports.updateRequest = function(req, res) {


  var request_id = req.params.request_id;
  var action = req.body.action || '';

  if(action !== 'approve' && action !== 'deny')
  {
    exports.sendError(res, 'Invalid action');
    return;
  }

  // pull request from database
  Request.findOne({_id: request_id}, function(err, request) {
      if(!request)
      {
        exports.sendError(res, 'Request does not exist');
        return;
      }

      // make sure request is not already approved or denied
      if(request.denied || request.approved)
      {
        exports.sendError(res, 'Request is already approved or denied');
        return;
      }

      // make sure item isnt already borrowed
      if(request.item.borrowed)
      {
        exports.sendError(res, 'Item is already borrowed');
        return;
      }

      // check if the items creator is the current logged in user
      if(request.item.owner.toString() !== req.currentUser._id.toString())
      {
        exports.sendError(res, 'You did not list this item');
        return;
      }

      // finalize the request, set approved or denied, and set borrowed to true if approved=true
      request.approved = (action === 'approve');
      request.denied = !request.approved;

      request.save(function (err) {
      if (err){
        exports.sendError(res, 'Request update error');
        return;
      } else {


        // set the borrowed state on the item
        exports.setItemBorrowed(request.item._id, request.approved);

        res.json({ success: true, message: 'Item successfully updated'});
      }
    });

  }).populate('item');
}

exports.setItemBorrowed = function(item_id, borrowed)
{
  // pull request from database
  Item.findOne({_id: item_id}, function(err, item) {

    item.borrowed = borrowed;
    item.save(function(err){

    });

  });
}