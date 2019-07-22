### Cert Chain 
#### with *jQuery + NodeJS + MySQL + React + MongoDB *

1. DB
	* certchain_account
```
CREATE TABLE `certchain_account` (
   `no` INT(45) NOT NULL AUTO_INCREMENT,
   `email` VARCHAR(45) NOT NULL,
   `password` VARCHAR(45) NOT NULL,
   `name` VARCHAR(45) NOT NULL,
   `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`no`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=12
;
```
	* certchain_box
```
CREATE TABLE `certchain_box` (
   `no` INT(45) NOT NULL AUTO_INCREMENT,
   `account_no` INT(45) NOT NULL,
   `title` VARCHAR(45) NOT NULL,
   `agency` VARCHAR(45) NOT NULL,
   `filepath` VARCHAR(128) NOT NULL,
   `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`no`),
   INDEX `FK_certchain_box_certchain_account` (`account_no`),
   CONSTRAINT `FK_certchain_box_certchain_account` FOREIGN KEY (`account_no`) REFERENCES `certchain_account` (`no`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=10
;	
```
	* certchain_key
```
CREATE TABLE `certchain_key` (
   `no` INT(45) NOT NULL AUTO_INCREMENT,
   `account_no` INT(45) NOT NULL,
   `encoded_key` VARCHAR(128) NOT NULL,
   `memo` VARCHAR(45) NOT NULL,
   `create_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`no`),
   INDEX `FK_certchain_key_certchain_account` (`account_no`),
   CONSTRAINT `FK_certchain_key_certchain_account` FOREIGN KEY (`account_no`) REFERENCES `certchain_account` (`no`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
ROW_FORMAT=DYNAMIC
AUTO_INCREMENT=21
;
```

2. 회원가입
	* ejs 는 기존에 개발된 화면 이므로 제외
	* main.js >> “#resgister_btn”
```
$("#register_btn").click(function () {
        const name = $("#register_name").val();
        const email = $("#register_email").val();
        const pw = $("#register_pw").val();
        const pw_check = $("#register_pw_check").val();
        const isEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (name && email && pw && pw_check) {
            if (!isEmail.test(email)) {
                alert("5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.");
            } else if(pw != pw_check){
                alert("비밀번호가 일치하지 않습니다.");
            } else {
                const send_params = {
                    name,
                    email,
                    pw,
                    pw_check
                }
                $.post("/register", send_params, function (data, status) {
                    alert(JSON.parse(data).msg);
                    window.location.reload(true);
                });
            }
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });	
```

	* main.js >> “#dup_check_btn"
```
$("#dup_check_btn").click(function () {
        const email = $("#register_email").val();
        if (email) {
            const send_params = {
                email
            }
            $.post("/dup_check", send_params, function (data, status) {
                const parsedData = JSON.parse(data);
                if (parsedData.result > 0) {
                    $("#alert_duplication").html("<p style='color:red; font-size:14px; font-weight:bold'>중복된 이메일이 있습니다.</p>");
                    $("#register_email").html("");
                } else {
                    $("#alert_duplication").html("<p style='color:blue; font-size:14px; font-weight:bold'>가입 가능한 이메일입니다.</p>");
                    $("#register_email").html("");
                }

            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });	
```

	* register.js
```
var express = require('express');
var router = express.Router();
const mysql = require('mysql');

/* post member_insert listing. */
router.post('/', function (req, res, next) {
    /* console.log('세션 ID : ', req.sessionID);
    req.session.email = req.body.email;
    req.session.name = req.body.name; */
    if(req.session.dupState == 1 && req.session.dupEmail==req.body.email) {
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
            const sql = `insert into certchain_account(email, password, name) values('${req.body.email}', '${req.body.pw}', '${req.body.name}')`
            console.log(sql);

            conn.query(sql, (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                    res.json(JSON.stringify(result));
                } else {
                    console.log(result, fields);
                    const msg = { msg: req.body.name + "님 가입 되었습니다." };
                    res.json(JSON.stringify(msg));
                }
                conn.end();
            })
        });
    } else {
        const msg = {msg: "중복확인을 다시 해주세요."};
        res.json(JSON.stringify(msg));
    }

});

module.exports = router;	
```

3. 로그인
	* main.js >> “#login_btn”
```
$("#login_btn").click(function () {
        const email = $("#login_email").val();
        const pw = $("#login_pw").val();
        if (email && pw) {
            const send_params = {
                email,
                pw
            };
            $.post("/login", send_params, function (data, status) {
                try {
                    alert(JSON.parse(data).msg);
                    $("#login_email").val() = "";
                } catch (err) {
                    //console.log(err);
                    window.location.reload(true);
                }
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });	
```
	* login.js
```
var express = require('express');
const mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {

    //const result = { msg: "" };
    console.log("세션ID = ", req.sessionID);

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
        const sql = `select * from certchain_account where email='${req.body.email}' and password='${req.body.pw}'`;
        console.log(sql);

        conn.query(sql, (err, result, fields) => {
            if (err) {
                console.error(err.message);
                const msg = { msg: "아이디 또는 비밀번호를 잘못 입력하셨습니다." }
                res.json(JSON.stringify(msg));
            } else {
                if (result[0] && result[0].email) {//로그인 ok
                    console.log(result, fields);
                    req.session.email = result[0].email.toString("utf8");
                    req.session.name = result[0].name.toString("utf8");
                    req.session.pw = result[0].password.toString("utf8");
                    req.session.loginState = true;
                    res.redirect("/");
                } else {// 로그인 fail
                    const msg = { msg: "아이디 또는 비밀번호를 잘못 입력하셨습니다." }
                    res.json(JSON.stringify(msg));
                }

            }
            conn.end();
        });
    });
});

module.exports = router;	
```

4. 문서 발급 및 저장
	
	* main.js >> “#doc_insert_btn”
```
    $("#doc_insert_btn").click(function () {
        const title = $("#doc_title").val();
        const agency = $("#doc_agency").val();
        const pw = $("#doc_pw").val();
        const origin_filepath = $("input[name=doc_filename]").val().split("\\");
        const new_filepath = origin_filepath[origin_filepath.length - 1];

        if (title && agency && pw && new_filepath) {
            const send_params = {
                title,
                agency,
                pw,
                new_filepath
            };
            $.post("/doc_insert", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });	
```
 
	* doc_insert.js
```
var express = require('express');
const mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {

    if (req.session.pw === req.body.pw) {
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
            const filepath = "./upload/" + req.session.email + "_" + req.body.new_filepath;
            console.log("DB연결됨");
            const sql = `insert into certchain_box(account_no, title, agency, filepath) values((select no from certchain_account where email='${req.session.email}'), '${req.body.title}', '${req.body.agency}', '${filepath}')`;
            console.log(sql);

            conn.query(sql, (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(result, fields);
                    const msg = { msg: "문서가 보관되었습니다." };
                    res.json(JSON.stringify(msg));
                }
                conn.end();
            });
        });
    } else {
        const msg = { msg: "비밀번호를 잘못 입력하셨습니다." };
        res.json(JSON.stringify(msg));
    }

});

