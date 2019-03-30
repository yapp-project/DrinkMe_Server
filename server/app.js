// ENV
require('dotenv').config();

// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 9000; // .env 파일
const route_user = require('./routes/user.js');
const route_recipe = require('./routes/recipe.js');
const crypto = require('crypto');
//const login = require('./routes/login.js');


// Static File Service
app.use(express.static('public'));
// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine
app.engine('pug', require('pug').__express);
app.set('view engine','pug');
app.set('views', path.join(__dirname, 'html'));
app.use(express.static(path.join(__dirname,'html')));

// CORS 설정
app.use(cors());
app.use('/user', route_user);
app.use('/recipe',route_recipe);
//app.use('/user', login);

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;


// CONNECT TO MONGODB SERVER ( mongodb+srv 형식은 mongoose 5.x 이상에서만 지원)
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useCreateIndex: true})
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));


// DEFINE MODEL
var User = require('./models/user');
var Recipe = require('./models/recipe');
var Tag = require('./models/tag');

app.listen(port, () => console.log(`Server listening on port ${port}`));


