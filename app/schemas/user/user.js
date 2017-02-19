'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'), //加密密码
    SALT = 10;    //密码加盐

//user schema
/*
0:  普通用户
1： 邮件验证用户
2： 专业用户
>10: admin
>50: super admin
*/

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    }, //昵称
    email:{
        unique: true,
        type: String
    }, //邮箱
    password: String, //密码
    avatar: String, //图像
    signature: {
        type: String,
        default: '这家伙很懒，什么个性签名都没有留下。'
    }, //签名
    role: {
        type: Number,
        default: 0
    },// 用户权限
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//模式保存前执行回调函数
//如果当前数据是新创建，则创建时间和更新时间都是当前时间，否则更新时间是当前时间
UserSchema.pre('save',function(next){
    var user = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    //将密码加密
    bcrypt.hash(user.password, SALT, function(err, hash){
        if(err){
            return next(err);
        }
        user.password = hash;
        next();
    })
});

//实例方法
UserSchema.methods = {
    //判断密码是否匹配
    comparePassword: function(password, cb){
        bcrypt.compare(password, this.password, function(err, isMatch){
            if(err){
                return cb(err);
            }
            cb(null, isMatch);
        })
    }
};

//静态方法
UserSchema.statics = {
    fetch: function(cb){
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function(id, cb){
        return this.findOne({_id: id}).exec(cb);
    },
    getUserSignupInfo: function(username, email, cb){
        // 第一个$or表示或者，第二个是查询条件
        var cond = {'$or':[{username: username},{email: email}]};
        return this.find(cond).exec(cb);
    }
};

module.exports = UserSchema;
