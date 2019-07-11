var express = require('express');
var router = express.Router();
const {Member2} = require('../models');

/* post login 처리 */
router.post('/', function(req, res, next) {
 const result={msg:''};

 Member2.findOne({where : {id:req.body.email}})
 .then((data)=>{
   if(data){
     console.log(data.name);
     req.session.user_id=req.body.email;
     req.session.name=data.name;
     res.redirect('/');
   }else{
     result.msg=`다시 로그인 해주세요`;
     res.json(JSON.stringify(result));
   }
 })
 .catch((err)=>{
   console.error(err);
   result.msg=`로그인오류`;
   res.json(JSON.stringify(result));
 });

});

module.exports = router;
