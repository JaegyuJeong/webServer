var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search_carinfo_template.html');//응답
  
});

module.exports = router;
