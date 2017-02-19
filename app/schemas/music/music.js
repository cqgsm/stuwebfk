'use strict';
var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

//音乐字段定义
var MusicSchema = new Schema({
    title: String,
    altTitle: String,
    singer: String,
    version: String,
    image: String,
    pubdate: String,
    summary: String,
    publisher: String,
    rating: String,
    src: String,
    pv: {
        type: Number,
        default: 0
    },
    musicCategory: {
        type: ObjectId,
        ref: 'MusicCategory'
    },
    meta: {
        createAt: {												// 创建时间
            type: Date,
            default: Date.now()
        },
        updateAt: {												// 更新时间
            type: Date,
            default: Date.now()
        }
    }
});

MusicSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// 静态方法不会与数据库直接交互，需要经过模型编译实例化后才会具有该方法
MusicSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id,cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = MusicSchema;