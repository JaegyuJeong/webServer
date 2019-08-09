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
        console.log("DB연결됨");
        const sql = `delete from certchain_account where email = ?`;
        console.log(sql);

        conn.query(sql, [req.session.email], (err, result, fields) => {
            if (err) {
                console.error(err.message);
                const msg = { msg: "정상적으로 처리되지 않았습니다. 계속 반복된다면 고객센터에 문의주세요." };
                res.json(JSON.stringify(msg));
            } else {
                console.log(result);
                const msg = { msg: "정상적으로 탈퇴 되었습니다."};
                res.json(JSON.stringify(msg));
                req.session.destroy(function (err) { });
            }
            conn.end();
        })
    });
    
    
});

module.exports = router;