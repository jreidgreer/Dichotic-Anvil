var mongoose = require('mongoose');
var Item = require('../models/itemModel.js');

var Schema = mongoose.Schema;

var userSchema = new Schema({

  firstName: String,
  lastName: String,
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_At: Date,
  updated_At: Date,
  inventory: {
    type: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    default: []
  },
});

userSchema.pre('save', function (next) {
var err = new Error('Whoops! Something went wrong.');
  next();
});

//Create a model using the schema
var User = mongoose.model('User', userSchema);
module.exports = User;
