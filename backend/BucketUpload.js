var AWS = require('aws-sdk');
var fs = require("fs");

AWS.config.loadFromPath('./aws-cred.json');

let s3 = new AWS.S3();

const origin = "/Volumes/WUBSA/temp-voicefiles";





const getDirContents = (path)=>{
    fs.readdir(path, (err, files)=>{
        files.forEach((file, index)=>{
            
        })
    })
}


getDirContents(origin);
