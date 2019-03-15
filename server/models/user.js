var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userid: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    userpw:  { type: String, required: true }
});

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

// Find One by id
userSchema.statics.findOneByUserid = function( userid ) {

    return this.findOne({ userid });
};

// Update by id
userSchema.statics.updateByUserid = function(userid, payload) {

    return this.findOneAndUpdate({ userid }, payload, { new: true });
};

// Delete by id
userSchema.statics.deleteByUserid = function(userid) {

    return this.remove({ userid });
};

// Create model & export
module.exports = mongoose.model('User', userSchema);


