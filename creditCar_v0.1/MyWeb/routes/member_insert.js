var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {

  req.session.member_insert_id = req.body.member_insert_id;
  req.session.member_insert_pw = req.body.member_insert_pw;
  req.session.member_insert_pn = req.body.member_insert_pn;
  console.log(req.session.member_insert_id +":"+req.session.member_insert_pw);
  console.log(req.body.member_insert_id +":"+req.body.member_insert_pw);
  const result = {msg: `가입완료!`};
  res.json(JSON.stringify(result));
});

module.exports = router;
