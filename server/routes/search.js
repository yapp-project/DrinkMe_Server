const mongoose = require('mongoose')

module.exports = function(app, Recipe){

  app.get('/api/recipes', function(req,res)){
    Recipe.find((err, recipes) => {
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(recipes);
    });
  }

  app.get('/api/recipes/:tag', function(req,res){

  })

  // recipe 등록
  app.post('/api/recipes', function(req,res){
    let recipe = new Recipe();
    let tag = new Tag();
    recipe.name = req.body.name;
    recipe.glass = req.body.glass;
    recipe.percent = req.body.percent;
    recipe.description = req.body.description;
    recipe.tag = req.body.tag;
    recipe.ingredient = req.body.ingredient;

    tag.tag = req.body.tag;
    
    recipe.save(function(err){
      if(err){
        res.json({result:0});
        return;
      }

      res.json({result:1});
    })
  })

  // recipe 태그 검색
  app.get('/api/recipes/tag/:tag', (req, res) => {
    Recipe.find({ 
      tag : { $in : inputTag }
    }).
    limit(10).
    sort({ view: 1}).
    exec(callback);
  })

  // recipe 재료검색 - 조회수순
  app.get('/api/recipes/ingredient/:ingredient', (req, res) => {
    Recipe.find({
      ingredient.name : { $in : [] }
    }).
    limit(10).
    sort({ view: 1 }).
    exec(callback);
  })

  // recipe 재료검색 - 최신순
  app.get('/api/recipes/ingredient/:ingredient', (req, res) => {
    Recipe.find({
      ingredient.name : { $in : [] }
    }).
    limit(10).
    sort({ created_date: -1 }).
    exec(callback);
  })

  // tag 랜덤 추출, 목록 보이기
  app.get('/api/recipes/tag/:tag', (req,res) =>{
    let Tags = tag.sample(5)
    Recipe.find({
      tag : { $in : Tags[0] }
    }).
    limit(5).
    sort({ view: 1}).
    exec(callback);
  })
  
  // app.post('/api/photo', function(req,res){
  //   let newRecipe = new Recipe();
  //   newRecipe.image.data = fs.readFileSync(/*imgPath*/ req.files.recipePhoto.path)
  //   newRecipe.image.contentType = 'image/png';
  //   newRecipe.save()
  // })
}