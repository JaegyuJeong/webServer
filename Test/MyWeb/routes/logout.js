var express = require('express');
var router = express.Router();

/* get logout 처리 */
router.get('/', function(req, res, next) {
  //biz
  if(req.session.email){
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  }
});

module.exports = router;