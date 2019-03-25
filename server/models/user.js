var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 유저 정보 스키마 정의
var userSchema = new Schema({
    userid: {
        type: String,
        required: true,
        index: true,
        match:/([A-Z]|[a-z]|[가-힣]|[0-9])\w+/,
        unique: true
        //minlength:, maxlength:
    },
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

// Find All
userSchema.statics.findAll = function () {
    // return promise
    // V4부터 exec() 필요없음
    return this.find({});
};

// Find One by userID
userSchema.statics.findOneByUserid = function (userid) {
    return this.findOne({ userid });
};

// id Check
userSchema.statics.checkId = function (userid) {

    const countQuery = this.where({ userid }).countDocuments();
    console.log(countQuery);
    return countQuery;
};

// id Check
userSchema.statics.checkAuth = function (userid) {
    return this.countDocuments({ userid });
};

// Update by todoid
userSchema.statics.updateByUserid = function (userid, payload) {
    // { new: true }: return the modified document rather than the original. defaults to false
    return this.findOneAndUpdate({ userid }, payload, { new: true, useFindAndModify:false });
};

// Delete by todoid
userSchema.statics.deleteByUserid = function (userid) {
    return this.remove({ userid });
};


// Create model & export
module.exports = mongoose.model('User', userSchema);


