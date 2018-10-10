var pbx = require('./pbx-ftp.js');
var uploader = require('./BucketUpload.js');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync("config.json"));
var schedule = require('node-schedule');

const _SOURCE = config.sources.live_source;
const _TEMP_STORAGE = config.temp_storage.path;
const aws_config = config.destination.aws.aws_config_file_path;




const runBackup = ()=>{
    pbx.fetchFiles(_SOURCE, _TEMP_STORAGE).then(ok=>{
        if(ok)
            uploader.uploadFiles(_TEMP_STORAGE, aws_config).then(ok=>{
                if(ok)
                    console.log("uploaded all files successfully");
            })
    });
}

schedule.scheduleJob('00 18 * * * ', ()=>{
    runBackup();
})
