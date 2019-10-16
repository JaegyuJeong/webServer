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

    if (
      req.body.cert_title == "" ||
      req.body.cert_org_name == "" ||
      req.body.cert_grade == "" ||
      req.body.cert_serial == "" ||
      req.body.cert_date == "" ||
      req.body.cert_key == ""
    ){
        const msg = {
            msg: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
        };

    } else {
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
            console.log(req.body, req.session.email);
            // XSS 방어
            const email = XSS_Check(req.session.email);
            const cert_title = XSS_Check(req.body.cert_title);
            const cert_grade = XSS_Check(req.body.cert_grade);
            const cert_serial = XSS_Check(req.body.cert_serial);
            const cert_date = XSS_Check(req.body.cert_date);
            const cert_key = req.body.cert_key;

            const sql = `insert into certchain_cert(from_no, to_no, title, grade, serial, date) values((select no from certchain_account where email=?), (select account_no from certchain_key_encoded where encoded_key=?), ?, ?, ?, ?)`;

            conn2.query(sql, [email, cert_key, cert_title,  cert_grade, cert_serial, cert_date], (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    const msg = { msg: "자격증 발급을 완료했습니다." };
                    res.json(JSON.stringify(msg));
                }
                conn2.end();
            });
        });




    }
});

module.exports = router;

