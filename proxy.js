//定义全局常量
var HOST = '192.168.100.212';
var REQUEST_PORT = 8050;
var LOCAL_SERVER_PORT = 3000;

//引入nodejs的资源
var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');

//声明后台HTTP服务
var server = http.createServer(function (request, response) {
    var _reqmethod = request.method; //前端请求的方式（如 GET POST）
    var _pathname = url.parse(request.url).pathname;//如：/cloudlink-core-framework/login/loginByPassword

    //判断如果是接口访问，则服务请求
    if(_pathname.indexOf("cloudlink-")>-1){
        //配置Nodejs请求参数 
        var options = {  
            host: HOST,  
            port: REQUEST_PORT,  
            path: _pathname,  
            method: _reqmethod,  
            headers: {  
                'Content-Type': 'application/json;charset=utf-8'  
            }  
        };
        //POST 请求
        if(_reqmethod == 'POST'){
            var _params ="";
            //接受Post请求的data的参数
            request.addListener("data", function (data) {
                _params += data;
            });
            //接受Post请求的data的参数的完成事件
            request.addListener("end", function () {
               console.log(_reqmethod+"请求：" + options.host+":"+ options.port+options.path);
               console.log(_reqmethod+"参数(字符串)：" + _params);
               var req = http.request(options, function (res) {  
                    res.setEncoding('utf8');  
                    res.on('data', function (chunk) {  
                        response.writeHead(200, {'Content-Type': 'text/plain'});
                        response.write(chunk);
                        response.end();
                    });  
                }); 
                req.write(_params);  
                req.end();
            });
            return;
        }
        //GET 请求
        else if(_reqmethod == 'GET'){
            var req = http.request(options, function (res) {  
                res.setEncoding('utf8');  
                res.on('data', function (chunk) {  
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write(chunk);
                    response.end();
                });  
            }); 
            req.write();  
            req.end();
        }
    }

    //如果是本地资源请求，则加载资源
    var realPath = path.join("./", _pathname);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + _pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(LOCAL_SERVER_PORT);
console.log("------------------服务开启：" + LOCAL_SERVER_PORT + "----------------------");