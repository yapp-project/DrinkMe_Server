// recipe.js

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// ingredient schema definition
let ingredientSchema = new Schema({
  name : { type : String  },
  color : { type : String },
  ml : { type : Number },
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
  ingredient : [{type : ingredientSchema}],
  image : imageSchema,
  created_date : { type : Date, default : Date.now },
  owner : { type : String },
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
