var express = require('express');
var router = express.Router();
const mysql = require('mysql');

router.post('/', function (req, res, next) {

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
        const sql = `delete from certchain_key where no=?`;

        conn.query(sql, [req.body.key_no], (err, result, fields) => {
            if (err) {
                console.error(err.message);
                const msg = { msg: "err - errcode 001 처리실패" };
                res.json(JSON.stringify(msg));
            } else {;
                const msg = { msg: "정상적으로 삭제 되었습니다." };
                res.json(JSON.stringify(msg));
            }
            conn.end();
        })
    });

});

module.exports = router;