module.exports = router;	
```
	
	* main.js >> “#doc_search_btn”
```
$("#doc_search_btn").click(function () {
        const send_params = {
        };
        $.post("/doc_search", send_params, function (data, status) {
            const parsedData = JSON.parse(data);
            let x;
            let result = "";

            for (x in parsedData) {
                result +=
                    "<div class='single-recent-post d-flex' >" +
                        "<!-- Thumb -->" +
                        "<div class='post-thumb'>" +
                            "<a href='#'><img src='img/box-filled.png' alt=''></a>" +
                        "</div>" +
                        "<!-- Content -->" +
                        "<div class='post-content'>" +
                            "<!-- Post Meta -->" +
                            "<div class='post-meta'>" +
                                "<a class='post-author'>" + parsedData[x].create_at.substr(0, 10) + "</a>" +
                                "<a class='post-tutorial'>" + parsedData[x].agency + "</a>" +
                            "</div>" +
                            "<p>" + parsedData[x].title + "</p>" +
                        "</div>"+
                        "<button class='btn roberto-btn w-100' id='doc_download_" + parsedData[x].no + "'><img src='img/download.png' ></button>" +
                        "<button class='btn roberto-btn w-100' id='doc_delete_" + parsedData[x].no + "'><img src='img/trash.png'></button>" +
                    "</div>";
            }
            $("#doc_list").html(result);
        });
    });
