var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scrapSchema = new Schema({
    userid : { type : String  },
    recipeid : { type : String }
}, { versionKey: false});

// Create new user Document
scrapSchema.statics.create = function(payload) {
    //this = model
    const scrap = new this(payload);
    //return promise
    return scrap.save();
};

module.exports = mongoose.model('Scrap', scrapSchema);
