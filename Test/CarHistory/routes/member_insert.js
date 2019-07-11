var express = require('express');
var router = express.Router();
const mysql = require('mysql');


/* GET users listing. */
router.post('/', function(req, res, next) {
  const result={msg:`회원가입 오류`};
  // console.log("세션ID=",req.sessionID);
  // req.session.email=req.body.email;
  // req.session.loginState=false;

  let con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'mysql',
    database:'nodejs'
  });

  con.connect((err)=>{
    if(err){
      return console.error(err.message);
    }
    console.log("DB연결됨");
    const sql=`insert into member(id, name, comments) values('${req.body.name}','${req.body.email}','${req.body.comments}')`;
    console.log(sql);
    con.query(sql,(err, results,fields)=>{
      if(err) {
        console.error(err.message);
        res.json(JSON.stringify(result));
      }else{
        console.log(results,fields);
        result.msg=`${req.body.name}님 가입되셨습니다.`;
        res.json(JSON.stringify(result));
      }
      con.end((err)=>{
        if(err){
          console.error(err.message);
        }
      });
    });
  });
    
});

module.exports = router;
