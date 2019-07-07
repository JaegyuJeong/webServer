var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log(req.session.member_insert_id +":"+req.session.member_insert_pw);
  console.log(req.body.member_login_id +":"+req.body.member_login_pw);
  if(req.session.member_insert_id === req.body.member_login_id && req.session.member_insert_pw === req.body.member_login_pw) {
    const result = {msg:"로그인 완료", loginSuccess: true};
    res.json(JSON.stringify(result));
  } else {
    const result = {msg:"로그인 실패", loginSuccess: false};
    res.json(JSON.stringify(result));
  }
});

module.exports = router;
