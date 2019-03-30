var express = require('express');
var route_user = express.Router();
var User = require('../models/user.js');

// 연결 확인
route_user.get('/',(req,res) => {
	// GET Main
	res.json('connect Succesful');

});

// 회원가입 (성공)
route_user.post('/join', (req,res) => {
		User.create(req.body)
			.then(user => res.send(user))
			.catch(err => res.status(500).send(err));
});

// 아이디 중복확인 (성공)
route_user.post('/join/check/id',(req,res) => {

	User.countDocuments({userid:req.body.userid})
		.then((count) => {
    	    if (count!=0) return res.status(404).send({ count : 1 });
    		res.send({ count : 0 });
		})
        .catch(err => res.status(500).send(err));
});

// 로그인 (성공) ===> user 비어있을 때 값처리 다시 한 번 해봐야함
route_user.post('/login', (req, res) => {
    console.log(req.body);
    User.find({userid: req.body.userid, password: req.body.password})
        .then((users) => {
            if (!users) return res.status(404).send({err: 'User not found'});
            res.send(users);
        })
        .catch(err => res.status(500).send(err));
});


// 개인정보 (성공)
route_user.post('/get/indv',(req,res) => {
    console.log(req.body);
        User.findOne({userid: req.body.userid})
            .then(users => res.send(users))
            .catch(err => res.status(500).send(err));
    }
)

// 모든 유저 정보 (성공)
route_user.get('/get/all', (req, res) => {
	// GET ALL User
	User.find(function(err, users) {
		if(err) return res.status(500).send({error: 'database failure'});
		res.json(users);
	})
});

route_user.put('/user/update/:userid', (req, res) => {
    // UPDATE user
	User.updateByUserid(req.params.id, req.body)
		.then(user => res.send(user))
		.catch(err => res.status(500).send(err));
});

route_user.delete('/user/delete/:userid', (req,res) => {
	// Delete User
	User.remove(req.params.userid)
		.then(()=> res.status(200))
		.catch(err => res.status(500).send(err));
});


module.exports = route_user;
