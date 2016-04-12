var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  _item : {type: Number, ref : 'User' },
  itemName : String,
  borrowed : Boolean,
  imageUrl: String
})

//Create a model using the schema
var Item = mongoose.model('Item', itemSchema);
module.exports = Item;
