var express = require('express');
var route_user = express.Router();
var User = require('../models/user.js');
var Scrap = require('../models/scrap.js');
var Recipe = require('../models/recipe.js');
var crypto = require('crypto');

// 유저정보 초기화
route_user.get('/delete', (req, res) =>  {
    User.remove({})
    .then(user => res.send(true))
    .catch(err => res.status(500).send(false));
});

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


// 내가 등록한 레시피
route_user.post('/get/mypage/myrecipe',(req,res) => {

    	//var length = 0;
        Recipe.find({"owner": req.body.userid})
			.then(myrecipe => {
		//		length = myrecipe.length;
		//		res.send({recipes : myrecipe, count:length})
         		res.send(myrecipe)
            })
			.catch(err => res.status(500).send(err));
    }
);

// 내가 스크랩한 레시피
route_user.post('/get/mypage/scraps',(req,res) => {

		//var length = 0;
        Scrap.aggregate([
			{	$match: { "userid":req.body.userid }},
            {
                $project: {
                    "recipeid": {
                        $toObjectId: "$recipeid"
                    }
                }
            },
            {
                $lookup: {
                    from: "recipes",
                    localField: "recipeid",
                    foreignField: "_id",
                    as: "scraps"
                }
            }
        ])
            .then(scraps => {
         //       length = scraps.length;
         //   	res.send({recipes : scraps, count:length})
				res.send(scraps)
            })
            .catch(err => res.status(500).send(err));
    }
);


// 게시글 당 스크랩 갯수반환
route_user.post('/get/scrap/counts',(req,res) => {

        Scrap.countDocuments({"recipeid": req.body.recipeid})
            .then(counts => {
                res.status(200).send({count: counts})
            })
            .catch(err => res.status(500).send(err));


/*
        var length = 0;
        Scrap.aggregate([
            {	$match: { "recipeid":req.body.recipeid }},
            {
                $project: {
                    "recipeid": {
                        $toObjectId: "$recipeid"
                    }
                }
            },
            {
                $lookup: {
                    from: "recipes",
                    localField: "recipeid",
                    foreignField: "_id",
                    as: "scraps"
                }
            }
        ])
            .then(scraps => {
            	length = scraps.length;
            	res.send({count:length})
                //res.send(scraps)
            })
            .catch(err => res.status(500).send(err));
 */   }
);

// 스크랩 되어 있는지지 여부
route_user.post('/status/scrap', (req, res) =>

    Scrap.find({ 'userid' : req.body.userid, 'recipeid' : req.body.recipeid })
        .then(scraps => {
            if (scraps.length)
            	res.send(true)
             else
                res.send(false)
        })
        .catch(err=> res.status(500).send({err:err}))
);

// 스크랩 되어있으면 삭제, 없으면 등록
route_user.post('/update/scrap', (req, res) =>

    Scrap.find({ 'userid' : req.body.userid, 'recipeid' : req.body.recipeid })
        .then(scraps => {
            if (scraps.length) {
                // 이미 등록되어 있는 스크랩이므로 삭제
                Scrap.deleteOne({ 'userid' : req.body.userid, 'recipeid' : req.body.recipeid})
                    .then(scraps => {
                        console.log("here3");
                        res.send({ 'result' : true, 'status': 'delete'})
                    })
                    .catch(err=> res.status(500).send(false))
            } else {
                Scrap.create(req.body)
                    .then(scrap => {
                            console.log("here4");
                            res.send({'result':true, 'status': 'save'})
                        }
                    )
                    .catch(err => res.status(500).send(false))
            }
        })
        .catch(err=> res.status(500).send(false))
);





module.exports = route_user;
