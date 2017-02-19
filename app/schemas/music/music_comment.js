'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

//音乐的评论

var MusicCommentSchema = new Schema({
    // type为ObjectID为了实现关联文档的查询，评论结构简单
    music: {
        type: ObjectId,
        ref: 'Music'
    },
    reply: [{
        from: {             //谁回复的
            type: ObjectId,
            ref: 'User'
        },
        to: {                //被回复人
            type: ObjectId,
            ref: 'User'
        }
    }],
    content: String,
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


MusicCommentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// 静态方法不会与数据库直接交互，需要经过模型编译实例化后才会具有该方法
MusicCommentSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = MusicCommentSchema;
