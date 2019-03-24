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
    User.find({"id": req.params.id, "passwords": req.params.password})
        .then((users) => {
            if (!users) return res.status(404).send({err: 'User not found'});
            res.send('find successfully! '+users);
        })
        .catch(err => res.status(500).send(err));
});

// 아이디 중복확인
router.post('/check/id',(req,res) => {
	User.findOne({id: req.params.id})
		.then(users => res.send(users))
		.catch(err => res.status(500).send(err));
	}
)
/*
router.post('/login', (req, res) => {
        console.log('process/login 호출됨');
        let paramID = req.body.id || req.query.id;
        let paramPW = req.body.password || req.query.password;
        console.log('paramID : ' + paramID + ', paramPW : ' + paramPW);
        authUser(database, paramID, paramPW, function (err, docs) {
                    if (database) {
                        if (err) {
                            console.log('Error!!!');
                            res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
                            res.write('<h1>에러발생</h1>');
                            res.end();
                            return;
                        }

                        if (docs) {
                            console.dir(docs);
                            res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
                            res.write('<h1>Login Success</h1>');
                            res.write('<h1> user </h1>' + docs[0].id + '  :   ' + docs[0].name);
                            res.write('<br><a href="/login.html"> re login </a>');
                            res.end();
                        }
                        else {
                            console.log('empty Error!!!');
                            res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
                            res.write('<h1>user data not exist</h1>');
                            res.write('<a href="/login.html"> re login</a>');
                            res.end();
                        }
                    }
                    else {
                        console.log('DB 연결 안됨');
                        res.writeHead(200, { "Content-Type": "text/html;characterset=utf8" });
                        res.write('<h1>databasae 연결 안됨</h1>');
                        res.end();
                    }
                }
            );
    }
);

// 회원정보 확인
const authUser = function (db, id, password, callback) {
    console.log('input id :' + id.toString() + '  :  pw : ' + password);
    User.find({ "id": id, "passwords": password },
        function (err, docs)
        {
            if (err) {
                callback(err, null);
                return;
            }

            if (docs.length > 0) {
                console.log('find user [ ' + docs + ' ]');
                callback(null, docs);
            }
            else {
                console.log('can not find user [ ' + docs + ' ]');
                callback(null, null);
            }
        }
    );
};
*/

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
