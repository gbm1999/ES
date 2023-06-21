require("dotenv").config()

const port = process.env.PORT;
const express = require('express')
const app = express()
const path = require('path')

var fs = require('fs')
const crypto = require("crypto");
const jwt = require('jsonwebtoken')

let refreshTokens = []

var count = 0;
var count2 = 0;
var count3 = 0;
var di = './memory';
fs.readdir(di, (err, files) => {
  count = (files.length);
});

di = './uploads';
fs.readdir(di, (err, files) => {
  count2 = (files.length);
});

di = './tasks';
fs.readdir(di, (err, files) => {
  count3 = (files.length);
});

const passphrase = process.env.ACCESS_TOKEN_SECRET;

app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

app.get('/',function(req,res){
    var options = {
      root: path.join(__dirname)
    }
    res.sendFile('index.html', options)
})

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.post('/login', function(req, res)
{
  let data 
const dir = './memory';

fs.readdir(dir, (err, files) => {
  count = (files.length);
});
  for(let i = 0; i < count; i++){
    data = fs.readFileSync('./memory/register' + i + '.json', 'utf8');
    if(data.includes(req.body.email )){
      break;
    }

  }

  console.log(data);

  if (!data || !data.includes(req.body.email )) return [];
  else {
    /** 
    const file = JSON.parse(data);
    console.log(file);
    res.send(file);
    */
    const username = req.body.email
    const user = { name: username }
  
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  }

});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

// Using a function generateKeyFiles
function generateKeyFiles(password) {
  var keyPair= crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
          passphrase: password
      },
      privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: password
      }
  });
  return keyPair;
}


app.post('/register', function(req, res)
{
      //Generamos claves privada y publica de B
      console.log({publicKey, privateKey} = generateKeyFiles(req.body.email ));


            var objeto = {
              nombre: req.body.name ,
              email: req.body.email ,
              password: req.body.passwd,
              publicKey: publicKey,
          };
          //Reiniciamos
          console.log(objeto)
          var json = JSON.stringify(objeto);
  
          // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
          console.log(json);
          fs.writeFileSync('./memory/register' + count + '.json', JSON.stringify(json));

                    // Creating public key and private key
          fs.writeFileSync('./publicKeys/public' + count + '.key.pem' , publicKey);
          fs.writeFileSync('./privateKeys/private' + count + '.key' , privateKey);

          let dir = './memory';  
          fs.readdir(dir, (err, files) => {
            count = (files.length);
          });
  
          console.log("User registered");
          res.redirect('archives.html?email=' + req.body.email);
})

/*
  ARCHIVOS - CRUD 
*/

app.post('/upload', function(req, res)
{

    //A encripta con la clave pública de B
  
    const encrypt = (text, pkPath) => {
      return new Promise((resolve, reject) => {
        const absPkPath = path.resolve(pkPath)
        fs.readFile(absPkPath, 'utf8', (err, pk) => {
          if (err) {
            return reject(err)
          }    
          const buffer = Buffer.from(text)
          const encrypted = crypto.publicEncrypt(pk, buffer)
          resolve(encrypted.toString('base64'))
        })
      })
    }

              // Crear el objeto con los datos del archivo y su contenido cifrado
              var objeto = {
                nombre: req.body.name ,
                desc: req.body.desc,
                date: req.body.date,
                user: req.body.user,
            };
            console.log(req.body);
            var json = JSON.stringify(objeto);

            let data 
            const dir = './memory';
            
            fs.readdir(dir, (err, files) => {
              count = (files.length);
            });
            var pubKey = "";
              for(let i = 0; i < count; i++){
                data = fs.readFileSync('./memory/register' + i + '.json', 'utf8');
                if(data.includes(req.body.user )){
                  pubKey = './publicKeys/public' + i + '.key.pem';
                }
            
              }
    
            // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
            //console.log(json);
            console.log(pubKey);
            encrypt(JSON.stringify(json), pubKey)
            .then(str => {

              let objeto2 = {
                file: str.toString(),
                user: req.body.user,
            };
            var json = JSON.stringify(objeto2);
              fs.writeFileSync('./uploads/files' + count2 + '.json', JSON.stringify(json));
              const dir = './uploads';
      
              fs.readdir(dir, (err, files) => {
                count2 = (files.length);
              });
            })
            .catch(err => console.log(err))


            
})
app.post('/uploadTask', function(req, res)
{

    //A encripta con la clave pública de B
  
    const encrypt = (text, pkPath) => {
      return new Promise((resolve, reject) => {
        const absPkPath = path.resolve(pkPath)
        fs.readFile(absPkPath, 'utf8', (err, pk) => {
          if (err) {
            return reject(err)
          }    
          const buffer = Buffer.from(text)
          const encrypted = crypto.publicEncrypt(pk, buffer)
          resolve(encrypted.toString('base64'))
        })
      })
    }

    // Crear el objeto con los datos del archivo y su contenido cifrado
    var objeto = {
        nombre: req.body.name ,
        tasks: req.body.tasks ,
        user: req.body.user
    };

    var json = JSON.stringify(objeto);

    var pubKey = "";
    for(let i = 0; i < count; i++){
      data = fs.readFileSync('./memory/register' + i + '.json', 'utf8');
      if(data.includes(req.body.user )){
        pubKey = './publicKeys/public' + i + '.key.pem';
      }
  
    }
    // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente

    console.log(JSON.stringify(json))
    JSON.stringify(pubKey)
    encrypt(JSON.stringify(json), pubKey)
    .then(str =>{console.log(str)
      let objeto2 = {
        file: str.toString(),
        user: req.body.user,
    };
    var json = JSON.stringify(objeto2);
      fs.writeFileSync('./tasks/task' + count3 + '.json', JSON.stringify(json));
      const dir = './tasks';
  
      fs.readdir(dir, (err, files) => {
        count3 = (files.length);
      });
    } )
    .catch(err => console.log(err))
})