```
	
	* doc_search.js
```
var express = require('express');
const mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {

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
        const sql = `select * from certchain_box where account_no=(select no from certchain_account where email='${req.session.email}')`;
        console.log(sql);

        conn.query(sql, (err, result, fields) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(result, fields);
                let select_result = [];
                result.forEach(element => {
                    select_result.push({
                        no: element.no,
                        title: element.title,
                        agency: element.agency, 
                        filepath: element.filepath,
                        create_at: element.create_at
                    });
                });
                res.json(JSON.stringify(select_result));
            }
            conn.end();
        })
    });
});


module.exports = router;	
```
	
	* main.js >> 업로드 문서 삭제
```
$(document).on("click", "button[id^='doc_delete_']", function(){ 
        var id = $(this).attr("id"); 
        var box_no = id.replace("doc_delete_", "");

        if (box_no) {
            const send_params = {
                box_no
            };
            $.post("/doc_delete", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("정상적인 경로가 아닙니다. 다시 시도해주세요.");
        }  
    });	
```
	
	* doc_delete .js
```
var express = require('express');
var router = express.Router();
const mysql = require('mysql');

router.post('/', function (req, res, next) {

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
        const sql = `delete from certchain_box where no='${req.body.box_no}'`;
        console.log(sql);

        conn.query(sql, (err, result, fields) => {
            if (err) {
                console.error(err.message);
                const msg = { msg: "err - errcode 001 처리실패" };
                res.json(JSON.stringify(msg));
            } else {
                console.log(result, fields);
                const msg = { msg: "정상적으로 삭제 되었습니다." };
                res.json(JSON.stringify(msg));
            }
            conn.end();
        })
    });

});

