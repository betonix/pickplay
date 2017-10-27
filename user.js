var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

  oauthID: Number,
  name: String,
  created: Date,
  socket : String

});


module.exports = mongoose.model('User', userSchema);