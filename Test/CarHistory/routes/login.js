var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  const result={msg:''};
  
  if(req.session.email===req.body.email){
    req.session.loginState=true;
    result.msg='로그인에 성공하였습니다';
    // res.json(JSON.stringify(result));
    res.redirect("/");
  }else{
    result.msg='다시 로그인해주세요';
    res.json(JSON.stringify(result));
  }
});

module.exports = router;
