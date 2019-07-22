var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loginState) {
    res.render('key', {
      email: req.session.email,
      pw: req.session.pw,
      name: req.session.name,
      loginState: req.session.loginState,
      account_page_state: req.session.account_page_state = false
    });
  } else {
    console.log("비정상적인 접근 - /key")
    res.redirect("/");
  }

});

module.exports = router;