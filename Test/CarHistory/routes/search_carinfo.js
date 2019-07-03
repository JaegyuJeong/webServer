var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  const searchType=req.body.searchType
  const car_num_input=req.body.car_num_input;
  const result ={msg:''};
  if(searchType && car_num_input){ //정상처리
    const car_info={
      "제조사":"현대",
      "자동차명":"에쿠스",
      "배기량":"2500cc",
      "사용연료":"가솔린",
      "차체형상":"세단",
      "용도 및 차종":"승용",
      "최초보험가입일자":"2000-07-05"
    };
    result.msg=car_info;
    console.log(result);
    res.json(JSON.stringify(result));
  }else{ // 에러 처리
    result.msg ='조회 결과 없음';
    res.json(JSON.stringify(result));
  }
  
});

module.exports = router;
