var crypto = require('crypto');

//验证昵称
exports.validateName = function (str) {
    return (/^[a-zA-Z0-9\u4e00-\u9fa5]+$/).test(str);
};

//加密密码md5
exports.encrypt = function(pass){
    return crypto.createHash('md5').update(pass).digest('hex');
};
