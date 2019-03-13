
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    user_id: String,
    user_name: String,
    user_pw: String,
    signin_date: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('user', userSchema);
