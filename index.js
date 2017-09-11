var path = require("path");
var fs = require("fs");

var rootDirectory = __dirname;    // TODO: use configuration parameter

require("http").createServer(function(req, res) {
    var relativePath = path.relative(rootDirectory, "." + req.url);
    console.log(relativePath);
    
    switch(req.method){
        case "GET":
            if(fs.existsSync(relativePath) && fs.statSync(relativePath).isFile()){
                res.statusCode = 200;
                fs.createReadStream(relativePath).pipe(res);
            } else {
                res.statusCode = 404;
                res.end("");
            }
            return;
        case "PUT":
            if(fs.existsSync(relativePath)){
                res.statusCode = 403;
                res.end("");
            } else {
                var body = [];
                req.on('data', function(chunk){
                    body.push(chunk);
                }).on('end', function(){
                    body = Buffer.concat(body).toString();
                    createDirectoryStructure(relativePath);
                    fs.writeFile(relativePath, body, function(){
                        res.statusCode = 200;
                        res.end("");
                    });
                });
            }
            return;
        case "POST":
            if(fs.existsSync(relativePath)){
                var body = [];
                req.on('data', function(chunk){
                    body.push(chunk);
                }).on('end', function(){
                    body = Buffer.concat(body).toString();
                    createDirectoryStructure(relativePath);
                    fs.writeFile(relativePath, body, function(){
                        res.statusCode = 200;
                        res.end("");
                    });
                });
            } else {
                res.statusCode = 404;
                res.end("");
            }
            return;
        case "DELETE":
            if(fs.existsSync(relativePath) && fs.statSync(relativePath).isFile()){
                fs.unlink(relativePath, function(){
                    // TODO: cleanup empty directories
                    res.statusCode = 200;
                    res.end("");
                });
            } else {
                res.statusCode = 404;
                res.end("");
            }
            return;
    }
    
    res.statusCode = 400;
    res.end("");
}).listen(process.env.PORT, process.env.IP);


function createDirectoryStructure(dir){
    dir.split('/').reduce(function(prev, curr, i) {
        if(fs.existsSync(prev) === false) { 
            fs.mkdirSync(prev); 
        }
        return prev + '/' + curr;
    });
}
