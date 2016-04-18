//处理静态路径
var url = require('url');
var fs = require('fs');
//把url转换成资源路径
function urlPath(url_str){
    var urlObj = url.parse(url_str);
    var path = urlObj.path;
    return path;
}
//导出模块
module.exports = function static(parentPath){
    return function(req,res,next) {
        var path = urlPath(req.url);
        function callback(err, data) {
            if (err) {
                res.statusCode = 404;
            } else {
                res.write(data);
            }
            res.end();
        }
        fs.readFile(parentPath+path,"utf8",callback);
    }
}
