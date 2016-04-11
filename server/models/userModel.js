var mongoose = require('mongoose');
var Item = require('../models/itemModel');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: {

    _id: Number,
    type: String,
    required: true,
    unique: true
},
  inventory: {
    type: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    default: []
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function (next) {
var err = new Error('something went wrong');
  next(err);
});

module.exports = mongoose.model('User', userSchema);
