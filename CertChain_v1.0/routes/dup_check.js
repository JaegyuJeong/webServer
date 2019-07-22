var express = require('express');
const mysql = require('mysql');
var router = express.Router();

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
            const sql = `select count(email) as count_email from certchain_account WHERE email=?`;
            console.log(sql);

            conn.query(sql, [req.body.email], (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if(result[0].count_email==0){ 
                        req.session.dupState = 1;
                        req.session.dupEmail = req.body.email;
                    }
                    const res_dup = {
                        result : result[0].count_email
                    };
                    res.json(JSON.stringify(res_dup));  
                }
                conn.end();
            });
        });
   



});

module.exports = router;