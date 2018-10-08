var Client = require('ftp');
var Promise = require('promise'); 
var fs = require('fs');

const _LIVE_HOST = {
    ip: '192.168.1.150',
    port: '21',
    user: 'support',
    password: 'iyeastar',
    working_directory: '/ftp_media/mmc/autorecords'
};


const _TESTING_HOST = {
    ip: '192.168.1.149',
    port: '21',
    user: 'felipe',
    password: 'f6365174',
    working_directory: './'
}


const _CURRENT_HOST = _TESTING_HOST;


var c = new Client();



const getFileList = ()=>{
    return new Promise((resolve,reject)=>{
        c.list((err, list)=>{
            if(err) reject(err);
            resolve(list);
        })
    })
}

const getFilesFromSource = ()=>{
    return new Promise((resolve, reject)=>{
        c.on('ready', ()=>{

            getFileList().then((result)=>{
                return new Promise((resolve, reject)=>{
                    if(result){
                        
                        c.cwd(result[result.length-1].name, (err, currentDir)=>{
                            if(err)
                                resolve(err);
                            
                            c.list((err, list)=>{
                                if(err)
                                    resolve(err);
                                
                                resolve(list);
                            })
                        })
                    }
                })
                
            }).then(data=>{
                    if(typeof data === 'error'){
                        throw data;
                        
                    }
                        
                    copyFiles(data).then(result=>{
                        if(result){
                            resolve(true)
                        }else{
                            resolve(err);
                        }
                        
                    })

                    c.end();
                   
                   
            });
        
        });

        c.connect({host: _CURRENT_HOST.ip, port: _CURRENT_HOST.port, user: _CURRENT_HOST.user, password: _CURRENT_HOST.password});
    });
}


const copyFiles = (files)=>{
    //const fileStream = [];
    return new Promise((resolve, reject)=>{
        console.log("Getting all sound files...")
        files.forEach((item, index)=>{
                    
                c.get(item.name, (err, stream)=>{
                    if(err){
                        resolve(err);
                    }
                    console.log("copying file to destination - ", item.name+"..."); 
                    /*
                       PIPING TO S3 BUCKET SHOULD GO IN HERE (USE STREAM PASSTHROUGH FUNCTION)
                       search: https://stackoverflow.com/questions/37336050/pipe-a-stream-to-s3-upload
                    */
                    stream.pipe(fs.createWriteStream('./output/'+item.name));
                    if(index === files.length - 1){
                        resolve(true)
                    }
                   
                 });
            
        })
    })
}






getFilesFromSource().then(result=>{
    if(result)
        console.log("All files transfered succesfully");
    else
        throw result;
   /* data.forEach((stream, index)=>{
        console.log("index", index);
        console.log("stream", stream);
      //stream.pipe(fs.createWriteStream("./output/"+index+".wav"))
    })*/
})





