// ENV
require('dotenv').config();

// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // .env 파일
const route = require('./routes/route.js');
const login = require('./routes/login.js');


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

app.use('/api', route);
app.use('/user', login);

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;


// CONNECT TO MONGODB SERVER ( mongodb+srv 형식은 mongoose 5.x 이상에서만 지원)
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useCreateIndex: true})
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));


// DEFINE MODEL
var User = require('./models/user');


app.listen(port, () => console.log(`Server listening on port ${port}`));


