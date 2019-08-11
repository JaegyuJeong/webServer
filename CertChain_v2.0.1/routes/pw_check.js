var express = require('express');
var router = express.Router();
const mysql = require('mysql');

router.post('/', function (req, res, next) {

    let real_pw = "";

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
        const sql = `select password from certchain_account where email=?`;
        console.log(sql);

            conn.query(sql, [req.session.email], (err, result, fields) => {
            if (err) {
                console.error(err.message);
            } else {
                real_pw=result[0].password;
                if(req.body.pw==real_pw){
                    req.session.account_page_state = true;
                    res.redirect("/account_page");
                }else{
                    res.json(JSON.stringify({msg:"비밀번호가 맞지 않습니다."}));
                }      
            }
            conn.end();
        });
    });
});

module.exports = router;