module.exports = router;	
```

5. 키 발급
	
	* main.js >> “#make_key_btn”
```
 $("#make_key_btn").click(function () {
        const memo = $("#key_memo").val();
        const pw = $("#key_password").val();
        if (memo && pw) {
            const send_params = {
                memo,
                pw
            }
            $.post("/make_key", send_params, function (data, status) {
                const parsed = JSON.parse(data);
                alert(parsed.msg);
                window.location.reload(true);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });	
```

	* main.js >> “#search_key_btn”
```
 $("#search_key_btn").click(function () {
        const send_params = {
        };
        $.post("/search_key", send_params, function (data, status) {
            const parsedData = JSON.parse(data);
            let x;
            let result = "";


            for (x in parsedData) {
                result +=
                    "<div class='single-recent-post d-flex' >" +
                    "<!-- Thumb -->" +
                    "<div class='post-thumb'>" +
                    "<a href='#'><img src='img/key.png' alt=''></a>" +
                    "</div>" +
                    "<!-- Content -->" +
                    "<div class='post-content'>" +
                    "<!-- Post Meta -->" +
                    "<div class='post-meta'>" +
                    "<a class='post-author'>" + parsedData[x].create_at.substr(0, 10) + "</a>" +
                    "<a class='post-tutorial'>" + parsedData[x].memo + "</a>" +
                    "</div>" +
                    "<p >" + parsedData[x].encoded_key + "</p>" +
                    "</div>"+
                    "<button class='btn roberto-btn w-100' id='key_delete_" + parsedData[x].no + "'>삭제</button>" +
                    "</div>";
            }
            $("#key_list").html(result);
        });
    });
```

	* main.js >> 키삭제
```
$(document).on("click", "button[id^='key_delete_']", function(){ 
        var id = $(this).attr("id"); 
        var key_no = id.replace("key_delete_", "");

        if (key_no) {
            const send_params = {
                key_no
            };
            $.post("/key_delete", send_params, function (data, status) {
                alert(JSON.parse(data).msg);
                window.location.reload(true);
            });
        } else {
            alert("정상적인 경로가 아닙니다. 다시 시도해주세요.");
        }  
    });	
```

6. 키 조회(인증)
	* main.js >> “#key_check_btn”
```
$("#key_check_btn").click(function () {
        const encoded_key = $("#encoded_key").val();
        if (encoded_key) {
            const send_params = {
                encoded_key
            };
            $.post("/key_check", send_params, function (data, status) {
                const parsedData = JSON.parse(data);
                let x;
                let result = "<h4 class='widget-title mb-30'>키 값 소유자 정보</h4>"+
                        "<p>이름 : "+parsedData[0].name+"</p>"+
                        "<p>이메일 : "+parsedData[0].email+"</p>"+
                        "<h4 class='widget-title mb-30'>조회한 키 값이 보유한 문서 목록</h4>";

                for (x in parsedData) {
                    result +=
                        "<div class='single-recent-post d-flex' >" +
                        "<!-- Thumb -->" +
                        "<div class='post-thumb'>" +
                        "<a href='#'><img src='img/box-filled.png' alt=''></a>" +
                        "</div>" +
                        "<!-- Content -->" +
                        "<div class='post-content'>" +
                        "<!-- Post Meta -->" +
                        "<div class='post-meta'>" +
                        "<a class='post-author'>" + parsedData[1][x].create_at.substr(0, 10) + "</a>" +
                        "<a class='post-tutorial'>" + parsedData[1][x].agency + "</a>" +
                        "</div>" +
                        "<p>" + parsedData[1][x].title + "</p>" +
                        "</div></div>";
                }
                $("#key_check_doc_list").html(result);
            });
        } else {
            alert("입력되지 않은 값이 있습니다. 다시 입력하세요.");
        }
    });	
```

	* key_check.js
```
var express = require('express');
const mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {

    let conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'nodejs'
    });
    let conn2 = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql',
        database: 'nodejs'
    });


    conn.connect((err) => { //키값이 가진 문서 정보 조회
        if (err) {
            return console.error(err.message);
        }
        let select_account_result = [];
        let select_box_result = [];
        let select_result = [];

        conn2.connect((err) => { // 키값 주인 사용자 정보 조회
            if (err) {
                return console.error(err.message);
            }
            console.log("DB연결됨");
            const sql = `select * from certchain_account where no=(select account_no from certchain_key where encoded_key='${req.body.encoded_key}')`;
            console.log(sql);

            conn2.query(sql, (err, result, fields) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(result, fields);
                    select_account_result = {
                        name: result[0].name, 
                        email: result[0].email
                    };
                }
                conn2.end();
            })
        });

        console.log("DB연결됨");
        const sql = `select * from certchain_box where account_no=(select account_no from certchain_key where encoded_key='${req.body.encoded_key}')`;
        console.log(sql);

        conn.query(sql, (err, result, fields) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log(result, fields);
                result.forEach(element => {
                    select_box_result.push({
                        title: element.title,
                        agency: element.agency,
                        create_at: element.create_at
                    });
                });
                select_result = [select_account_result, select_box_result];
                res.json(JSON.stringify(select_result));
            }
            conn.end();
        })
    });
});


module.exports = router;	
```

7.  mongodb + react
	* cs.ejs에 리액트와 바벨 js 모듈을 CDN으로 명시
```
<!-- react_mongodb -->
    <script src="js/jquery-1.6.2.min.js" type="text/javascript"></script>
    <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <script src=" https://unpkg.com/axios/dist/axios.min.js "></script>	
