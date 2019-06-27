var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("세션ID=",req.sessionID);
  res.render('index',{status: req.session.email,loginState: req.session.loginState}); //동적 데이터 삽입 가능
});

module.exports = router;
