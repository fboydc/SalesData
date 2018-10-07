var Client = require('ftp');

var c = new Client();




c.on('ready', ()=>{

    c.cwd('/ftp_media/mmc/autorecords', (err, dir)=>{

        if(err){
            console.log('error changing working directory');
            c.end();
            throw err;
        } 
    
        c.list((err, list)=>{
            if(err){
                console.log('error getting directory listing');
                c.end();
            }
            console.log(list[list.length-1]);
        })

        c.end();
    })
    /*c.list((err, list)=>{
        if(err) throw err;
            c.cwd('./', (err, dir)=>{
                if(err)throw err;
                console.log(dir);
                c.end();
            })
        c.end();
    });*/
});

c.connect({host: "192.168.1.150", port: "21", user: "support", password: "iyeastar"});