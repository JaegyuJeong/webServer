var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require("body-parser");
var csFormService = require('./service/csFormService');
var helmet = require('helmet');

var app = express();

app.use(helmet());



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
  secret:"encodingkey_yjc",
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 3600000
  },rolling:true
}));

app.use('/', require('./routes/index'));
app.use('/register', require('./routes/register'));
app.use('/delete_account', require('./routes/delete_account'));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/account_page", require("./routes/account_page"));
app.use("/pw_check", require("./routes/pw_check"));
app.use("/update_account", require("./routes/update_account"));
app.use("/about", require("./routes/about"));
app.use("/key", require("./routes/key"));
app.use("/key_check", require("./routes/key_check"));
app.use("/key_delete", require("./routes/key_delete"));
app.use("/key_encode", require("./routes/key_encode"));
app.use("/key_search", require("./routes/key_search"));
app.use("/doc_insert", require("./routes/doc_insert"));
app.use("/doc_search", require("./routes/doc_search"));
app.use("/doc_delete", require("./routes/doc_delete"));
app.use("/doc_download", require("./routes/doc_download"));
app.use("/cs", require("./routes/cs"));
app.use("/cs_qna", require("./routes/cs_qna"));
app.use("/dup_check",require("./routes/dup_check"));
app.use("/upload",require("./routes/upload"));
app.use("/404",require("./routes/404"));

// ### v3.0 ~ new ###
app.use("/test",require("./routes/test"));
app.use("/register_page",require("./routes/register_page"));
app.use("/register_page_indiv",require("./routes/register_page_indiv"));
app.use("/register_page_ent",require("./routes/register_page_ent"));
app.use("/degree",require("./routes/degree"));
app.use("/degree_insert",require("./routes/degree_insert"));
app.use("/career", require("./routes/career"));
app.use("/career_insert", require("./routes/career_insert"));
app.use("/career_my", require("./routes/career_my"));
app.use("/career_search", require("./routes/career_search"));
app.use("/cert", require("./routes/cert"));
app.use("/cert_insert", require("./routes/cert_insert"));

// ##### ##### #####

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
  res.redirect("404");
  //next(createError(404));
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
