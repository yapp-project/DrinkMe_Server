var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 유저 정보 스키마 정의
var userSchema = new Schema({
    userid: {
        type: String,
        required: true,
        index: true,
        match:/^[가-힣|a-z|A-Z|0-9|_|@]+$/,
        unique: true,
        minlength:1,
        maxlength:20
    },
    password: {
        type: String,
        match:/^[a-z|A-Z|0-9|_|@]+$/,
        minlength:8,
        maxlength:30
        },
    create_date : {  type: Date, default: Date.now()  }
}, { versionKey: false });



// Create new user Document
userSchema.statics.create = function(payload) {
    //this = model
    const user = new this(payload);
    //return promise
    return user.save();
};

// Delete
userSchema.statics.deleteByUserid = function (userid) {
    return this.remove({ userid });
};


// Create model & export
module.exports = mongoose.model('User', userSchema);


