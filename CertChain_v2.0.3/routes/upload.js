var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
const mysql = require('mysql');

function filename_Check(filename) {
    while (1) {
        if (
            filename.indexOf(".jpg") != -1 ||
            filename.indexOf(".pdf") != -1 ||
            filename.indexOf(".jpeg") != -1 ||
            filename.indexOf(".png") != -1
        ) {
            filename = filename.replace(".pdf", "");
            filename = filename.replace(".jpeg", "");
            filename = filename.replace(".jpg", "");
            filename = filename.replace(".png", "");
        } else {
            return filename;
        }
    }
}

/* GET users listing. */
router.post('/', function (req, res) {
    if (req.session.loginState) {
        let conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'mysql',
            database: 'nodejs'
        });
        conn.connect((err) => {
            if (err) {
                return console.error(err.message);
            }
            const sql = `select count(*) as count_doc from certchain_box where account_no = (select no from certchain_account where email=?)`;

            conn.query(sql, [req.session.email], (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (result[0].count_doc >= 20) {
                        const msg = { msg: "문서 최대 보관 개수를 초과했습니다." };
                        res.json(JSON.stringify(msg));
                    } else {
                        const form = new formidable.IncomingForm();

                        form.keepExtensions = true;
                        form.uploadDir = "./upload/";
                        form.maxFieldsSize = 3 * 1024 * 1024;

                        form
                            .on("fileBegin", function (name, file) {
                                console.log("fileBegin-" + name + ":" + JSON.stringify(file));
                            })
                            .on("progress", function (bytesReceived, bytesExpected) {
                                console.log("progress-" + bytesReceived + "/" + bytesExpected);
                            })
                            .on("aborted", function () {
                                console.log("aborted");
                            })
                            .on("error", function () {
                                console.log("error");
                            })
                            .on("end", function () {
                                console.log("end");
                            });

                        form.parse(req, function (err, fields, files) {
                            const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
                            let file = files.doc_filename;

                            if (file) {
                                let name = file.name;
                                const oldpath = file.path;
                                const type = file.type;
                                name = filename_Check(name);

                                if (allowedFileTypes.includes(type)) {
                                    const newpath = "./upload/" + req.session.email + "_" + name;

                                    fs.rename(oldpath, newpath, function (err) {
                                        if (err) throw err;
                                        res.redirect("/box");
                                    });
                                } else {
                                    fs.unlink(oldpath, function (err) {
                                        if (err) throw err;
                                        res.redirect("/box");
                                    });
                                }
                            } else {
                                res.redirect("/box");
                            }
                        });

                    }
                }
                conn.end();
            });
        });
    } else {
        res.redirect("/box");
    }
});

module.exports = router;