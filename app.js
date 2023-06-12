require("dotenv").config()

const port = process.env.PORT;
const express = require('express')
const app = express()
const path = require('path')

var fs = require('fs')
const crypto = require("crypto");

var count = 0;
var count2 = 0;
var count3 = 0;

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
      //Generamos clave privada de B

      const algorithm = "aes-192-cbc";
      
      const encryptPrivateKey = async (text) => {
        //generate encryption key using the secret.
        await crypto.scrypt(passphrase, 'salt', 24, (err, key) => {
          if (err) throw err;
          console.log(1);
          //create an initialization vector
          crypto.randomFill(new Uint8Array(16), (err, iv) => {
            if (err) throw err;
            console.log(2);
            const cipher = crypto.createCipheriv(algorithm, key, iv);
      
            let encrypted = '';
            cipher.setEncoding('hex');
      
            cipher.on('data', (chunk) => encrypted += chunk);
            cipher.on('end', () => console.log(encrypted))
            cipher.on('error', (err) => console.log(err))
      
            cipher.write(text);
            cipher.end();
            console.log(3);


            var objeto = {
              nombre: req.body.name ,
              email: req.body.email ,
              password: req.body.passwd,
              privateKey: encrypted,
          };
  
          console.log(objeto)
          var json = JSON.stringify(objeto);
  
          // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
          console.log(json);
          fs.writeFileSync('./memory/register' + count + '.json', JSON.stringify(json));
          const dir = './memory';
  
          fs.readdir(dir, (err, files) => {
            count = (files.length);
          });
  
          console.log("User registered");
          res.redirect('archives.html ?id=" + this.id "');
          });
        });
      }
      
      encryptPrivateKey(req.body.passwd);
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
          console.log(pk);
    
          const buffer = Buffer.from(text, 'utf8')
          const encrypted = crypto.publicEncrypt(pk, buffer)
          resolve(encrypted.toString('base64'))
        })
      })
    }

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
            encrypt(JSON.stringify(json), "public.key.pem")
            .then(str => {
              fs.writeFileSync('./uploads/files' + count2 + '.json', str.toString());
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
        fs.readFile(absPkPath, 'utf8', (pk, err) => {
          if (err) {
            return reject(err)
          }
          const buffer = Buffer.from(text, 'utf8')
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

    // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
    console.log(json);
    let dataEncrypted = encrypt(JSON.stringify(json), "public.key.pem")
    .then(str => console.log(str))
    .catch(err => console.log(err))

    fs.writeFileSync('./tasks/task' + count3 + '.json', dataEncrypted.toString());
    const dir = './tasks';

    fs.readdir(dir, (err, files) => {
      count3 = (files.length);
    });


  const crypto = require("crypto");

})

app.post('/getTask', function(req, res)
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
  for(let i = 0; i < count2; i++){
    dataEncrypt = fs.readFileSync('./uploads/files' + i + '.json', 'utf8');
    decrypt(dataEncrypt, req.body.privateKey, passphrase) //(contenido encriptado, clave privada, env.token.secret)
    .then(str => console.log(str))
    .catch(err => console.log(err))

    if(data.includes(req.body.user )){
      break;
    }

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
