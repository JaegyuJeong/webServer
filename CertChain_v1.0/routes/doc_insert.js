var express = require('express');
const mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {

    if (req.session.pw === req.body.pw) {
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
            const filepath = "./upload/" + req.session.email + "_" + req.body.new_filepath;
            console.log("DB연결됨");
            const sql = `insert into certchain_box(account_no, title, agency, filepath) values((select no from certchain_account where email='${req.session.email}'), '${req.body.title}', '${req.body.agency}', '${filepath}')`;
            console.log(sql);

            conn.query(sql, (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(result, fields);
                    const msg = { msg: "문서가 보관되었습니다." };
                    res.json(JSON.stringify(msg));
                }
                conn.end();
            });
        });
    } else {
        const msg = { msg: "비밀번호를 잘못 입력하셨습니다." };
        res.json(JSON.stringify(msg));
    }

});

module.exports = router;

