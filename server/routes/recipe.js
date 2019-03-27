const express = require('express');
const route_recipe = express.Router();
const Recipe = require('../models/recipe.js');
const Tag = require('../models/tag.js');

// connection check
route_recipe.get('/', (req,res) => {
    // GET Main
    res.json('connect Succesful : recipe');
});

// recipe register
route_recipe.post('/recipe', (req,res) => {
    Recipe.create(req.body)
        .then(recipe => res.send(recipe))
        .catch(err => res.status(500).send(err));

    Tag.create(req.body.tag)
        .then(tag => res.send(tag))
        .catch(err => res.status(500).send(err));
});

// recipe search by tag order by view
route_recipe.get('/recipe/tagv/:tag', (req,res) => {
    Recipe.find({
        tag : { $in : req.tag }
    })
    .limit(10)
    .sort({ view: 1})
    .catch(err => res.status(500).send(err));
});

// recipe search by tag order by new
route_recipe.get('/recipe/tagn/:tag', (req,res)=>{
    Recipe.find({
        tag : { $in : req.tag }
    })
    .limit(10)
    .sort({ created_date : -1 })
    .catch(err => res.status(500).send(err));
});

// recipe search by ingredient order by view
route_recipe.get('/recipe/ingredientv/:ingredient', (req,res)=>{
    Recipe.find({
        ingredient : { $in : req.ingredient }
    })
    .limit(10)
    .sort({ view : 1 })
    .catch(err => res.status(500).send(err));
});

// recipe search by ingredient order by new
route_recipe.get('/recipe/ingredientn/:ingredient', (req,res)=>{
    Recipe.find({
        ingredient : { $in : req.ingredient }
    })
    .limit(10)
    .sort({ created_date: -1 })
    .catch(err => res.status(500).send(err));
});

// tag random select
route_recipe.get('/recipe/random/:tag', (req,res) => {
    const Tags = Tag.sample(5);
    Recipe.find({
        tag : { $in : Tags }
    })
    .limit(5)
    .sort({ view: 1})
    .catch(err => res.status(500).send(err));
});


  // app.post('/api/photo', function(req,res){
  //   let newRecipe = new Recipe();
  //   newRecipe.image.data = fs.readFileSync(/*imgPath*/ req.files.recipePhoto.path)
  //   newRecipe.image.contentType = 'image/png';
  //   newRecipe.save()
  // })

module.exports = route_recipe;
