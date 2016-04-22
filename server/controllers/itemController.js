
//require Item model
var Item = require('../db.js').Item;
var Request = require('../db.js').Request;

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
  
  // set the owner to the current users _id
  // console.log('Current User: ', req.currentUser);
  // console.log('Request Body: ', req.body);

  var newItem = Item.build(req.body);
  newItem.Owner = req.currentUser.id;
  newItem.save()
  .then(function(item) {
    res.json(item.dataValues);
  })
  .catch(function(err) {
    console.log('Error Occurred Creating Item: ', err);
  });
};

// NEEDS MIDDLEWARE
exports.retrieveOne = function(req, res) {
  //have to look in req.params to check for the id. Set the _id to to the value in req.params.id
  var query = {id: req.params.item_id};
  Item.findOne({where: query})
  .then(function(matchingItem){
    res.json(matchingItem.dataValues);
  })
  .catch(function(err) {
    console.log('Error Occurred During Retrieval: ', err);
    return res.status(500).send(err);
  });
};

// NEEDS MIDDLEWARE
exports.retrieveAll = function(req, res) {
  Item.findAll()
  .then(function(allItems){
    var sanitizedResults = [];
    
    allItems.map(function(item) {
      sanitizedResults.push(item.dataValues);
    });

    res.json(sanitizedResults);
  })
  .catch(function(err) {
    return res.status(500).send(err);
  })
};

// NEEDS MIDDLEWARE
exports.updateOne = function(req, res) {
  var query = {id: req.params.item_id};
  Item.update(req.body, query)
  .then(function(item){
    res.send(item.dataValues);
  })
  .catch(function(err) {
    console.log('Error Occurred Updating: ', err);
    res.status(500).send(err);
  });
};

// NEEDS MIDDLEWARE
exports.deleteOne = function(req, res) {
  var query = {_id: req.params.item_id};
  Item.destroy(query)
  .then(function(deleted) {
    res.send(deleted.dataValues);
  })
  .catch(function(err) {
    console.log('Error Occurred During Deletion: ', err);
    res.status(500).send(err);
  });
};

// NEEDS MIDDELWARE
exports.borrow = function(req, res) {

  var item_id = req.params.item_id;

  // validate duration
  var borrowMessage = req.body.message || '';
  var durationDays = parseInt(req.body.duration);
  if(isNaN(durationDays) || durationDays < 1 || durationDays > 7) {
    exports.sendError(res, 'Invalid duration');
    return;
  }
  // pull item from database
  Item.findOne({where: {id: item_id}})
    .then(function(item) {
      if(!item){
        exports.sendError(res, 'Item does not exist');
        return;
      }
      // make sure item is not already borrowed
      if(item.borrowed){
        exports.sendError(res, 'Item is already borrowed');
        return;
      }
      // create new request object
      Request.create({
        borrowMessage: borrowMessage,
        duration: durationDays,
        borrower: req.currentUser.id,
        item: item.dataValues.id
      })
      .then(function(newRequest) {
        res.send(newRequest);
      })
      .catch(function(err) {
        console.log('An Error Occurred During Request Creation', err);
      });
  });
}

// NEEDS MIDDELWARE
exports.updateRequest = function(req, res) {
  var request_id = req.params.request_id;
  var action = req.body.action || '';

  if(action !== 'approve' && action !== 'deny') {
    exports.sendError(res, 'Invalid action');
    return;
  }

  // pull request from database
  Request.findOne({
    where: {id: request_id},
    include: ['Item']
  })
  .then(function(request) {
      if(!request) {
        exports.sendError(res, 'Request does not exist');
        return;
      }
      // make sure request is not already approved or denied
      if(request.denied || request.approved) {
        exports.sendError(res, 'Request is already approved or denied');
        return;
      }
      // make sure item isnt already borrowed
      if(request.item.borrowed) {
        exports.sendError(res, 'Item is already borrowed');
        return;
      }
      // check if the items creator is the current logged in user
      if(request.item.owner.toString() !== req.currentUser.id.toString()) {
        exports.sendError(res, 'You did not list this item');
        return;
      }
      // finalize the request, set approved or denied, and set borrowed to true if approved=true
      request.approved = (action === 'approve');
      request.denied = !request.approved;

      request.save()
      .then(function (err) {
      // set the borrowed state on the item
      exports.setItemBorrowed(request.item.id, request.approved);
      res.json({ success: true, message: 'Item successfully updated'});
      })
      .catch(function(err) {
        console.log('An Error Occurred Resaving Request: ', err);
      })

  });
}

exports.setItemBorrowed = function(item_id, borrowed){
  // pull request from database
  Item.update({borrowed: borrowed}, {where: {id: item_id}})
  .then(function(item) {
    res.send(item.dataValues);
  })
  .catch(function(err) {
    console.log('An Error Occured Setting Borrowed Property: ', err);
    res.status(500).send(err);
  });
}