var express = require('express');
var router = express.Router();
var User = require('../models/user.js');


// 연결 확인
router.get('/',(req,res) => {
	// GET Main
	res.json('connect Succesful');

});

// 회원가입
router.post('/join', (req,res) => {
		User.create(req.body)
			.then(user => res.send(user))
			.catch(err => res.status(500).send(err));
});

// 로그인
router.post('/login', (req, res) => {
    User.find({"userid": req.params.userid, "password": req.params.password})
        .then((users) => {
            if (!users) return res.status(404).send({err: 'User not found'});
            res.send('find successfully!'+users);
        })
        .catch(err => res.status(500).send(err));
});

// 아이디 중복확인
router.post('/check/id',(req,res) => {

	User.countDocuments({"userid": req.params.userid}, (err, count) => {
        if (err) {
            res.send(err);
            return;
        }
        res.json({count: count});	//반환값 0/1
    })
});



// 개인정보
router.post('/get/user',(req,res) => {
        User.findOne({userid: req.params.userid})
            .then(users => res.send(users))
            .catch(err => res.status(500).send(err));
    }
)


// 모든 유저 정보
router.get('/user', (req, res) => {
	// GET ALL User
	User.find(function(err, users) {
		if(err) return res.status(500).send({error: 'database failure'});
		res.json(users);
	})
});

// 특정 유저 정보
router.get('/user/get/:userid',(req, res) => {
	// GET One user
	User.findOneByUserid(req.params.userid)
		.then((users) => {
			if(!users) return res.status(404).send({ err: 'User not found'});
			res.send('findOne successfully: ${user}');
		})
		.catch(err => res.status(500).send(err));
	/*	User.find({ name: req.params.name }, (err, user) => {
		res.render('main', { user: user} );
	}); */
});


router.put('/user/update/:userid', (req, res) => {
    // UPDATE user
	User.updateByUserid(req.params.id, req.body)
		.then(user => res.send(user))
		.catch(err => res.status(500).send(err));
});

router.delete('/user/delete/:userid', (req,res) => {
	// Delete User
	User.remove(req.params.id)
		.then(()=> res.status(200))
		.catch(err => res.status(500).send(err));
});


module.exports = router;
