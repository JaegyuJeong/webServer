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

    let conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'nodejs'
    });
    conn.connect((err) => { //키값이 가진 문서 정보 조회
        if (err) {
            return console.error(err.message);
        }
        let select_account_result = [];
        let select_box_result = [];
        let select_result = [];

        let conn2 = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'mysql',
            database: 'nodejs'
        });

        conn2.connect((err) => { // 키값 주인 사용자 정보 조회
            if (err) {
                return console.error(err.message);
            }
            const sql = `select * from certchain_account where no=(select account_no from certchain_key_encoded where encoded_key=?)`;

            const encoded_key = XSS_Check(req.body.encoded_key);

            conn2.query(sql, [encoded_key], (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (result[0]) {// 조회 ok
                        select_account_result = {
                            name: result[0].name,
                            email: result[0].email
                        };

                        const sql = `select * from certchain_box where account_no=(select account_no from certchain_key_encoded where encoded_key=?)`;

                        conn.query(sql, [req.body.encoded_key], (err, result, fields) => {
                            if (err) {
                                console.error(err.message);
                            } else {
                                console.log(result);
                                result.forEach(element => {
                                    select_box_result.push({
                                        title: element.title,
                                        agency: element.agency,
                                        create_at: element.create_at
                                    });
                                });
                                select_result = [select_account_result, select_box_result];
                                res.json(JSON.stringify(select_result));
                            }
                            conn.end();
                        });
                    } else {// 조회 fail
                        const msg = { msg: "키 값으로 조회된 정보가 없습니다." };
                        res.json(JSON.stringify(msg));
                    }
                }
                conn2.end();
            })
        });

    });
});


module.exports = router;