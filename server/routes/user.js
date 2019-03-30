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
			.then(user => res.send({success: 1}))
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
            if (!users.length) return res.status(404).send({ auth : 0 });
            res.send({ auth : 1 });
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

// 유저 확인
const auth_check = function(req, res) {
	// 로그인이랑 똑같음
	console.log(req);
	User.find({userid: req.userid, password: req.password})
		.then((users) => {
			console.log(users);
			if (!users.length) return ({ auth : 0 });
			return { auth : 1 };
		});
};

// 비밀번호 변경
route_user.post('/update/password', (req, res) => {
    // UPDATE user
	var auth = auth_check(req.body);
	if(auth) {
		var query = {'password': req.body.password };
		req.newData.password = req.body.newpassword;
		User.findOneAndUpdate(query, req.newData, {upsert: true}, function (err, doc) {
			if (err) return res.send(500, {error: err});
			return res.send("succesfully saved");
		});
	}
	else return res.send("fail");
});

// 회원 탈퇴
route_user.delete('/delete/account', (req,res) => {
	// Delete User
	User.deleteOne({'userid':req.params.userid})
		.then(()=> res.status(200))
		.catch(err => res.status(500).send(err));
});


module.exports = route_user;