```
	
	* public/CsForm.jsx 생성
```
	class CsForm extends React.Component {
    send=()=>{
        const send_param={
            name:this.name.value,
            email:this.email.value,
            message:this.message.value
        }

        axios.post('/csForm',send_param)
        .then((response)=>{
            console.log(response);
            alert(JSON.parse(response.data).msg);
            window.location.reload(true);
        })
        .catch((error)=>{
            console.log(error);
        });
    }
    render() {
        console.log("ok");
        return(
            <form>
                <div class="row">
                    <div class="col-12 col-lg-6 wow fadeInUp" data-wow-delay="100ms">
                        <input type="text" ref={ref=> this.name=ref} name="message-name" class="form-control mb-30" placeholder="이름" />
                    </div>
                    <div class="col-12 col-lg-6 wow fadeInUp" data-wow-delay="100ms">
                        <input type="email" ref={ref=> this.email=ref}  name="message-email" class="form-control mb-30" placeholder="이메일" />
                    </div>
                    <div class="col-12 wow fadeInUp" data-wow-delay="100ms">
                        <textarea name="message" ref={ref=> this.message=ref}  class="form-control mb-30" placeholder="내용"></textarea>
                    </div>
                    <div class="col-12 text-center wow fadeInUp" data-wow-delay="100ms">
                        <button type="button" class="btn roberto-btn mt-15" onClick={this.send}>보내기</button>
                    </div>
                </div>
            </form>
        )
    }
}
ReactDOM.render(
    <CsForm />,
    document.getElementById('react-cs-form')
);
```

	* cs.ejs에 form 태그 영역 표시
```
<div class="roberto-contact-form" id="react-cs-form"></div>
                        <script type="text/babel" src="CsForm.jsx"></script>	
```

	* npm install body-parser —save
	* app.js 에 body-parser 추가 ( app.js 전체 공유)
```
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require("body-parser");
var csFormService = require('./service/csFormService');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine("html", require("ejs").renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("edcodingkey_yjc"));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({resave:false, 
  saveUninitialized:true, 
  secret:"edcodingkey_yjc",
  cookie: {
    httpOnly: true,
    secure: false
  }
}));

app.use('/', require('./routes/index'));
app.use('/register', require('./routes/register'));
app.use('/delete_account', require('./routes/delete_account'));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/about", require("./routes/about"));
app.use("/key", require("./routes/key"));
app.use("/key_check", require("./routes/key_check"));
app.use("/key_check_page", require("./routes/key_check_page"));
app.use("/key_delete", require("./routes/key_delete"));
app.use("/make_key", require("./routes/make_key"));
app.use("/search_key", require("./routes/search_key"));
app.use("/box", require("./routes/box"));
app.use("/doc_insert", require("./routes/doc_insert"));
app.use("/doc_search", require("./routes/doc_search"));
app.use("/doc_delete", require("./routes/doc_delete"));
app.use("/doc_download", require("./routes/doc_download"));
app.use("/cs", require("./routes/cs"));
app.use("/cs_qna", require("./routes/cs_qna"));
app.use("/dup_check",require("./routes/dup_check"));
app.use("/upload",require("./routes/upload"));

app.post('/csForm',function(req,res) {
  var name=req.body.name;
  var email=req.body.email;
  var message=req.body.message;
  console.log(name,email,message);
  if(name && email && message) {
      csFormService.csFormInsertOne(res,name,email,message);
  }else{
      res.send('Failure');
  }
});

var logoutRouter = require("./routes/logout");
app.use("/logout", logoutRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err.stack);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;	
```

	* mongodb 설치 >> nom install mongodb
	* mkdir service
	* service 폴더에 csFormService.js 생성
	* csFormService.js
```
const MongoClient=require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/CertChain';

module.exports={
    csFormInsertOne: function(res, name,email,message) {
        MongoClient.connect(url, function(err,db) {
            if(err) {
                console.log(err);
            }else{
                console.log('db connected....ok');
                db = db.db('CertChain');

                db.collection('csForm').insertOne(
                    {
                        "name":name,
                        "email":email,
                        "message":message
                    },
                    (err, result) => {
                        if(err) {
                            console.log(err);
                        }else{
                            console.log('메세지 저장됨\n');
                            console.log(result);
                            // res.send("요청이 접수되었습니다.");
                            const msg = {msg:"요청이 접수되었습니다."};
                            res.json(JSON.stringify(msg));
                        }
                    }
                );
            }
        });
    }
}	
```

__________끝 _____________