var Client = require('ftp');
var Promise = require('promise'); 
var fs = require('fs');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-cred.json');

const _LIVE_HOST = {
    ip: '192.168.1.150',
    port: '21',
    user: 'support',
    password: 'iyeastar',
    working_directory: '/ftp_media/mmc/autorecords'
};

const _TEMP_STORAGE = "/Volumes/WUBSA/temp-voicefiles";


const _CURRENT_HOST = _LIVE_HOST;

const c = new Client();

let s3 = new AWS.S3();



const navigateToWorkingDirectory = ()=>{

    return new Promise((resolve, reject)=>{
        c.on('ready', ()=>{
            
            c.cwd(_CURRENT_HOST.working_directory, (err, dir)=>{
                if(err)
                    resolve(err)
                c.list((err, list)=>{
                    resolve(list)
                })
                
            })
            
        })
     c.connect({host: _CURRENT_HOST.ip, port: _CURRENT_HOST.port, user: _CURRENT_HOST.user, password: _CURRENT_HOST.password});

    }).then(list=>{
        
        return new Promise((resolve, reject)=>{
            c.cwd(list[list.length-1].name, (err, dir)=>{
                if(err)
                    throw err;
                c.list((err, list)=>{
                    resolve(list);
                })
            })
        }).then(files=>{
            return new Promise((resolve, reject)=>{
                console.log("downloading files ");
                files.forEach((file, index)=>{
                    c.get(file.name, (err, stream)=>{
                        if(err) throw err;
                        stream.pipe(fs.createWriteStream(_TEMP_STORAGE + "/"+file.name).on("finish",()=>{
                            console.log("copied file "+file.name)+" into destination...";
                            if(index === files.length - 1){
                                resolve(true);
                            }
                        }));
                       
                    });
                    
                })

            })
            

            
        });
        
    })
   
}  


navigateToWorkingDirectory().then(ok=>{
    c.end();
    if(ok)
        console.log("done");
})