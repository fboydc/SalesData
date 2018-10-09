var mysql = require('mysql');

var con = mysql.createConnection({
    host: "192.168.1.150",
    user: "admin",
    password: "Biomat2018",
    database: "cdr"
});


var executeQuery = (query)=>{
    return new Promise((resolve, reject)=>{
        con.connect((err)=>{
            if(err) throw err;
            con.query(query, (err, result)=>{
                if(err) throw err;
                con.end();
                resolve(result);
            })
          })
    })
    
}

module.exports = {
    query: executeQuery
}