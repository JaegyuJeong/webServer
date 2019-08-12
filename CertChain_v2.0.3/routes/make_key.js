var express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');

var router = express.Router();

function XSS_Check(value) {
    value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
    value = value.replace(/\</g, "&lt;");
    value = value.replace(/\>/g, "&gt;");
    return value;
}

router.post('/', function (req, res, next) {
    let encoded_key;

    if (req.body.memo == "" ) {
        const msg = {
            msg: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
        };
        res.json(JSON.stringify(msg));
    } else if (req.body.memo.length > 44 ) {
        const msg = {
            msg: "메모는 45자 이내로 작성해주세요."
        };
        res.json(JSON.stringify(msg));
    } else {

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
                const sql = `select count(*) as count_key from certchain_key where account_no = (select no from certchain_account where email=?)`;

                conn.query(sql, [XSS_Check(req.session.email)], (err, result, fields) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        if (result[0].count_key >= 10) {
                            const msg = { msg: "키 최대 보관 개수를 초과했습니다.  (최대 10개)" };
                            res.json(JSON.stringify(msg));
                        } else {
                            crypto.randomBytes(64, (err, buf) => {  // salt생성(랜덤 문자열)
                                const random_number = Math.floor(Math.random() * (999999 - 100000)) + 100000;
                                crypto.pbkdf2(req.session.id + random_number.toString(), buf.toString('base64'), 100526, 20, 'sha512', (err, key) => { // 인자(비밀번호, salt, 반복 횟수, 비밀번호 길이, 해시 알고리즘)
                                    encoded_key = key.toString('base64');
                                    executeQuery();
                                });
                            });
                        }
                    }
                    conn.end();
                });
            });
        } else {
            const msg = { msg: "비밀번호를 잘못 입력하셨습니다." };
            res.json(JSON.stringify(msg));
        }

        function executeQuery() {
            if (req.session.pw === req.body.pw) {
                let conn2 = mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: 'mysql',
                    database: 'nodejs'
                });

                conn2.connect((err) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    const sql = `insert into certchain_key(account_no, encoded_key, memo) 
                             values((select no from certchain_account 
                             where email=?), ?, ?)`;

                    conn2.query(sql, [XSS_Check(req.session.email), encoded_key, XSS_Check(req.body.memo)], (err, result, fields) => {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log(result, fields);
                            const msg = { msg: "키가 발급 되었습니다." };
                            res.json(JSON.stringify(msg));
                        }
                        conn2.end();
                    });
                });
            } else {
                const msg = { msg: "비밀번호를 잘못 입력하셨습니다." };
                res.json(JSON.stringify(msg));
            }

        }
    }

});

module.exports = router;