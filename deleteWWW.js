var fs = require('fs');
var path = require('path');
var child_process = require('child_process')

var wPath = path.join(path.parse(process.argv[1]).dir,'www');

var deleteFolder = function (spath,callback) {
    var files = [];
    if( fs.existsSync(spath) ) {

        files = fs.readdirSync(spath);
        if(files.indexOf('.svn') !== -1){
            files.splice(files.indexOf('.svn'),1);
            var isCanBeDeleted = false;
        }else{
            var isCanBeDeleted = true;
        }

        files.forEach(function(file,index){
            var curPath = path.join(spath,file);
            if(fs.statSync(curPath).isDirectory()) { // 是否为目录
                deleteFolder(curPath); //递归
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        isCanBeDeleted && fs.rmdirSync(spath);

        if(callback){
            callback(spath);
        }
    }else{
        console.log('err')
    }
}

deleteFolder(wPath,function(){
    console.log('清空文件完成，正在进行压缩打包...');
    var s1 = child_process.exec('npm run all');
    s1.stdout.on('data',function(data){
        console.log('正在压缩...' + data);
    })
    s1.on('exit',function(code,signal){
        console.log('压缩完毕');
    })
});