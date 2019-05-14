const express = require('express');
const route_recipe = express.Router();
const Recipe = require('../models/recipe.js');
const Tag = require('../models/tag.js');
const path = require('path')

// MULTER
//const multer = npmrequire('multer');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve, ms)
    })
}

// delete recipe
route_recipe.get('/del/', (req, res) => {
    console.log('why')
    console.log(req)
    Recipe.deleteOne({'_id' : req.query.id})
    .exec((err, result) => {
        if(err) return res.status(500).send(err)
        return res.status(200).send(result)
    })
})


// upload multiple images
route_recipe.post('/upload/multiple/', async (req,res,next) => {
    let urlArray = new Array()
    const upload = multer({ storage }).any()
    upload(req, res, async(err) => {
        if(err) res.send(err)
        const tmp = req
        console.log('file uploaded to server')

        const cloudinary = require('cloudinary').v2
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_SECRET
        })
        const tmpF = async () => {for(let i=0; i<(tmp.files).length; i++){
            const path = (tmp.files[i]).path
            console.log(path)
            const uniqueFilename = new Date().toISOString()

            await cloudinary.uploader.upload(
                path,
                { public_id: `recipe/${uniqueFilename}`, tags: `recipe` },
                (err, image) => {
                    if(err) return res.send(err)
                    console.log(image.url)
                    urlArray.push(image.url)
                    console.log('file uploaded to Cloudinary')
                    const fs = require('fs')
                    fs.unlinkSync(path)
            })/*.then(()=>{
            if(i==(tmp.files).length-1){
                console.log(urlArray)
                res.send(urlArray)
            }})*/
        }}
        await tmpF()
        console.log(urlArray)
        res.send(urlArray)
    })
    //res.send(urlArray)
})

// upload image
route_recipe.post('/upload', (req,res,next) => {
    const upload = multer({ storage }).single('name-of-input-key')
    upload( req, res,(err)=>{
        if(err) res.send(err)
   
        console.log('file uploaded to server')
        console.log(req.file)

        // SEND FILE TO CLOUDINARY
        const cloudinary = require('cloudinary').v2
        cloudinary.config({
            //cloud_name: 'hjcloud',
            //api_key: '844847417597383',
            //api_secret: 'CsL6vMIHHcca6NiLPVcHnRH7CDY'
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_SECRET
        })
        
        const path = req.file.path
        const uniqueFilename = new Date().toISOString()

        cloudinary.uploader.upload(
            path,
            { public_id: `recipe/${uniqueFilename}`, tags: `recipe` },
            (err, image) => {
                if(err) return res.send(err)
                console.log('file uploaded to Cloudinary')
                // remove file from server
                const fs = require('fs')
                fs.unlinkSync(path)
                // return image details
                res.json(image)
            })
    })
})

