var rootDirectory = process.argv[2] || __dirname;    // TODO: use configuration parameter
require("http").createServer(function(req, res) {
    var relativePath = require("path").relative(rootDirectory, "." + req.url);
    var body = [];
    req.on('data', function(chunk){
        body.push(chunk);
    }).on('end', function(){
        body = Buffer.concat(body).toString();
        
        switch(req.method){
            case "GET":
                implementation.get(relativePath, function(stream){
                    res.statusCode = 200;
                    stream.pipe(res);
                }, function(){
                    res.statusCode = 404;
                    res.end("");
                });
                return;
            case "PUT":
                implementation.create(relativePath, body, function(){
                    res.statusCode = 200;
                    res.end("");
                }, function(){
                    res.statusCode = 403;
                    res.end("");
                });
                return;
            case "POST":
                implementation.update(relativePath, body, function(){
                    res.statusCode = 200;
                    res.end("");
                }, function(){
                    res.statusCode = 404;
                    res.end("");
                });
                return;
            case "DELETE":
                implementation.remove(relativePath, function(){
                    res.statusCode = 200;
                    res.end("");
                }, function(){
                    res.statusCode = 404;
                    res.end("");
                });
                return;
        }
        
        res.statusCode = 400;
        res.end("");
    });
}).listen(process.env.PORT, process.env.IP);

var implementation = (function Filesystem(){
    var fs = require("fs");
    
    function createDirectoryStructure(dir){
        dir.split('/').reduce(function(prev, curr, i) {
            if(fs.existsSync(prev) === false) { 
                fs.mkdirSync(prev); 
            }
            return prev + '/' + curr;
        });
    }
    
    return {
        get: function(relativePath, success, error){
            if(fs.existsSync(relativePath) && fs.statSync(relativePath).isFile()){
                success(fs.createReadStream(relativePath));
            } else {
                error();
            }
        },
        create: function(relativePath, body, success, error){
            if(fs.existsSync(relativePath)){
                error();
            } else {
                createDirectoryStructure(relativePath);
                fs.writeFile(relativePath, body, success);
            }
        }, 
        update: function(relativePath, body, success, error){
            if(fs.existsSync(relativePath)){
                createDirectoryStructure(relativePath);
                fs.writeFile(relativePath, body, success);
            } else {
                error();
            }
        },
        remove: function(relativePath, success, error){
            if(fs.existsSync(relativePath) && fs.statSync(relativePath).isFile()){
                fs.unlink(relativePath, function(){
                    // TODO: cleanup empty directories
                    success();
                });
            } else {
                error();
            }
        }
    };
})();
