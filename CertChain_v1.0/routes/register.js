var express = require('express');
var router = express.Router();
const mysql = require('mysql');

/* post member_insert listing. */
router.post('/', function (req, res, next) {
    /* console.log('세션 ID : ', req.sessionID);
    req.session.email = req.body.email;
    req.session.name = req.body.name; */
    if(req.session.dupState == 1 && req.session.dupEmail==req.body.email) {
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
            const sql = `insert into certchain_account(email, password, name) values('${req.body.email}', '${req.body.pw}', '${req.body.name}')`
            console.log(sql);

            conn.query(sql, (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                    res.json(JSON.stringify(result));
                } else {
                    console.log(result, fields);
                    const msg = { msg: req.body.name + "님 가입 되었습니다." };
                    res.json(JSON.stringify(msg));
                }
                conn.end();
            })
        });
    } else {
        const msg = {msg: "중복확인을 다시 해주세요."};
        res.json(JSON.stringify(msg));
    }

});

module.exports = router;