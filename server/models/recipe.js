// recipe.js

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// ingredient schema definition
let ingredientSchema = new Schema({
  name : { type : String, required : true },
  color : { type : String, required : true },
  ml : { type : Number },
})

// image schema definition
let imageSchema = new Schema({
  image : { data : Buffer, contentType : String }
})

// recipe schema definition
let recipeSchema = new Schema({
  name : { type : String, required : true },
  glass : { type : Number, required : true },
  percent : { type : Number, required : true },
  view : { type : Number, default : 0 },
  description : String,
  tag : [{ type : String, index : true }],
  ingredient : [{type : ingredientSchema, index : true}],
  image : imageSchema,
  created_date : { type : Date, default : Date.now, index : true },
  owner : { type : String, required : true },
})

// recipeShema.index({ view : 1, tag : 1 })

// Create new recipe Document
recipeSchema.statics.create = function(payload){
    // this = model
    const recipe = new this(payload);
    // return promise
    return recipe.save();
};

module.exports = mongoose.model('Recipe', recipeSchema)
