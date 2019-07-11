var express = require('express');
var router = express.Router();
const {Member2} = require('../models');

/* post member_insert */
router.post('/', function(req, res, next) {
 const result={msg:''};
  Member2.create({
   name: req.body.name,
   id: req.body.email,
   comments:req.body.comments
 })
 .then((rs)=>{
   console.log(rs);
   result.msg=`${req.body.name}님 가입되셨습니다`;
   res.json(JSON.stringify(result));
 })
 .catch((err)=>{
   console.error(err);
   result.msg=`가입오류`;
   res.json(JSON.stringify(result));
 });
  
});
module.exports = router;
