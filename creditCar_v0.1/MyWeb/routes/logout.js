var express = require('express');
var router = express.Router();

/* get logout 처리 */
router.get('/', function(req, res, next) {
  //biz
  if(req.session.member_insert_id){
    req.session.destroy(function (err) {
      const result = {msg: "로그아웃 성공!"};
      res.json(JSON.stringify(result));
    });
  }
});

module.exports = router;