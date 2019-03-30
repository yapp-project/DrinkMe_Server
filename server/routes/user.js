var express = require('express');
var route_user = express.Router();
var User = require('../models/user.js');
var crypto = require('crypto');

// 연결 확인
route_user.get('/',(req,res) => {
	// GET Main
	res.json('connect Succesful');

});

// 회원가입 (성공)
route_user.post('/join', (req,res) => {
		User.create(req.body)
			.then(user => res.send(true))
			.catch(err => res.status(500).send(false));
});

// 회원가입 (암호화)
route_user.post('/test/join', (req,res) => {

	const user = new User();

	user.userid = req.body.userid;
	user.password = req.body.password;

	//encryption
	let cipher = crypto.createCipher('aes256', 'password');
	cipher.update(user.password, 'ascii', 'hex');
	let cipheredOutput = cipher.final('hex');
	user.password = cipheredOutput;

	user.save(function(err){
		if(err){
			console.error(err);
			res.json(false);
			return;
		}
		res.json(true);
	});
});

// 아이디 중복확인 (성공)
route_user.post('/join/check/id',(req,res) => {

	User.countDocuments({userid:req.body.userid})
		.then((count) => {
    	    if (count!=0) return res.status(404).send(false);
    		res.send(true);
		})
        .catch(err => res.status(500).send(false));
});

// 로그인 (성공) ===> user 비어있을 때 값처리 다시 한 번 해봐야함
route_user.post('/login', (req, res) => {
    console.log(req.body);
    User.find({userid: req.body.userid, password: req.body.password})
        .then((users) => {
            if (!users.length) return res.status(404).send(false);
            res.send(true);
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
		if(err) return res.status(500).send(false);
		res.json(users);
	})
});

async function check_auth (req) {
	console.log(req);
	User.find({userid: req.userid, password: req.password}, function (users) {
		if (!users) return false;
		return true;
	});
};

// 비밀번호 변경 (성공)
route_user.post('/update/password', (req, res) => {
    // UPDATE user
	var auth = check_auth(req.body);
	if(auth) {
		var query = {'password': req.body.password };
		newData = {$set:{password: req.body.newpassword}};
		User.updateOne(query, newData, {runValidators: true, upsert: true}, function (err, doc) { 	// runValidators : 기존 스키마 인덱스를 유지하게 도와줌
			if (err) return res.send(500, false);
			return res.send(true);
		});
	}
	else return res.send(false);
});

// 회원 탈퇴 ( X )
route_user.post('/delete/account', (req,res) => {
	// Delete User
	var auth = check_auth(req.body);
	if(auth) {
		User.remove({'userid': req.body.userid})
			.then(() => res.status(true))
			.catch(err => res.status(500).send(false));
	}
	else return res.send(false);
});


module.exports = route_user;
