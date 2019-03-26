// recipe.js

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ingredientSchema = new Schema({
  name : { type : String, required : true },
  color : { type : String, required : true },
  ml : int
})

let imageSchema = new Schema({
  image : { data : Buffer, contentType : String }
})

let recipeSchema = new Schema({
  name : { type : String, required : true },
  glass : { type : int, required : true },
  percent : { type : int, required : true },
  view : { type : int, default : 0 },
  description : String,
  tag : [{ type : String, index : true }],
  ingredient : [{type : ingredientSchema, index : true}],
  image : imageSchema,
  created_date : { type : Date, default : Date.now, index : true },
})

recipeShema.index({ view : 1, tag : 1 })

module.exports = mongoose.model('Recipe', recipeSchema)