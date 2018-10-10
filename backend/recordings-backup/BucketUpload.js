var AWS = require('aws-sdk');
var fs = require("fs");


const uploadAll = (path, aws_config)=>{

    AWS.config.loadFromPath(aws_config);


    let s3 = new AWS.S3();

    const _DATE_TODAY = new Date();
    const year = _DATE_TODAY.getFullYear()
    const month = _DATE_TODAY.getMonth() + 1;
    const day = _DATE_TODAY.getDate();

    const dirname = year+""+month+""+day;

    return new Promise((resolve, reject)=>{
        fs.readdir(path,(err, files)=>{
            files.forEach((file, index)=>{
                
                
                s3.putObject({Bucket:"wavfilestreamtest", Key: dirname})
                fs.readFile(path+"/"+file, (err, data)=>{
    
                    s3.upload({Bucket: "wavfilestreamtest", Key: dirname+"/"+file, ContentType: "audio/wav", Body: data }, (err, data)=>{
                        if(err)throw err;
                        console.log("uploaded file - " + file);
                        console.log(data);
                        if(index === files.length-1)
                            resolve(true);
                    });
                })
            })
        })
    });
    
}

module.exports = {
    uploadFiles: uploadAll
}




