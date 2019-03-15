var express = require('express');
var router = express.Router();
var User = require('../models/user.js');



router.get('/',(req,res) => {
	// GET Main
	res.json('connect Succesful');

});

/*
router.post('/err/join', (req, res) => {
	// insert function 오류
	User.insert([{ "userid": req.body.id, "userpw": req.body.pw, "username": req.body.name }], (err, result) => {
		if(err) {
			return next(err);
		}
		res.json(result);
	});
});
*/
router.post('/join', (req,res) => {
		User.create(req.body)
			.then(user => res.send(user))
			.catch(err => res.status(500).send(err));
});

router.post('/login', (req, res) => {
})

router.get('/user', (req, res) => {
	// GET ALL User
	User.find(function(err, users) {
		if(err) return res.status(500).send({error: 'database failure'});
		res.json(users);
	})
});

router.get('/user/:userid',(req, res) => {
	// GET One user
	User.findOneByUserid(req.params.userid)
		.then((user) => {
			if(!user) return res.status(404).send({ err: 'User not found'});
			res.send('findOne successfully: ${user}');
		})
		.catch(err => res.status(500).send(err));
	/*	User.find({ name: req.params.name }, (err, user) => {
		res.render('main', { user: user} );
	}); */
});


router.put('/user/:userid', (req, res) => {
    // UPDATE user
	User.updateByUserid(req.params.userid, req.body)
		.then(user => res.send(user))
		.catch(err => res.status(500).send(err));
});


router.delete('/user/:userid', (req, res) => {
	// DELETE user
	User.deleteByUserid(req.params.userid)
	.then(() => res.sendStatus(200))
	.catch(err => res.status(500).send(err));
});


module.exports = router;
