var express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');

var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
    let encoded_key;


    crypto.randomBytes(64, (err, buf) => {  // salt생성(랜덤 문자열)
        const random_number = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        crypto.pbkdf2(req.session.id + random_number.toString(), buf.toString('base64'), 100526, 20, 'sha512', (err, key) => { // 인자(비밀번호, salt, 반복 횟수, 비밀번호 길이, 해시 알고리즘)
            encoded_key = key.toString('base64');
            console.log(encoded_key);
            executeQuery();
        });
    });



    /* 복호화
    crypto.pbkdf2('입력비밀번호', '기존salt', 100526, 64, 'sha512', (err, key) => {
        console.log(key.toString('base64') === '기존 비밀번호');
    });*/

    function executeQuery() {
        if (req.session.pw === req.body.pw) {
            let conn = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'mysql',
                database: 'nodejs'
            });

            conn.connect((err) => {
                if (err) {
                    return console.error(err.message);
                }

                console.log("DB연결됨");
                const sql = `insert into certchain_key(account_no, encoded_key, memo) 
                             values((select no from certchain_account 
                             where email=?), ?, ?)`;
                console.log(sql);
                conn.query(sql, [req.session.email, encoded_key, req.body.memo], (err, result, fields) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log(result, fields);
                        const msg = { msg: "키가 발급 되었습니다." };
                        res.json(JSON.stringify(msg));
                    }
                    conn.end();
                });
            });
        } else {
            const msg = { msg: "비밀번호를 잘못 입력하셨습니다." };
            res.json(JSON.stringify(msg));
        }

    }

});

module.exports = router;