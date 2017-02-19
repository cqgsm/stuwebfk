'use stric';
//音乐分类
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var musicCategorySchema = new Schema({
    name: String,
    musics: [{type: ObjectId, ref: 'Music'}],
    programme: [{type: ObjectId, ref: 'Programme'}],
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

musicCategorySchema.pre('save', function(next){
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
    next();
});

MusicCategorySchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = MusicCategorySchema;

