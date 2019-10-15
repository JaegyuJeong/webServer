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

    if (req.body.title == "" || req.body.agency == "" || req.body.pw == "" || req.body.new_filepath == "") {
        const msg = {
            msg: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
        };
        res.json(JSON.stringify(msg));
    } else if (req.body.title.length > 44 || req.body.agency.length > 44 || req.body.new_filepath.length > 127) {
        const msg = {
            msg: "문서이름, 발급기관은 45자 / 파일경로는 128자 이내로 작성해주세요."
        };
        res.json(JSON.stringify(msg));
    } else {
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
            conn3.query(sql, [XSS_Check(req.session.email)], (err, result, fields) => {
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
                            const sql = `select count(*) as count_doc from certchain_box where account_no = (select no from certchain_account where email=?)`;

                            conn.query(sql, [req.session.email], (err, result, fields) => {
                                if (err) {
                                    console.error(err.message);
                                } else {
                                    if (result[0].count_doc >= 20) {
                                        const msg = { msg: "문서 최대 보관 개수를 초과했습니다.  (최대 20개)" };
                                        res.json(JSON.stringify(msg));
                                    } else {
                                        if (real_pw === req.body.pw) {
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
                                                const sql = `insert into certchain_box(account_no, title, agency, filepath) values((select no from certchain_account where email=?), ?, ?, ?)`;

                                                // XSS 방어
                                                const email = XSS_Check(req.session.email);
                                                const title = XSS_Check(req.body.title);
                                                const agency = XSS_Check(req.body.agency);

                                                conn2.query(sql, [email, title, agency, filepath], (err, result, fields) => {
                                                    if (err) {
                                                        console.error(err.message);
                                                    } else {
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
                }
                conn3.end();
            });
        });
    }
});

module.exports = router;

