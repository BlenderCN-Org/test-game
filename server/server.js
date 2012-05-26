"use strict";

var http = require("http"),
    // utilities for working with file paths
    path = require("path"),
    // utilities for accessing the file system
    fs = require("fs");


function getFile(localPath, res) {
    // read the file in and return it, or return a 500 if it can't be read
    fs.readFile(localPath, function(err, contents) {
        if (!err) {
            // use defaults instead of res.writeHead()
            res.end(contents);
        }
        else {
            res.writeHead(500);
            res.end();
        }
    });
}

http.createServer(function(req, res) {
    var filename = "client/";
    if(!path.basename(req.url)) {
        filename += "index.html";
    }
    else {
        filename += req.url;
    }
    
    path.exists(filename, function(exists) {
        if (exists) {
            getFile(filename, res);
        }
        else {
            res.writeHead(404);
            res.end();
        }
    });
}).listen(process.env.PORT);