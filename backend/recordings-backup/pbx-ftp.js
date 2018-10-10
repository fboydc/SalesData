var Client = require('ftp');
var Promise = require('promise'); 
var fs = require('fs');



var getAllFiles = (source, temp_storage)=>{

    const c = new Client();

    return new Promise((resolve, reject)=>{
        c.on('ready', ()=>{
            
            c.cwd(source.working_directory, (err, dir)=>{
                if(err)
                    resolve(err)
                c.list((err, list)=>{
                    resolve(list)
                })
                
            })
            
        })
     c.connect({host: source.ip, port: source.port, user: source.user, password: source.password});

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
                        stream.pipe(fs.createWriteStream(temp_storage + "/"+file.name).on("finish",()=>{
                            console.log("copied file "+file.name)+" into destination...";
                            if(index === files.length - 1){
                                resolve(true);
                            }
                            c.end();
                        }));
                       
                    });
                    
                })

            })
                
        });
        
    })
   
}  

module.exports = {
    fetchFiles: getAllFiles
}

