var mongoose = require('mongoose');
var Schema = mongoose.schema;

var userSchema = new Schema({
  userName: {

    _id: Number,
    type: String,
    required: true,
    unique: true
},
  inventory: {
    type: [{type: Schema.Types.ObjectId, ref: 'Item'}],
    default: [],
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)