var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const contents = req.body.contents;

    const result = {
        msg: name + "님의 문의가 접수되었습니다.",
        email,
        contents
    };
    res.json(JSON.stringify(result));
});

module.exports = router;