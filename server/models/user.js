var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 유저 정보 스키마 정의
var userSchema = new Schema({
    userid: {
        type: String,
        required: true,
        index: true,
        match:/([A-Z]|[a-z]|[가-힣]|[0-9])\w+/,
        unique: true },
    password: {
        type: String,
        valid: [
            function(password){
                return password.length>=8;
            },
            'Password should be longer'
        ]},
    create_date : {  type: Date, default: Date.now()  }
}, { versionKey: false });



// Create new user Document
userSchema.statics.create = function(payload) {
    //this = model
    const user = new this(payload);
    //return promise
    return user.save();
};


// Create model & export
module.exports = mongoose.model('User', userSchema);


