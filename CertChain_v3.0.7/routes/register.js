var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const crypto = require('crypto');

function XSS_Check(value) {
    value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
    value = value.replace(/\</g, "&lt;");
    value = value.replace(/\>/g, "&gt;");
    return value;
}

/*
function count_accountDB() {
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
        const sql = `select max(no) as max_account from certchain_account`;

        conn3.query(sql, (err, result, fields) => {
            if (err) {
                console.error(err.message);
                res.json(JSON.stringify(result));
            } else {
                return result[0].max_account;
            }
            conn2.end();
        });
    });
}
*/

function executeQuery(email) {
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

        let origin_key = "";

        crypto.randomBytes(64, (err, buf) => {  // salt생성(랜덤 문자열)
            const random_number = Math.floor(Math.random() * (999999 - 100000)) + 100000;
            crypto.pbkdf2(email + random_number.toString(), buf.toString('base64'), 100526, 20, 'sha512', (err, key) => { // 인자(비밀번호, salt, 반복 횟수, 비밀번호 길이, 해시 알고리즘)
                origin_key = key.toString('base64');

                const sql = `insert into certchain_key_origin(account_no, origin_key) 
                     values((select no from certchain_account where email=?), ?)`;

                conn3.query(sql, [email, origin_key], (err, result, fields) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log(result, fields);
                    }
                    conn3.end();
                });
            });
        });
    });

}



/* post member_insert listing. */
router.post('/', function (req, res, next) {
    if (req.body.email == "" || req.body.name == "" || req.body.pw == "") {
        const msg = {
            msg: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
        };
        res.json(JSON.stringify(msg));
    } else if (req.body.email.length > 44 || req.body.name.length > 44 || req.body.pw.length > 44) {
        const msg = {
            msg: "이메일, 이름, 비밀번호는 45자 이내로 가입해주세요."
        };
        res.json(JSON.stringify(msg));
    } else {
        if (req.session.dupState == 1 && req.session.dupEmail == req.body.email) {
            let conn = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'mysql',
                database: 'nodejs'
            });

            conn.connect(async (err) => {
                if (err) {
                    return console.error(err.message);
                }
                const sql_account = `insert into certchain_account(email, password, name, type) values(?, ?, ?, ?)`

                const email = XSS_Check(req.body.email);
                const name = XSS_Check(req.body.name);
                const type = XSS_Check(req.body.type);

                conn.query(sql_account, [email, req.body.pw, name, type], (err, result, fields) => {
                    if (err) {
                        console.error(err.message);
                        res.json(JSON.stringify(result));
                    } else {
                        if (req.body.type != "client") {
                            const reg_num = XSS_Check(req.body.reg_num);
                            const boss = XSS_Check(req.body.boss);

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
                                const sql_org_info = `insert into certchain_org_info(account_no, reg_num, boss) values((select no from certchain_account where email=?), ?, ?)`

                                conn2.query(sql_org_info, [email, reg_num, boss], (err, result, fields) => {
                                    if (err) {
                                        console.error(err.message);
                                        res.json(JSON.stringify(result));
                                    } else {
                                        console.log(result, fields);
                                    }
                                    conn2.end();
                                });
                            });
                        }else{
                            executeQuery(email); // client만 account 테이블에 정상적으로 insert되면 org_info 테이블에 insert
                        }
                        console.log(result, fields);
                        const msg = { msg: name + "님 가입 되었습니다." };
                        res.json(JSON.stringify(msg));
                    }
                    conn.end();
                });
            });
        } else {
            const msg = { msg: "중복확인을 다시 해주세요." };
            res.json(JSON.stringify(msg));
        }
    }
});

module.exports = router;