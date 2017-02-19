'use strict';
//user model
var User = require('../../models/user/user');
var validator = require('validator');
var tools = require('../../common/tool');
//加载验证码模块
var ccap = require('ccap')();
var captcha;



/* 用户注册及登录框中验证码生成器控制器 */
//https://npm.taobao.org/package/ccap
exports.captchaa = function (req, res) {
    //过滤掉小图标
    if(req.url == '/favicon.ico'){
        return response.end('');
    }
    var ary = ccap.get();
    var txt = ary[0];
    captcha = ary[1];
    console.log(txt);
    res.end(captcha);
}


//注册页面控制器
exports.signup = function (req, res) {
    var user = req.body.user;
    //先验证提交的信息符不符合规则
    var username = validator.trim(user.name);
    var password = validator.trim(user.password);
    var rePassword = validator.trim(user.rePassword);
    var email = validator.trim(user.email);
    //提交的信息只要有一个空，就返回错误信息
    var hasEmptyInfo = [username, password, rePassword, email].some(function (item) {
        return item === '';
    });
    //检测两次密码是否一致
    var passwordDiff = password !== rePassword;
    if (hasEmptyInfo) {
        return res.json({'error':"注册信息不能为空哦！"});
    }
    if (passwordDiff) {
        return res.json({'error':"两次密码不一致！"});
    }
    if (password.length < 6) {
        return res.json({'error':'密码要大于6位'});
    }
    if (username.length < 2 || username.length > 15) {
        return res.json({'error':'请输入用户名5到15个字符'});
    }
    if (!tools.validateName(username)) {
        return res.json({'error':'用户名不合法'});
    }
    if (!validator.isEmail(email)) {
        return res.json({'error':'邮箱不合法'});
    }
    //使用findOne
    User.getUserSignupInfo(username, email, function (err, users) {
        if (err) {
            return res.json({'error':'获取用户数据失败'});
        }
        //>0 就表示存在已经有用户用 该名字 和邮箱注册了
        if (users.length > 0) {
            return res.json({'error':'用户名或者邮箱被占用了'});
        }
        //将用户插入数据库
        var nweuser = new User({
            name: username,
            email: email,
            password: password,
            avatar: ''
        });
        nweuser.save(function (err, user) {
            if (err) {
                return res.json({'error':'注册失败'});
            }
            req.session.user = user;
            return res.json({'success':'恭喜您注册成功'});
        })
    });
};
//注册页面渲染
exports.showSignup = function (req, res) {
    res.render('user/signUp', {
        title: '注册页面',
        login: ''
    });
}

//用户登录控制器
exports.signin = function (req, res) {
    var user = req.body.user;
    var email = validator.trim(user.email);
    var password = validator.trim(user.password);
    var _captcha = validator.trim(user.captcha);
    //判断邮箱
    if (!validator.isEmail(email)) {
        return res.json({'error':'您输入的邮箱不合法'});
    }
    //判断密码
    if (password.length < 6) {
        return res.json({'error':'密码要大于6位'});
    }
    //验证码必填
    if(_captcha){
        return res.json({'error':'验证码必填'});
    }

    User.findOne({email: email}, function (err, user) {
        if (err) {
            return res.json({'error':'没有该用户'})
        }
        //核对密码
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return res.json({'error':'密码比对失败'});
            }
            if (isMatch) {
                if(captcha){
                    //验证码
                    if(_captcha.toLowerCase() !== captcha.toLowerCase() ){
                        //提交的和生成的验证码不一样
                        return res.json({'error':'验证码输入错误'});
                    }else{
                        //登录成功
                        req.session.user = user;
                        return res.json({'success':'恭喜您，登录成功'});
                    }
                }
            } else {
                return res.json({'error': '密码错误'});
            }

        })
    });
};
/* 用户登录页面渲染控制器 */
exports.showSignin = function(req,res)  {
    res.render('user/signin',{
        title:'登录页面',
        login:''
    });
};

/* 用户登出控制器 */
exports.logout = function(req,res) {
    delete req.session.user;
    res.redirect('/');
};

//判断用户是否登录的中间件，登录才能回复
exports.signinRequired = function(req, res, next){
    var _user = req.session.user;
    if(!_user){
        return res.redirect('/signin');
    }
    next();
};

//用户权限控制
exports.adminRequired = function(req, res, next){
    var _user = req.session.user;
    if(_user && _user.role <= 10){
        res.json({'error':'您不是管理员'});
    }
    next();
}