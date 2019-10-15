var express = require('express');
const mysql = require('mysql');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loginState) {
    res.render('degree', {
      email: req.session.email,
      name: req.session.name,
      loginState: req.session.loginState,
      loginCount: req.session.loginCount,
      account_page_state: req.session.account_page_state = false,
      reg_page: req.session.reg_page = false,
      accountType: req.session.accountType
    });
  } else {
    console.log("비정상적인 접근 - /degree")
    res.redirect("/");
  }

});

module.exports = router;