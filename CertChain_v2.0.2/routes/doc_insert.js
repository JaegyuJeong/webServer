var express = require('express');
const mysql = require('mysql');
var router = express.Router();

router.post('/', function (req, res, next) {

    function XSS_Check(value) {
        value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
        value = value.replace(/\</g, "&lt;");
        value = value.replace(/\>/g, "&gt;");
        return value;
    }

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
            const sql = `select count(*) as count_doc from certchain_box where account_no = (select no from certchain_account where email=?)`;

            conn.query(sql, [req.session.email], (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (result[0].count_doc >= 20) {
                        const msg = { msg: "문서 최대 보관 개수를 초과했습니다.  (최대 20개)" };
                        res.json(JSON.stringify(msg));
                    } else {
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
                                const filepath = "./upload/" + req.session.email + "_" + req.body.new_filepath;
                                console.log("DB연결됨");
                                const sql = `insert into certchain_box(account_no, title, agency, filepath) values((select no from certchain_account where email=?), ?, ?, ?)`;
                                console.log(sql);

                                // XSS 방어
                                const email = XSS_Check(req.session.email);
                                const title = XSS_Check(req.body.title);
                                const agency = XSS_Check(req.body.agency);

                                conn2.query(sql, [email, title, agency, filepath], (err, result, fields) => {
                                    if (err) {
                                        console.error(err.message);
                                    } else {
                                        console.log(result, fields);
                                        const msg = { msg: "문서가 보관되었습니다." };
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
                conn.end();
            });
        });
    } else {
        const msg = { msg: "비밀번호를 잘못 입력하셨습니다." };
        res.json(JSON.stringify(msg));
    }
});

module.exports = router;

