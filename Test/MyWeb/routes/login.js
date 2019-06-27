var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  const result={msg:''};
  console.log("세션ID=",req.sessionID);
 if(req.session.email===req.body.email){
  result.msg=`${req.session.email}님 로그인 되셨습니다.`;
 }else{
   result.msg='다시 로그인해주세요';
 }
    res.json(JSON.stringify(result));
});

module.exports = router;
