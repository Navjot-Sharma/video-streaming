const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 3, maxlength: 50},
  email: {type: String, required: true, minlength: 5, maxlength: 50},
  password: {type: String, required: true, minlength: 5, maxlength: 100},
  authId: {type: Number, default: 0, minlength: 1, maxlength: 2}
});


module.exports = mongoose.model('User', userSchema);
