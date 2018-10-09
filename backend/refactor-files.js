var mysql = require('./mySQL/mySQL-pbx-connection');
var fs = require("fs");
const _ROOT = "/Volumes/WUBSA/temp-voicefiles";

mysql.query("SELECT src, dst, datetime, duration, recordfile, calltype FROM cdr_201810 where recordfile <>  '' AND datetime >= CURDATE();").then(data=>{
    data.forEach((item)=>{
        //console.log("calltype", item.calltype);
        fs.rename(_ROOT+"/"+item.recordfile, _ROOT+"/"+item.calltype+"/"+item.src+"/"+item.recordfile, (err)=>{
            if(err){
                console.log("error", err);
            }
            console.log("refactored files");

            
        });
        /*if(!fs.existsSync(_ROOT+"/"+item.calltype)){
            console.log("creating directory: " + item.calltype);
            fs.mkdir(_ROOT+"/"+item.calltype, (err)=>{
                console.log("err", err);
            });
        }*/   
    })
})



