var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loginState) {
    res.render('key_check_page', {
      email: req.session.email,
      name: req.session.name,
      loginState: req.session.loginState,
      loginCount: req.session.loginCount,
      account_page_state: req.session.account_page_state = false
    });
  } else {
    console.log("비정상적인 접근 - /key_check_page")
    res.redirect("/");
  }

});

module.exports = router;