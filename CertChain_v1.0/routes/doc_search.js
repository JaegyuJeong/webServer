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

    conn.connect((err) => {
        if (err) {
            return console.error(err.message);
        }

        console.log("DB연결됨");
        const sql = `select * from certchain_box where account_no=(select no from certchain_account where email=?)`;
        console.log(sql);

        conn.query(sql, [req.session.email], (err, result, fields) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(result, fields);
                let select_result = [];
                result.forEach(element => {
                    select_result.push({
                        no: element.no,
                        title: element.title,
                        agency: element.agency, 
                        filepath: element.filepath,
                        create_at: element.create_at
                    });
                });
                res.json(JSON.stringify(select_result));
            }
            conn.end();
        })
    });
});


module.exports = router;

