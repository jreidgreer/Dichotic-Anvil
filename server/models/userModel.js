var mongoose = require('mongoose');
var Item = require('../models/itemModel');

var Schema = mongoose.Schema;

var userSchema = new Schema({

  firstName: String,
  lastName: String,
  userName: { _id: Number, type: String, required: true, unique: true },
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
  next(err);
});

module.exports = mongoose.model('User', userSchema);
