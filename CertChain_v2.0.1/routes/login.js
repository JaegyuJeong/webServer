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

    if (req.body.email == "" || req.body.pw=="") {
        const msg = {
            msg: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
        };
        res.json(JSON.stringify(msg));
    } else {
        req.session.loginCount++;
        if (req.session.loginCount >= 5) {
            if (req.body.recaptcha == "") {
                const msg = { msg: "매크로방지 인증실패 \n매크로방지 체크박스를 체크해주세요." }
                res.json(JSON.stringify(msg));
            } else {
                executeQuery();
            }
        } else {
            executeQuery();
        }

        function executeQuery() {
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
                const sql = `select * from certchain_account where email=? and password=?`;
                console.log(sql);

                const email = XSS_Check(req.body.email);

                conn.query(sql, [email, req.body.pw], (err, result, fields) => {
                    if (err) {
                        console.error(err.message);
                        const msg = { msg: "아이디 또는 비밀번호를 잘못 입력하셨습니다." };
                        res.json(JSON.stringify(msg));
                    } else {
                        if (result[0] && result[0].email) {//로그인 ok        
                            req.session.email = result[0].email.toString("utf8");
                            req.session.name = result[0].name.toString("utf8");
                            req.session.pw = result[0].password.toString("utf8");
                            req.session.loginState = true;
                            req.session.loginCount = 0;

                            let tempSession = req.session;

                            req.session.regenerate((err) => {
                                Object.assign(req.session, tempSession);
                                res.redirect('/');
                            });
                        } else {// 로그인 fail
                            const msg = { msg: "아이디 또는 비밀번호를 잘못 입력하셨습니다." }
                            res.json(JSON.stringify(msg));
                        }

                    }
                    conn.end();
                });
            });
        }
    }
});

module.exports = router;

