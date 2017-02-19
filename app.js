var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session'); // session依赖cookie模块
var mongoStore = require('connect-mongo')(session);// 对session进行持久化
var app = express();


// view engine setup
app.set('views', path.join(__dirname, './app/views/pages'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// 对application/json格式进行解析
app.use(bodyParser.json());
// 对application/x-www-form-urlencoded格式内容进行解析
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//使用session,session依赖cookie
app.use(session({
  secret:'sjdlfjlsdjflsdlfjsdlfsdl', // 设置的secret字符串，来计算hash值并放在cookie中
  resave: false,                    // session变化才进行存储
  saveUninitialized: true,
  // 使用mongo对session进行持久化，将session存储进数据库中
  store: new mongoStore({
    url: 'mongodb://127.0.0.1/life', // 本地数据库地址
    collection: 'sessions'          // 存储到mongodb中的字段名
  })
}));

//路由
require('./routes/index')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
