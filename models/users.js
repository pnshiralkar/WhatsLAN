const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema_users = new Schema({
  ip: String,
  name: String
});

module.exports = mongoose.model('users', schema_users);
