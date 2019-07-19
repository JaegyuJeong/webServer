const express=require("express");
const path=require("path");
const app=express();
const bodyParser = require("body-parser");
const MedicalReportFormService = require('./service/MedicalReportFormService');
const contactFormService = require('./service/contactFormService');

app.use(express.static(path.join(__dirname,"/public")));
app.use(bodyParser.json());

app.post('/contactForm',function(req,res) {
    var name=req.body.name;
    var email=req.body.email;
    var phone = req.body.phone;
    var message=req.body.message;
    console.log(name,email,phone,message);
    if(name && email&& phone&&message) {
        contactFormService.contactFormInsertOne(name,email,phone,message);
    }else{
        res.send('Failure');
    }
});

app.post('/MedicalReportForm',function(req,res) {
    var name=req.body.name;
    var rnum = req.body.rnum;
    var address=req.body.address;
    var email = req.body.email;
    var date=req.body.date;
    var iarea=req.body.iarea;
    var iname = req.body.iname;
    var comments = req.body.comments;
    if(name && rnum&& address&&email && date && iarea && iname && comments ) {
        MedicalReportFormService.MedicalReportFormInsertOne(name ,rnum, address, email, date, iarea, iname, comments);
    }else{
        res.send('Failure');
    }
});

app.listen(7777,function(){
    console.log("7777 server ready...");
});