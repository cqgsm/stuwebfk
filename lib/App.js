var http = require("http");
//应用程序基类
function App(){
    //中间件有序列表
    var middleList = this._middleList = [];
    //request 事件响应函数
    function handle(req,res){
        if(middleList.length === 0){
            //没有中间件，什么都不做
        }else {
            //循环执行中间件
            var middleIndex = 0;
            execMiddle();
            //执行这个函数时，会自动执行下一个middle件
            //这个函数的执行，是由插件控制的
            function next(){
                middleIndex++;
                execMiddle();
            };
            //执行中间件函数
            function execMiddle(){
                var middle = middleList[middleIndex];
                if(middle){
                    middle(req,res,next);
                }
            }
        }
    }
    this._server = http.createServer(handle);
}
//加入栈功能
App.prototype.use = function(middle){
    this._middleList.push(middle);
}
//监听端口
App.prototype.listen = function(){
    this._server.listen.apply(this._server,arguments);
}
//导出模块
module.exports = App;
