var express = require('express');
var router = express.Router();
const mysql = require('mysql');

router.post('/', function (req, res, next) {

    let real_pw="";

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

        console.log("DB연결됨");
        const sql = `select password from certchain_account where email='${req.session.email}'`;
        console.log(sql);

        conn2.query(sql, (err, result, fields) => {
            if (err) {
                console.error(err.message);
                const msg = { msg: "비밀번호를 잘못 입력하셨습니다." }
            } else {
                real_pw= result[0].password;
                if (req.body.pw == real_pw) {
                    let conn = mysql.createConnection({
                        host: 'localhost',
                        user: 'root',
                        password: 'admin',
                        database: 'nodejs'
                    });
            
                    conn.connect((err) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        console.log("DB연결됨");
                        const sql = `delete from certchain_account where email='${req.session.email}' and password='${req.body.pw}'`;
                        console.log(sql);
            
                        conn.query(sql, (err, result, fields) => {
                            if (err) {
                                console.error(err.message);
                                const msg = { msg: "비밀번호가 틀렸습니다." };
                                res.json(JSON.stringify(msg));
                            } else {
                                console.log(result, fields);
                                const msg = { msg: "정상적으로 탈퇴 되었습니다." };
                                res.json(JSON.stringify(msg));
                                req.session.destroy(function (err) { });
                            }
                            conn.end();
                        })
                    });
                } else {
                    const msg = { msg: "비밀번호가 틀렸습니다." };
                    res.json(JSON.stringify(msg));
                }
            }
            conn2.end();
        }); 
    });
});

module.exports = router;