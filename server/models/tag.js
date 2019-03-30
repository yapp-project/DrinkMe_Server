// tag.js
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let tagSchema = new Schema({
  tag : { type : String, required : true, unique:true }
},{ versionKey : false})


module.exports = mongoose.model('Tag', tagSchema)
