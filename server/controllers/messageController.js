var User = require('../db.js').User;
var Message = require('../db.js').Message;
var Friends = require('../db.js').Friends;

var Sequelize = require('sequelize');

exports.createMessage = function(req, res) {
  var newMessage = req.body;

  if (!newMessage.message) {
    res.status(400).send('Error: Message is required.');
  }

  if (!newMessage.ToUser) {
    res.status(400).send('Error: To User is required.');
  }

  if (!req.currentUser.id) {
    res.status(400).send('Error: From User Not Found is required.');
  }

  var createdMessage = Message.build({
    message: newMessage.message,
    title: newMessage.title
  });

  createdMessage.ToUser = newMessage.ToUser;
  createdMessage.FromUser = req.currentUser.id;

  createdMessage.save()
  .then(function(createdMessage) {
    res.send(createdMessage);
  })
  .catch(function(err) {
    console.log('Error Creating Message: ', err);
    res.status(500).send(err);
  });
};

exports.loadMessages = function(req, res) {
  Message.loadMessages(req.currentUser.id, function(foundMessages) {
    res.send(foundMessages);
  })
};

exports.loadSentMessages = function(req, res) {
  Message.findAll({where: {FromUser: req.currentUser.id}})
  .then(function(foundMessages) {
    res.send(foundMessages);
  })
  .catch(function(err) {
    console.log('An Error Occured Retrieving Messages: ', err);
    res.status(500).send(err);
  })
};

exports.deleteMessage = function(req, res) {
  // TODO: Load To Messages
};