// get all recipes
route_recipe.get('/', (req,res) =>{
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
route_recipe.post('/', (req,res) => {
    const tmp = req;
    Recipe.create(tmp.body)
        .then(recipe => res.send(recipe))
        .catch(err => res.status(500).send(err));
    let tmp3 = JSON.stringify(req.body.tag).replace('[', '').replace(']','')
    .replace('\\','').split(',')
                .map((s)=>{return JSON.parse('{"tag" : '+s+'}')});
    Tag.insertMany(tmp3 ,{ordered: false} ,(err, data) =>{
    })
    console.log(tmp);
    Recipe.create(tmp.body)
        .then(recipe => res.send(recipe))
        .catch(err => res.status(500).send(err));
    //let tmp3 = JSON.stringify(req.body.tag).replace('[', '').replace(']','')
    //.replace('\\','').split(',')
    //            .map((s)=>{return JSON.parse('{"tag" : '+s+'}')});
    //Tag.insertMany(tmp3 ,{ordered: false} ,(err, data) =>{
    Tag.insertMany(req.body.tag, {ordered: false}, (err,data) => {});
    //})
});

// view recipe detail
route_recipe.get('/details', (req,res) => {
    //Recipe.find({'_id' : req.body._id})
    //Recipe.find({'_id' : req.body._id})
    console.log(req)
    Recipe.find({'_id' : req.query.id})
    .exec((err, recipe) => {
        if(err) return res.status(500).send(err)
        return res.status(200).send(recipe)
    })
})

// not paging
/*
// recipe search by tag order by view
route_recipe.get('/tag/view/', (req,res) => {
    Recipe.find({'tag' :  req.body.tag})
    Recipe.find({'tag' :  req.query.tag})
    .sort({view:-1})
    .limit(10)
    .exec((err, recipes)=>{
        if( err) return res.status(500).send(err)
        return res.status(200).send(recipes)
    })
});

// recipe search by tag order by new
route_recipe.get('/tag/new/', (req,res)=>{
    Recipe.find({'tag' : req.body.tag})
    Recipe.find({'tag' : req.query.tag})
    .sort({created_date:-1})
    .limit(10)
    .exec((err, recipes)=>{
        if(err) return res.status(500).send(err)
        return res.status(200).send(recipes)
    })
});

// recipe search by ingredient order by view
route_recipe.get('/ingredient/view/', (req,res)=>{
    Recipe.find({
        'ingredient.name' : { $all : req.body.ingredient }
        'ingredient.name' : { $all : req.query.ingredient }
    })
    .limit(10)
    .sort({ view : -1 })
    .exec((err, recipes)=>{
        if(err) return res.status(500).send(err)
        return res.status(200).send(recipes)
    })
});


// recipe search by ingredient order by new
route_recipe.get('/ingredient/new', (req,res)=>{
    Recipe.find({
        'ingredient.name' : { $all : req.body.ingredient }
        'ingredient.name' : { $all : req.query.ingredient }
    })
    .limit(10)
    .sort({ created_date: -1})
    .exec((err, recipes) =>{
        if(err) return res.status(500).send(err)
        return res.status(200).send(recipes)
    })
});
*/

// paging

// recipe search by tag order by view
route_recipe.get('/tag/view/', (req,res) => {

    var page = req.query.page;
    if(page == null) { page = 1;}

    var skipSize = (page-1) * 12;
    var limitSize = 12;
    var pageNum = 1;

    Recipe.countDocuments({'tag': req.query.tag }, function(err, totalCount) {

        if (err) throw err;

        pageNum = Math.ceil(totalCount / limitSize);
        Recipe.find({'tag': req.query.tag})
            .sort({ view : -1})
            .skip(skipSize)
            .limit(limitSize)
            .exec((err, recipes) => {
                if (err) return res.status(500).send(err)
                return res.send({contents: recipes, pagination: pageNum, page:page});
            });
    });
});

// recipe search by tag order by new
route_recipe.get('/tag/new/', (req,res)=>{


    var page = req.query.page;
    if(page == null) { page = 1;}

    var skipSize = (page-1) * 12;
    var limitSize = 12;
    var pageNum = 1;

    Recipe.countDocuments({'tag' : req.query.tag}, function(err, totalCount) {

        if (err) throw err;

        pageNum = Math.ceil(totalCount/limitSize);
        Recipe.find({'tag' : req.query.tag})
            .sort({ created_date: -1})
            .skip(skipSize)
            .limit(limitSize)
            .exec((err, recipes)=>{
            if(err) return res.status(500).send(err)
            return res.send({contents: recipes, pagination: pageNum, page:page});

        });
    });
});

// recipe search by ingredient order by view
route_recipe.get('/ingredient/view/', (req,res)=>{


    var page = req.query.page;
    if(page == null) { page = 1;}

    var skipSize = (page-1) * 12;
    var limitSize = 12;
    var pageNum = 1;

    Recipe.countDocuments({'ingredient.name' : { $all : req.query.ingredient }}, function(err, totalCount) {

        if (err) throw err;
        pageNum = Math.ceil(totalCount/limitSize);

        Recipe.find({
            'ingredient.name' : { $all : req.query.ingredient }
        })
        .sort({ view : -1})
        .skip(skipSize)
        .limit(limitSize)
        .exec((err, recipes)=>{
            if(err) return res.status(500).send(err)
            return res.send({contents: recipes, pagination: pageNum, page:page});
        });
    });
});

// recipesearch by ingredient order by new
route_recipe.get('/ingredient/new/', (req,res)=>{

    var page = req.query.page;
    if(page == null) { page = 1;}

    var skipSize = (page-1) * 12;
    var limitSize = 12;
    var pageNum = 1;

    Recipe.countDocuments({'ingredient.name' : {$all : req.query.ingredient}}, function(err, totalCount) {

        if (err) throw err;

        pageNum = Math.ceil(totalCount/limitSize);
        Recipe.find({
            'ingredient.name' : { $all : req.query.ingredient }
        })
            .sort({ created_date: -1})
            .skip(skipSize)
            .limit(limitSize)
            .exec((err, recipes) =>{
                if(err) return res.status(500).send(err)
                return res.send({contents: recipes, pagination: pageNum, page: page});
            });
    });
});

// 효율적인 코드를 위해서 놓긴했는데 사용 XX
var paging = function (bbs, pageIndex, pageUnit) {

    var length = bbs.length;
    // bbs->게시물 조회결과, pageIndex -> 현재 페이지, pageUnit -> 페이지당 게시물 단위 수 
    if (pageIndex == '' && pageUnit =='')
        return bbs;
    else {
        if(pageIndex > length / pageUnit) {
            console.log("error no such page index " + pageIndex + "<=" + length + "/" + pageUnit);
            return null;
        }
        var startIndex = (pageIndex - 1) * pageUnit;
        var endIndex = pageIndex * pageUnit;
        var data = [];
        for(var i= startIndex; i<endIndex; i++) {
            data.push(bbs[i]);
        }
        return data;
    }
}

// 페이징 테스트 용
route_recipe.get('/ingredient/new/test', (req,res)=>{

    var page = req.param('page');
    if(page == null) { page = 1;}

    var skipSize = (page-1) * 12;
    var limitSize = 12;
    var pageNum = 1;

    Recipe.count({deleted:false}, function(err, totalCount) {

        if (err) throw err;

        pageNum = Math.ceil(totalCount/limitSize);
        Recipe.find({
            'ingredient.name' : { $all : req.body.ingredient }
        })
            .limit(10)
            .sort({ created_date: -1})
            .skip(skipSize)
            .limit(limitSize)
            .exec((err, recipes) =>{
                if(err) return res.status(500).send(err)
                return res.render('board', {title:"Recipe", contents: recipes, pagination: pageNum});
            });
    });
});


// tag random select
route_recipe.get('/random', (req,res) => {
    Tag.aggregate([{ $sample: {size: 5} }])
    .then(tags => res.status(200).send(tags))
    .catch(err => res.status(500).send(err))
        //let list = Array()
        //for(let i=0; i<5; i++){
        //    list.push(tags[i]['tag'].toString())
        //}
        //Recipe.find({ 'tag' : { $in : list } })
        //    .sort({ view: 1})
        //    .then( recipes => res.status(200).send(recipes))
        //    .catch( err => res.status(500).send(err))
        //res.end(tags[0]['tag'].toString())
        //Recipe.find({ 'tag' : { $in : getTag } })
        //    .sort({ view: 1})
        //    .then( recipes => res.status(200).send(recipes))
        //    .catch( err => res.status(500).send(err))
    //.then((tags) => Recipe.find({ 'tag.tag' : { $in : tags.tag }})
    //    .sort({view: 1})
    //    .then((recipes) => res.status(200).send(recipes))
    //    .catch(err => res.status(500).send(err)))
    //.catch(err => res.status(500).send(err))
    //const Tags = Tag.sample(5);
    //Recipe.find({
    //    tag : { $in : Tags }
    //})
    //.limit(5)
    //.sort({ view: 1})
   //.then((recipes) => res.status(200).send(recipes))
    //.catch(err => res.status(500).send(err));
});


  // app.post('/api/photo', function(req,res){
  //   let newRecipe = new Recipe();
  //   newRecipe.image.data = fs.readFileSync(/*imgPath*/ req.files.recipePhoto.path)
  //   newRecipe.image.contentType = 'image/png';
  //   newRecipe.save()
  // })

module.exports = route_recipe;
