const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
