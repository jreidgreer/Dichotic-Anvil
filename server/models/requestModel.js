var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");

var requestSchema = new Schema({
  item : {type: Schema.ObjectId, ref:'Item', childPath: 'requests'},
  borrower: {type: Schema.ObjectId, ref:'User'}, //req.currentUser
  borrow_message: String,
  durationDays: Number,
  approved: Boolean,
  denied: Boolean,
  createdAt: {type: Date, default: Date.now}
});

requestSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

requestSchema.plugin(relationship, {relationshipPathName: 'item'});

//Create a model using the schema
var Request = mongoose.model('Request', requestSchema);
module.exports = Request;

