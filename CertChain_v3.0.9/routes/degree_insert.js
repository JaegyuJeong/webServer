var express = require('express');
const mysql = require('mysql');
var router = express.Router();

function XSS_Check(value) {
  value = value.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g, "");
  value = value.replace(/\</g, "&lt;");
  value = value.replace(/\>/g, "&gt;");
  return value;
}

router.post("/", function(req, res){
  if (req.body.title == "" || req.body.agency == "" || req.body.pw == "" || req.body.new_filepath == "") {
    const msg = {
        msg: "Null Point 역참조 발생 (계속 반복 된다면 해킹 우려가 있으니 고객센터에 문의주세요.)"
    };
    res.json(JSON.stringify(msg));
}else{
    let conn3 = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'nodejs'
    });
    conn3.connect((err) => {
      if (err) {
          return console.error(err.message);
      }
    });
  }
});
module.exports = router;