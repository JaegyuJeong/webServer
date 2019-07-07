## CREDIT CAR .. D 웹 프로젝트 구성하기
1. mkdir creditCar
2. cd creditCar
3. express MyWeb —view=ejs
4. cd MyWeb
5. npm i
6. nom i —save-dev nodemon
7. package.json 파일수정
```
{
  "name": "myweb",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "nodemon ./bin/www"
  }
```
8. app.js 변경
	1. 성능을 위한 조정
```
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));	
```
	2. html -> ejs 로 전환
`app.engine(‘html’,require(‘ejs’).renderFile);`


9. UI 페이지 작성
10. UI button id 부여
11. 세션 옵션 추가
```
app.use(session({resave:false, // 재할당
  saveUninitialized:false,
  secret:'세션',
  cookie:{
    httpOnly:true,
    secure:false
  }
}));
```

12. view page 구성
![](CREDIT%20CAR%20..%20D%20%E1%84%8B%E1%85%B0%E1%86%B8%20%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3%20%E1%84%80%E1%85%AE%E1%84%89%E1%85%A5%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202019-07-07%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%2012.12.03.png)

14. login -> signup 이동
```
<button class="btn"><a href="/signup">Sign up</a></button> 
```
15. sign up 페이지에서 cancel btn 시 로그인 페이지 이동
```
<button class="btn"><a href="/cancel">CANCEL</a></button>
```
16. sign up 정보전달
```
    <input id="member_insert_id" type="text" placeholder="ID" name="" value="">
            </div>

            <div class="textbox">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                    <input id="member_insert_pw" type="password" placeholder="Password" name="" value="">
                </div>

            <div class="textbox">
                <i class="fa fa-mobile-alt" aria-hidden="true"></i>
                <input id="member_insert_pn" type="text" placeholder="phone number" name="" value="">
            </div>
                <button id="member_insert_btn" class="btn">Sign up</button>
```
* j query 작성
```
$("#member_insert_btn").click(function() {
        const member_insert_id = $("#member_insert_id").val();
        const member_insert_pw = $("#member_insert_pw").val();
        const member_insert_pn = $("#member_insert_pn").val();
        if(member_insert_id&&member_insert_pw&member_insert_pn){
        const send_params = {
            member_insert_id,
            member_insert_pw,
            member_insert_pn
        };
        $.post('/member_insert',send_params,function(data,status) {
            $(location).attr("href", "/");
            const parsedData = JSON.parse(data);
            alert(`${parsedData.msg}`);
        });
    } else {alert("입력되지 않은 값이 있습니다.")}
    });
```
* member_insert_biz
```
router.post('/', function(req, res, next) {

  req.session.member_insert_id = req.body.member_insert_id;
  req.session.member_insert_pw = req.body.member_insert_pw;
  req.session.member_insert_pn = req.body.member_insert_pn;
  console.log(req.session.member_insert_id +":"+req.session.member_insert_pw);
  console.log(req.body.member_insert_id +":"+req.body.member_insert_pw);
  const result = {msg: `가입완료!`};
  res.json(JSON.stringify(result));
});
```
17. login 확인
```
 <input id= "member_login_id" type="text" placeholder="ID" name="" value="">
            </div>

            <div class="textbox">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                    <input id = "member_login_pw" type="password" placeholder="Password" name="" value="">
                </div>

                <button id ="login_btn" class="btn">Sign in</button>
```
* j query 작성
```
$("#login_btn").click(function() {
        const member_login_id = $("#member_login_id").val();
        const member_login_pw = $("#member_login_pw").val();
        if(member_login_id && member_login_pw){
            const send_params = {
                member_login_id,
                member_login_pw
            };
            $.post('/login',send_params,function(data,status) {
                const parsedData = JSON.parse(data);
                if(parsedData.loginSuccess === true) {
                    $(location).attr("href","/main");
                    alert(`${parsedData.msg}`);
                }else {
                    $(location).attr("href","/");
                    alert(`${parsedData.msg}`);
                    $("#member_login_id").val("");
                    $("#member_login_pw").val("");
                }
            });
        }

    });
```
* login_biz
```
router.post('/', function(req, res, next) {
  console.log(req.session.member_insert_id +":"+req.session.member_insert_pw);
  console.log(req.body.member_login_id +":"+req.body.member_login_pw);
  if(req.session.member_insert_id === req.body.member_login_id && req.session.member_insert_pw === req.body.member_login_pw) {
    const result = {msg:"로그인 완료", loginSuccess: true};
    res.json(JSON.stringify(result));
  } else {
    const result = {msg:"로그인 실패", loginSuccess: false};
    res.json(JSON.stringify(result));
  }
});
```
18. logout 
```
<li><button id="logout_btn" class="buttonStyle">Log out</button></li>
```
* j query
```
$("#logout_btn").click(function() {
        $.get("/logout",function (data,status) {
            const parsedData = JSON.parse(data);
            $(location).attr("href", "/");
            alert(`${parsedData.msg}`);
        });     
    });
```
* logout_biz
```
router.get('/', function(req, res, next) {
  //biz
  if(req.session.member_insert_id){
    req.session.destroy(function (err) {
      const result = {msg: "로그아웃 성공!"};
      res.json(JSON.stringify(result));
    });
  }
});
```
19. 차량정보 조회 화면 이동
```
<button onclick="window.open('/search_carInfo_template','_blank',
    'scrollbars=yes, resizable=yes,width=500, height=680')" class="btn btn-default btn-lg">
    <span class="glyphicon glyphicon-search" ></span> Search</button>
```
20. 차량정보조회
```
<select id="searchType" class="bt" id="search_type" size="1">
                <option selected>조회타입</option>
                <option value="0">차량번호</option>
                <option value="1">차대번호</option>
            </select>
        </div>
        <div>
            <input type="text" id="car_num_input" placeholder="차량(대)번호를 띄워 쓰기 없이 입력하세요."/>
        </div>
        
        <div>
            <button id="carBasicInfoSearch_btn" class="search_btn"type="button">조회</button>
        </div>
        <div id="carBasicInfoSearch_div" class="div_design">
```
* j query
```
$("#carBasicInfoSearch_btn").click(function() {
        const searchType=$("#searchType").val();
        const car_num_input=$("#car_num_input").val();
        const send_params={
            searchType,
            car_num_input
        };
        $.post("/search_carInfo",send_params, function(data, status) {

                const parsed_data=JSON.parse(data);
                let printData='<table border=3>';
                for(key in parsed_data.msg)
                {
                    printData += `<tr><td>${key}</td><td>${parsed_data.msg[key]}</td></tr>`;
                }

                $("#carBasicInfoSearch_div").html(`${printData}`);
        });
    });
```
* search_carinfo 조회
```
router.post('/', function(req, res, next) {
  const searchType=req.body.searchType
  const car_num_input=req.body.car_num_input;
  const result ={msg:''};
  if(searchType && car_num_input){ //정상처리
    const car_info={
      "제조사":"Audi",
      "자동차명":"R8",
      "배기량":"5200cc",
      "사용연료":"가솔린",
      "차체형상":"Coupe",
      "최고속도":"330km/h",
      "0-100km/h 가속":"3.2초"
    };
    result.msg=car_info;
    console.log(result);
    res.json(JSON.stringify(result));
  }else{ // 에러 처리
    result.msg ='조회 결과 없음';
    res.json(JSON.stringify(result));
  }
  
});
```

끝