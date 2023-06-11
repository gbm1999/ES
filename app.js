require("dotenv").config()

const port = process.env.PORT;
const express = require('express')
const app = express()
const path = require('path')

var fs = require('fs')
var https = require('https')
const crypto = require("crypto");

var count = 0;
var count2 = 0;
var count3 = 0;

var enncrypt = [];
var deecrypt;
const passphrase = process.env.ACCESS_TOKEN_SECRET;

app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

app.get('/',function(req,res){
    var options = {
      root: path.join(__dirname)
    }
    res.sendFile('index.html', options)
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
    const file = JSON.parse(data);
    console.log(file);
    res.send(file);
  }

});


app.post('/register', function(req, res)
{

      console.log("User registered");
      res.redirect('archives.html ?id=" + this.id "');

      //Generamos clave privada de B
      const encrypt = (text) => {
        //generate encryption key using the secret. (env.token.secret)
        crypto.scrypt(passphrase, 'salt', 24, (err, key) => {
          if (err) throw err;
      
          //create an initialization vector
          crypto.randomFill(new Uint8Array(16), (err, iv) => {
            if (err) throw err;
      
            const cipher = crypto.createCipheriv(algorithm, key, iv);
      
            let encrypted = '';
            cipher.setEncoding('hex');
      
            cipher.on('data', (chunk) => encrypted += chunk);
            cipher.on('end', () => console.log(encrypted))
            cipher.on('error', (err) => console.log(err))
      
            cipher.write(text);
            cipher.end();
          });
        });
      }
      var privateKey = encrypt(req.body.passwd);


          // Crear el objeto con los datos del archivo y su contenido cifrado
          var objeto = {
            nombre: req.body.name ,
            email: req.body.email ,
            password: req.body.passwd,
            privateKey: privateKey,
        };

        var json = JSON.stringify(objeto);

        // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
        console.log(json);
        fs.writeFileSync('./memory/register' + count + '.json', JSON.stringify(json));
        const dir = './memory';

        fs.readdir(dir, (err, files) => {
          count = (files.length);
        });
})

/*
  ARCHIVOS - CRUD 
*/

app.post('/upload', function(req, res)
{

              // Crear el objeto con los datos del archivo y su contenido cifrado
              var objeto = {
                nombre: req.body.name ,
                files: req.body.file['files'] ,
                user: req.body.user,
            };
            console.log(req.body);
            var json = JSON.stringify(objeto);
    
            // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
            //console.log(json);
            fs.writeFileSync('./uploads/files' + count2 + '.json', JSON.stringify(json));
            const dir = './uploads';
    
            fs.readdir(dir, (err, files) => {
              count2 = (files.length);
            });
})

app.post('/uploadTask', function(req, res)
{

              // Crear el objeto con los datos del archivo y su contenido cifrado
              var objeto = {
                nombre: req.body.name ,
                tasks: req.body.tasks ,
                user: req.body.user
            };
    
            var json = JSON.stringify(objeto);
    
            // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
            console.log(json);
            fs.writeFileSync('./tasks/task' + count3 + '.json', JSON.stringify(json));
            const dir = './tasks';
    
            fs.readdir(dir, (err, files) => {
              count3 = (files.length);
            });


  const crypto = require("crypto");

  const algorithm = "aes-192-cbc";

  //A encripta con la clave pública de B
  
  const encrypt = (text, pkPath) => {
    return new Promise((resolve, reject) => {
      const absPkPath = path.resolve(pkPath)
      fs.readFile(absPkPath, 'utf8', (err, pk) => {
        if (err) {
          return reject(err)
        }
  
        const buffer = Buffer.from(text, 'utf8')
        const encrypted = crypto.publicEncrypt(pk, buffer)
        resolve(encrypted.toString('base64'))
      })
    })
  }
  
  
  enncrypt[encrypt.length] = encrypt(JSON.stringify(json), "public.key.pem")
    .then(str => console.log(str))
    .catch(err => console.log(err))
  
  console.log(enncrypt[encrypt.length]);
})

app.post('/getTask', function(req, res)
{

  let data = []; 
  const dir = './uploads';
  console.log("2");
  
  fs.readdir(dir, (err, files) => {
    count2 = (files.length);
  }); 
  for(let i = 0; i < count2; i++){
    data = fs.readFileSync('./uploads/files' + i + '.json', 'utf8');
    if(data.includes(req.body.user )){
      break;
    }

  }


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

  for(let i = 0; i < enncrypt.length; i++){
    decrypt(enncrypt[i], req.body.privateKey, passphrase) //(contenido encriptado, clave privada, env.token.secret)
      .then(str => console.log(str))
      .catch(err => console.log(err))

    console.log(deecrypt[i] = decrypt(enncrypt[i]))
  }
})

app.post('/archive', function(req, res)
{
    let data = []; 
    const dir = './uploads';
    console.log("2");
    
    fs.readdir(dir, (err, files) => {
      count2 = (files.length);
    }); 
    for(let i = 0; i < count2; i++){
      data = fs.readFileSync('./uploads/files' + i + '.json', 'utf8');
      if(data.includes(req.body.user )){
        break;
      }
  
    }
  
    if (!data || !data.includes(req.body.user )) return [];
    else {
      const file = JSON.parse(data);
      console.log(file);
      res.send(file);
    }
})
      



app.listen(port, function(){
  console.log(`Servidor iniciado en el puerto: ${port}`);
});
