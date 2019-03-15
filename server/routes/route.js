var express = require('express');
var router = express.Router();
var User = require('../models/user.js');



router.get('/',(req,res) => {
	// GET Main
	res.json('connect Succesful');

});

router.post('/join', (req, res) => {
	// insert function 오류
	User.insert([{ "userid": req.body.id, "userpw": req.body.pw, "username": req.body.name }], (err, result) => {
		if(err) {
			return next(err);
		}
		res.json(result);
	});
});

router.post('/user/join', (req,res) => {
		User.create(req.body)
			.then(user => res.send(user))
			.catch(err => res.status(500).send(err));
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
