var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

/* GET users listing. */
router.post('/', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.doc_filename.path;
        var newpath = './upload/' + req.session.email + "_" + files.doc_filename.name;
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.redirect("/box");
            res.end();
        });
    });
});

module.exports = router;