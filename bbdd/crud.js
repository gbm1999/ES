var mysql      = require('mysql2')

var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    multipleStatements: true
  })

function registro (name, email,password){

      connection.connect(function(err)
      {
        let sql = "INSERT INTO users (name, email, password) VALUES ('"+name + "', '"+email +"', '" +password + "')";
        connection.query(sql, function(err, result)
        {
          if(err) throw err;
          return true;
        })
      });
}

function log(email, callback){

    connection.connect(function(err)
    {
      if(err) throw err;
      let sql = "SELECT NAme, PASSWORD FROM users WHERE EMAIL='" + email + "'";
      connection.query(sql, function(err, result)
      {
        if(err){throw err;}
        else{callback(result)}

      })});
};

module.export = {registro , log};