const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },           // use "name" since your register form sends { name, email, password }
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
