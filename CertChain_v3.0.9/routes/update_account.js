var express = require('express');
var router = express.Router();
const mysql = require('mysql');

function XSS_Check(value) {
    value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
    value = value.replace(/\</g, "&lt;");
    value = value.replace(/\>/g, "&gt;");
    return value;
}

router.post('/', function (req, res, next) {

    let real_pw = "";

    if (req.body.old_pw == "" || req.body.new_pw1 == "" || req.body.new_pw2 == "" ) {
        const msg = {
            msg: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
        };
        res.json(JSON.stringify(msg));
    } else if (req.body.old_pw.length > 44 || req.body.new_pw1.length > 44 || req.body.new_pw2.length > 44) {
        const msg = {
            msg: "비밀번호는 45자 이내로 입력해주세요."
        };
        res.json(JSON.stringify(msg));
    } else {

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
            const sql = `select password from certchain_account where email=?`;

            conn.query(sql,[XSS_Check(req.session.email)] ,(err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    real_pw = result[0].password;
                    if (req.body.old_pw == real_pw) {
                        if (req.body.new_pw1 == req.body.new_pw2) {   // 모든 체크가 끝나면 비밀번호 업데이트
                            let conn2 = mysql.createConnection({    // update sql을 위한 새로운 connection
                                host: 'localhost',
                                user: 'root',
                                password: 'mysql',
                                database: 'nodejs'
                            });
                            conn2.connect((err) => {
                                if (err) {
                                    return console.error(err.message);
                                }
                                const sql = `update certchain_account set password=? where email=?`;

                                conn2.query(sql, [req.body.new_pw1, req.session.email], (err, result, fields) => {
                                    if (err) {
                                        console.error(err.message);
                                    } else {
                                        req.session.account_page_state = false;
                                        res.redirect("/account_page");
                                    }
                                    conn2.end();
                                });
                            });

                        } else {
                            res.json(JSON.stringify({ msg: "새 비밀번호가 일치하지 않습니다." }));
                        }
                    } else {
                        res.json(JSON.stringify({ msg: "기존 비밀번호가 맞지 않습니다." }));
                    }
                }
                conn.end();
            });
        });
    }
});

module.exports = router;