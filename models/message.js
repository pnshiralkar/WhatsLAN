var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = new Schema({
  from: String,
  to: String,
  msg: String,
  time: String
});

module.exports = mongoose.model('messages', schema);
