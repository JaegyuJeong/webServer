var express = require('express');
var router = express.Router();
var fs = require('fs');
var mime = require("mime-types");
var mysql = require("mysql");
var path = require("path");

/* GET users listing. */
router.post('/', function (req, res) {
    let filepath;

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
        console.log("DB연결됨");
        const sql = `select filepath from certchain_box where no = ?`;
        console.log(sql);
        conn.query(sql, [req.body.doc_no], (err, result, fields) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(result, fields);
                filepath = result[0].filepath;
                const filename = path.basename(filepath);
                const mimeType = mime.lookup(filepath);
                //res.download(filepath);   
                console.log(filename+"==="+filepath+"==="+mimeType);

                // 응답 헤더에 파일의 이름과 mime Type을 명시한다.(한글&특수문자,공백 처리)        
                res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(filename));          
                res.setHeader("Content-Type","binary/octet-stream");            
                // filePath에 있는 파일 스트림 객체를 얻어온다.(바이트 알갱이를 읽어옵니다.)            
                var fileStream = fs.createReadStream(filepath);           
                // 다운로드 한다.(res 객체에 바이트알갱이를 전송한다)      
                fileStream.pipe(res);

                /*
                res.setHeader("Content-disposition", "attachment; filename=" + filename);
                res.setHeader("Content-type", mimeType);
                let filestream = fs.createReadStream(filepath);
                filestream.pipe(res);
                */
            }
            conn.end();
        });
    });



});

module.exports = router;