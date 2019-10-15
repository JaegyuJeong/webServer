var express = require('express');
const mysql = require('mysql');
var router = express.Router();

function XSS_Check(value) {
    value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
    value = value.replace(/\</g, "&lt;");
    value = value.replace(/\>/g, "&gt;");
    return value;
}

router.post('/', function (req, res, next) {
    if (req.body.email == "") {
        const res_dup = {
            result: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
        };
        res.json(JSON.stringify(res_dup));
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
            const sql = `select count(email) as count_email from certchain_account WHERE email=?`;

            conn.query(sql, [XSS_Check(req.body.email)], (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (result[0].count_email == 0) {
                        req.session.dupState = 1;
                        req.session.dupEmail = req.body.email;
                    }
                    const res_dup = {
                        result: result[0].count_email
                    };
                    res.json(JSON.stringify(res_dup));
                }
                conn.end();
            });
        });
    }

});

module.exports = router;