const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const crypto = require('crypto');


router.post('/signUp', (req, res) => {
    const user = new User();

    user.id = req.body.id;
    user.password = req.body.password;

    //encryption
    let cipher = crypto.createCipher('aes192', 'key');
    cipher.update(user.password, 'utf8', 'base64');
    let cipheredOutput = cipher.final('base64');
    user.password = cipheredOutput;

    /*
    //복호화
    //decryption
    let decipher = crypto.createDecipher('aes192', 'key');
    decipher.update(cipheredOutput, 'base64', 'utf8');
    let decipheredOutput = decipher.final('utf8');
    */

    user.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
        res.json({result: 1});
    });
});

//checkLogin
router.post('/checkLogin', function(req, res) {
    //DB에 암호화 하여 저장하였으니 DB에서 확인할때도 암호화 된 키로 확인한다
    let  cipher = crypto.createCipher('aes192', 'key');
    cipher.update(req.body.password,'utf8', 'base64');
    let cipherPw = cipher.final('base64');

    // find user in MongoDB
    User.findOne({id: req.body.id, password: cipherPw}, function(err, user){
        // 구문 error
        if(err) return res.status(500).json({error: err});
        // User가 없으면 error
        if(!user) return res.status(404).json({error: 'user not found'});
        res.json(user);
    })
});