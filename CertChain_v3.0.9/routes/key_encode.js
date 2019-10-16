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

function searchOriginKey(email) {
    let conn4 = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'nodejs'
    });
    conn4.connect((err) => {
        if (err) {
            return console.error(err.message);
        }
        const sql = `select origin_key from certchain_key_origin where account_no=(select no from certchain_account where email=?)`;

        conn4.query(sql, [email], (err, result, fields) => {
            if (err) {
                console.error(err.message);
                res.json(JSON.stringify(result));
            } else {
                return result[0].origin_key;
            }
            conn4.end();
        });
    });
}

function executeQuery(email, encoded_key) {

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

        const sql = `insert into certchain_key_encoded(account_no, encoded_key) 
                         values((select no from certchain_account 
                         where email=?), ?)`;

        conn2.query(sql, [email, encoded_key], (err, result, fields) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(result, fields);
            }
            conn2.end();
        });
    });


}

router.post('/', function (req, res, next) {
    let encoded_key;
    const email = XSS_Check(req.session.email);

    let conn3 = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'nodejs'
    });
    conn3.connect((err) => {
        if (err) {
            return console.error(err.message);
        }
        const sql = `select password from certchain_account where email=?`;
        conn3.query(sql, [email], (err, result, fields) => {
            if (err) {
                console.error(err.message);
            } else {
                real_pw = result[0].password;
                if (real_pw === req.body.pw) {
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
                        const sql = `select count(*) as count_key from certchain_key_encoded where account_no = (select no from certchain_account where email=?)`;

                        conn.query(sql, [email], (err, result, fields) => {
                            if (err) {
                                console.error(err.message);
                            } else {
                                if (result[0].count_key >= 2) {
                                    const msg = { msg: "키 최대 보관 개수를 초과했습니다.  (최대 2개)" };
                                    res.json(JSON.stringify(msg));
                                } else {
                                    crypto.randomBytes(64, (err, buf) => {  // salt생성(랜덤 문자열)
                                        const random_number = Math.floor(Math.random() * (999999 - 100000)) + 100000;
                                        const origin_key = searchOriginKey(email);

                                        crypto.pbkdf2(origin_key + random_number.toString(), buf.toString('base64'), 100526, 20, 'sha512', (err, key) => { // 인자(비밀번호, salt, 반복 횟수, 비밀번호 길이, 해시 알고리즘)
                                            encoded_key = key.toString('base64');
                                            try {
                                                executeQuery(email, encoded_key);
                                            } catch (err) {
                                                const msg = { msg: "키가 발급 에러발생" };
                                                res.json(JSON.stringify(msg));
                                            }
                                            const msg = { msg: "키가 발급 되었습니다." };
                                            res.json(JSON.stringify(msg));
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

            }
            conn3.end();
        });
    });


});

module.exports = router;