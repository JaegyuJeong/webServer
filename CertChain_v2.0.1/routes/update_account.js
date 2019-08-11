var express = require('express');
var router = express.Router();
const mysql = require('mysql');

router.post('/', function (req, res, next) {

    let real_pw = "";

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
        const sql = `select password from certchain_account where email='${req.session.email}'`;
        console.log(sql);

        conn.query(sql, (err, result, fields) => {
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
                            console.log("DB연결됨");
                            const sql = `update certchain_account set password=? where email=?`;
                            console.log(sql);

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
});

module.exports = router;