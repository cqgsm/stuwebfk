'use strict';

var User = require('../app/controllers/user/user'); //用户控制器


module.exports = function (app) {
    //用户登录处理，保存到全局变量
    app.use(function(req, res, next){
       app.locals.user = req.session.user;
        next();
    });
/*==================公共路由======================*/
    //用户注册路由
    app.get('/signUp', User.showSignup);
    app.post('/user/signup', User.signup);
    //用户登录路由
    app.get('/signin', User.showSignin);
    app.post('/user/signin', User.signin);
    //用户注销路由
    app.get('/logout', User.logout);
    //验证码路由
    app.get('/captcha', User.captchaa);





    app.get('/', function (req, res) {
        res.render('index', {
            title: '欢迎来到首页',
            login: ''
        });
    });

    app.get('/signin', function (req, res) {
        res.render('user/signin',{
            title: '欢迎来到登录页',
            login: ''
        });
    });


    app.get('/signup', function (req, res) {
        res.render('user/signup',{
            title: '欢迎来到注册页',
            login: ''
        });
    });
};
