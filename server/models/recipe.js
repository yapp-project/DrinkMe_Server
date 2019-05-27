// recipe.js

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// ingredient schema definition
let ingredientSchema = new Schema({
  name : { type : String  },
  color : { type : String },
  ml : { type : Number },
  ratio : { type : Number },
}, { versionKey: false})

// comment schema definition
let commentSchema = new Schema({
    nick: {type : String },
    content: {type : String },
    time: {type : String}
}, { versionKey: false})

// image schema definition
let imageSchema = new Schema({
  image : { data : Buffer, contentType : String }
}, { versionKey: false})

// recipe schema definition
let recipeSchema = new Schema({
  name : { type : String },
  glass : { type : Number },
  percent : { type : Number },
  view : { type : Number, default : 0 },
  scrap : { type : Number, default : 0 },
  description : String,
  tag : [{ type : String }],
  ingredient : [ingredientSchema],
  numIngredient : { type : Number, default : 0 },
  image : [{ type : String }],
  created_date : { type : Date, default : Date.now },
  owner : { type : String },
  comment : [{type : commentSchema}]
}, { versionKey: false });

// recipeShema.index({ view : 1, tag : 1 })

// Create new recipe Document
recipeSchema.statics.create = function(payload){
    // this = model
    const recipe = new this(payload);
    // return promise
    return recipe.save();
};

module.exports = mongoose.model('Recipe', recipeSchema)
