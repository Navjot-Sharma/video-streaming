const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 3, maxlength: 50},
  email: {type: String, unique: true, required: true, minlength: 5, maxlength: 50},
  password: {type: String, required: true, minlength: 5, maxlength: 100},
  authId: {type: Number, default: 0, minlength: 1, maxlength: 2}
});

mongoose.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
