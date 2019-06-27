var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log("세션ID=",req.sessionID);
  req.session.email=req.body.email;
  const result={msg:`${req.body.name}님 가입되셨습니다.`};
    res.json(JSON.stringify(result));
});

module.exports = router;
