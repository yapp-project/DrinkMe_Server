var express = require('express');
var router = express.Router();
var User = require('../models/user.js');



router.get('/',(req,res) => {
	// GET Main
	res.json('connect Succesful');

});

router.get('/user', (req, res) => {
	// GET ALL User
	User.find(function(err, users) {
		if(err) return res.status(500).send({error: 'database failure'});
		res.json(users);
	})
});

router.get('/user/:name',(req, res) => {
	User.find({ name: req.params.name }, (err, user) => {
		res.render('main', { user: user} );
	});
});

module.exports = router;
