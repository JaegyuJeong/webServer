var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  const result={msg:''};
  
  const con = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'mysql',
    database:'nodejs'
  });

  con.connect((err) => {
    if(err) {
      return console.error(err.message);
    }
    console.log("DB연결됨:", req.body.login_email);
    const sql = `select * from member where id =?`;
    con.query(sql,[req.body.login_email],(err,rs,fields) => {
      if(err) {
        console.error(err.message);
        result.msg='다시로그인 해주세요';
        res.json(JSON.stringify(result));
      }else {
        if(rs[0] && rs[0].name){
          console.log(rs[0].name);
          req.session.email = req.body.login_email;
          req.session.name=rs[0].name;
          res.redirect('/');
        }else {
            result.msg='다시 로그인해주세요';
            res.json(JSON.stringify(result));
         }
      }
      con.end((err)=>{
        if(err) {
          return console.err(err.message);
        }
        console.log("con close");
      }); 
    });
  });
});

module.exports = router;
