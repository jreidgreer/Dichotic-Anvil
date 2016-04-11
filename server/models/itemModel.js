var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  _item : {type: Number, ref : 'User' },
  itemName : String,
  borrowed : Boolean,
  imageUrl: String
})

module.exports = mongoose.model('Item', itemSchema)
