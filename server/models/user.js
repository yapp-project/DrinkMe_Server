var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 유저 정보 스키마 정의
var userSchema = new Schema({
    id: {
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

// Find ALL
userSchema.statics.findAll = function() {

    return this.find({});
};

// Find ID
userSchema.statics.findUser = function(userid) {

    const count = new this.count({id: userid}, {limit: 1});
    return count;
};

// Find User
userSchema.statics.findUserForSignin = function(userid,userpw) {

    return this.find({id: userid},{password: userpw});
};

// Find One by id
userSchema.statics.findOneByUserid = function(userid) {

    return this.findOne({id: userid});
};

// Update by id
userSchema.statics.updateByUserid = function(userid, payload) {

    return this.findOneAndUpdate({ userid }, payload, { new: true });
};

// Delete by id
userSchema.statics.deleteByUserid = function(userid){

    return this.remove({id:userid});
};

// Create model & export
module.exports = mongoose.model('User', userSchema);


