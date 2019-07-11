var express = require('express');
var router = express.Router();
const {Car} = require('../models');

/* post member_insert */
router.post('/', function(req, res, next) {
 const result={msg:''};

 Car.findOne({attributes:['maker','car_name','displacement','fuel','body_type','vehicle_type','initial_insure_date'],
   where : {car_no:req.body.car_num_input}})
 .then((data)=>{
   if(data){
     console.log(data.name);
     const car_info={
       "제조사":data.maker,
       "자동차명":data.car_name,
       "배기량":data.displacement,
       "사용연료": data.fuel,
       "차체형상": data.body_type,
       "용도 및 차종" : data.vehicle_type,
       "최초보험가입일자": data.initial_insure_date                    
     };
     result.msg=car_info;
     console.log(JSON.stringify(result));
     res.json(JSON.stringify(result));
   }else{
     result.msg='조회 결과 없음';
     res.json(JSON.stringify(result));
   }
 })
 .catch((err)=>{
   console.error(err);
   result.msg=`차량 조회 오류`;
   res.json(JSON.stringify(result));
 });
});
module.exports = router;

