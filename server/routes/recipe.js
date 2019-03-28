const express = require('express');
const route_recipe = express.Router();
const Recipe = require('../models/recipe.js');
const Tag = require('../models/tag.js');

// connection check
route_recipe.get('/', (req,res) => {
    // GET Main
    res.json('connect Succesful : recipe');
});

// get all recipes
route_recipe.get('/recipe', (req,res) =>{
    Recipe.find(function(err, recipes) {
        if(err) return res.status(500).send({error: 'get recipes fail'});
        res.json(recipes);
    })
})

// get all tags
route_recipe.get('/tag', (req,res) => {
    Tag.find( (err, tags) => {
        if(err) return res.status(500).send({error: 'get tags fail'});
        res.json(tags);
    })
})
// recipe register
route_recipe.post('/recipe', (req,res) => {
    const tmp = req;
    Recipe.create(tmp.body)
        .then(recipe => res.send(recipe))
        .catch(err => res.status(500).send(err));
    
    Tag.insertMany(tmp.body.tag[0], (err, nTag) =>{
        if(err) return res.status(500).send({error: 'err'});
        res.json(nTag);
    })
    //Tag.create(req.body.tag)
      //  .then(tag => res.send(tag))
        //.catch(err => res.status(500).send(err));
});

// recipe search by tag order by view
route_recipe.get('/recipe/tagv/', (req,res) => {
    Recipe.find({'tag' :  req.body.tag})
    .sort({view:-1})
    .limit(10)
    .exec((err, recipes)=>{
        if( err) return res.status(500).send(err)
        return res.status(200).send(recipes)
    })
});

// recipe search by tag order by new
route_recipe.get('/recipe/tagn/', (req,res)=>{
    Recipe.find({'tag' : req.body.tag})
    .sort({created_date:-1})
    .limit(10)
    .exec((err, recipes)=>{
        if(err) return res.status(500).send(err)
        return res.status(200).send(recipes)
    })
});

// recipe search by ingredient order by view
route_recipe.get('/recipe/ingredientv/', (req,res)=>{
    Recipe.find({
        'ingredient.name' : { $all : req.body.ingredient }
    })
    .limit(10)
    .sort({ view : -1 })
    .exec((err, recipes)=>{
        if(err) return res.status(500).send(err)
        return res.status(200).send(recipes)
    })
});

// recipe search by ingredient order by new
route_recipe.get('/recipe/ingredientn/', (req,res)=>{
    Recipe.find({
        'ingredient.name' : { $all : req.body.ingredient }
    })
    .limit(10)
    .sort({ created_date: -1})
    .exec((err, recipes) =>{
        if(err) return res.status(500).send(err)
        return res.status(200).send(recipes)
    })
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
