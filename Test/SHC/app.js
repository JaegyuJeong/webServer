var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var app = express();

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
app.use('/services',require('./routes/services'));
app.use('/catalogue',require('./routes/catalogue'));
app.use('/pricing',require('./routes/pricing'));
app.use('/contacts',require('./routes/contacts'));

app.use('/member_insert',require('./routes/member_insert'));
app.use('/login',require('./routes/login'));
app.use('/logout',require('./routes/logout'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
