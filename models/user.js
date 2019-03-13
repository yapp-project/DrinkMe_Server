const mongoose = require('mongoose');

// Define Schemes
const userSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  userpw: { type: String, required: true },
  username: { type: String, default: false }
},
{
  timestamps: true
});


const User = mongoose.model('User', userSchema);

// Create Model & Export
module.exports = mongoose.model('User', userSchema);

