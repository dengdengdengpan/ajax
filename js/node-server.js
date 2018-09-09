const http = require('http'),
    path = require('path'),
    fs = require('fs'),
    url = require('url'),
    mime = require('./mime').types;

let server = http.createServer(function(request,response) {
    simpleRouterPath(request,response);
});
server.listen(9000);

function staticRoot(staticPath,request,response) {
    let pathObj = url.parse(request.url,true);

    if (pathObj.pathname === '/') {
        pathObj.pathname += 'index.html';
    }

    let ext = path.extname(pathObj.pathname);
    ext = ext ? ext.slice(1) : 'unkown';

    let filePath = path.join(staticPath,pathObj.pathname),
        contentType = mime[ext] || 'text/plain';

    fs.readFile(filePath,'binary',function(error,fileContent) {
        if (error) {
            response.writeHead(404,'Not Found');
            response.end('<h1>Not Found</h1>');
        } else {
            response.writeHead(200,'OK',{ 'Content-Type': contentType });
            response.write(fileContent,'binary');
            response.end();
        }
    });
}

function simpleRouterPath(request,response) {
    let pathObj = url.parse(request.url,true);

    switch (pathObj.pathname) {
        case '/loadMore':
            //模拟网速很慢的情况
            setTimeout(function() {
                response.end(JSON.stringify(createNewsData(pathObj)));
            }, (Math.random() * 10) * 1000);
            break;
        default:
            staticRoot(path.dirname(__dirname),request,response);
    }
}


function createNewsData(pathObject) {
    /**
     *console.log(pathObject.query);
     *{ curIndex: '0', length: '5' }
     */
    let curIdx = pathObject.query.index,
        len = pathObject.query.length,
        data = [];data = [];
    // console.log(typeof curIdx); // string
    // console.log(typeof len); // string
    for (let i = 0; i < len; i++) {
        data.push(`新闻 ${parseInt(curIdx) + i}`);
    }
    return data;
}