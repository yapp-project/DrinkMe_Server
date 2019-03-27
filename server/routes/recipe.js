const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe.js');
const Tag = require('../models/tag.js');

// connection check
router.get('/', (req,res) => {
    // GET Main
    res.json('connect Succesful : recipe');
});

// recipe register
router.post('/recipes', (req,res) => {
    Recipe.create(req.body)
        .then(recipe => res.send(recipe))
        .catch(err => res.status(500).send(err));

    Tag.create(req.body.tag)
        .then(tag => res.send(tag))
        .catch(err => res.status(500).send(err));
});

// recipe search by tag order by view
router.get('/recipes/tagv/:tag', (req,res) => {
    Recipe.find({
        tag : { $in : req.tag }
    })
    .limit(10)
    .sort({ view: 1})
    .catch(err => res.status(500).send(err));
});

// recipe search by tag order by new
router.get('/recipes/tagn/:tag', (req,res)=>{
    Recipe.find({
        tag : { $in : req.tag }
    })
    .limit(10)
    .sort({ created_date : -1 })
    .catch(err => res.status(500).send(err));
});

// recipe search by ingredient order by view
router.get('/recipes/ingredientv/:ingredient', (req,res)=>{
    Recipe.find({
        ingredient.name : { $in : req.ingredient }
    })
    .limit(10)
    .sort({ view : 1 })
    .catch(err => res.status(500).send(err));
});

// recipe search by ingredient order by new
router.get('/recipes/ingredientn/:ingredient', (req,res)=>{
    Recipe.find({
        ingredient.name : { $in : req.ingredient }
    })
    .limit(10)
    .sort({ created_date: -1 })
    .catch(err => res.status(500).send(err));
});

// tag random select
router.get('/recipes/random/:tag', (req,res) => {
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
}

module.exports = router;
