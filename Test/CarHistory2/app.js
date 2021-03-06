var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var sequelizer=require('./models').sequelize;

var app = express();
sequelizer.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('아 취업하고시파다'));
app.use(session({resave:false, // 재할당
  saveUninitialized:false,
  secret:'아 취업하고시파다',
  cookie:{
    httpOnly:true,
    secure:false
  }
}));



app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/member_insert', require('./routes/member_insert'));
app.use('/login',require('./routes/login'));
app.use('/logout',require('./routes/logout'));
app.use('/search_carinfo_template',require('./routes/search_carinfo_template'));
app.use('/search_carinfo',require('./routes/search_carinfo'));
app.use('/update_carinfo',require('./routes/update_carinfo'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.error(err.stack);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
