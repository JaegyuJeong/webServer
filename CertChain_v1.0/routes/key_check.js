var express = require('express');
const mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {

    let conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'nodejs'
    });
    let conn2 = mysql.createConnection({
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

        conn2.connect((err) => { // 키값 주인 사용자 정보 조회
            if (err) {
                return console.error(err.message);
            }
            console.log("DB연결됨");
            const sql = `select * from certchain_account where no=(select account_no from certchain_key where encoded_key='${req.body.encoded_key}')`;
            console.log(sql);

            conn2.query(sql, (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(result, fields);
                    select_account_result = {
                        name: result[0].name, 
                        email: result[0].email
                    };
                }
                conn2.end();
            })
        });

        console.log("DB연결됨");
        const sql = `select * from certchain_box where account_no=(select account_no from certchain_key where encoded_key='${req.body.encoded_key}')`;
        console.log(sql);

        conn.query(sql, (err, result, fields) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(result, fields);
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
        })
    });
});


module.exports = router;