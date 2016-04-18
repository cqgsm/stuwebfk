var http = require("http"); //获得http对象。
var fs = require("fs"); // 引入文件模块
var url = require("url");//url模块

var server = http.createServer();//创建一个http.Server实例
server.on("request",handle);//当有客户端访问的时候，创建一个request请求，并调用handle处理

/*
* request : 只读流 --> http.incomingMessage(翻译：外来信息) 类型
* response：可写流---> http.ServerResponse 类型
* */
//同步读文件
//function handle(request,response){
//    var data = fs.readFileSync(__dirname+"/public/index.html");//读完文档数据并返回，程序才能继续
//    response.write(data);//向浏览器端写入数据
//    response.end();//结束响应
//};

//把url转换成资源路径
function urlPath(url_str){
    var urlObj = url.parse(url_str);//把url信息封装成json对象
    var path = urlObj.path;//得到路径信息
    return path;
};
//异步读文件(推荐性能高)
function handle(request,response){
    function callback(err,data){
        if(err) {
            response.statusCode=404
        }else {
            response.write(data);
        }
        response.end();
    };
    var path = urlPath(request.url);
    if(path!=='/favicon.ico'){
        fs.readFile(__dirname+"/public"+path,'utf8',callback);
    }
};





server.listen(3000);