app.post('/getTask', function(req, res)
{

  let data = []; 
  let dir = './uploads';
  console.log("2");
  console.log(req.body);

  const decrypt = (text, privateKeyPath, passphrase) => {

    //B desencripta con la clave privada de B
    return new Promise((resolve, reject) => {
      const p = path.resolve(privateKeyPath)
      fs.readFile(p, 'utf8', (err, pk) => {
        if (err) {
          return reject(err)
        }
  
        const buffer = Buffer.from(text, 'base64')
        const decrypted = crypto.privateDecrypt({
          key: pk.toString(),
          passphrase
        }, buffer)
  
        resolve(decrypted.toString('utf8'))
      })
    })
  }
  
  dir = './tasks';
  
  fs.readdir(dir, (err, files) => {
    count3 = (files.length);
  });
  for(let j = 0; j < count; j++){
    memo = JSON.parse(fs.readFileSync('./memory/register' + j + '.json', 'utf8'));
    for(let i = 0; i < count3; i++){
      dataEncrypt = fs.readFileSync('./tasks/task' + i + '.json', 'utf8');
      dataEncrypt= JSON.parse(dataEncrypt)
      if(!memo.includes(req.body.user ) || !dataEncrypt.includes(req.body.user )){

      }
      else{
      dataEncrypt= JSON.parse(dataEncrypt)
      privateKey = './privateKeys/private' + j + '.key'; 
      decrypt(dataEncrypt.file, privateKey, req.body.user) //(contenido encriptado, clave privada, env.token.secret)
      .then(str => 
        {console.log(str)
            const file = JSON.parse(str);
            if(file.includes(req.body.user )){
              console.log(file);
              res.send(file);
            }
      })
      .catch(err => console.log(err))
    }
  }
  } 
})

app.post('/archive', function(req, res)
{
    let data = []; 
    const dir = './uploads';
    console.log("2");
    


    const decrypt = (text, privateKeyPath, passphrase) => {

      //B desencripta con la clave privada de B
      return new Promise((resolve, reject) => {
        const p = path.resolve(privateKeyPath)
        fs.readFile(p, 'utf8', (err, pk) => {
          if (err) {
            return reject(err)
          }
    
          const buffer = Buffer.from(text, 'base64')
          const decrypted = crypto.privateDecrypt({
            key: pk.toString(),
            passphrase
          }, buffer)
    
          resolve(decrypted.toString('utf8'))
        })
      })
    }
    fs.readdir(dir, (err, files) => {
      count2 = (files.length);
    }); 
    for(let j = 0; j < count; j++){
      memo = JSON.parse(fs.readFileSync('./memory/register' + j + '.json', 'utf8'));
      for(let i = 0; i < count2; i++){
        var dataEncrypt = JSON.parse(fs.readFileSync('./uploads/files' + i + '.json', 'utf8'));
        if(!memo.includes(req.body.user ) || !dataEncrypt.includes(req.body.user )){
          console.log(memo);
          console.log(req.body.user );

        }
        else{
        privateKey = './privateKeys/private' + j + '.key';
        dataEncrypt= JSON.parse(dataEncrypt)
        decrypt(dataEncrypt.file, privateKey, req.body.user) //(contenido encriptado, clave privada, env.token.secret)
        .then(str => 
          {console.log(str)
              const file = JSON.parse(str);
              if(file.includes(req.body.user )){
                console.log(file);
                res.send(file);
              }
        })
        .catch(err => console.log(err))
      }
      }
    } 
})
      
// Redirigir la salida de la consola a un archivo
const consoleOutputFile = fs.createWriteStream('./logs/console_output.txt');
console.log = function(message) {
  consoleOutputFile.write(message + '\n');
};


app.listen(port, function(){
  console.log(`Servidor iniciado en el puerto: ${port}`);
});
