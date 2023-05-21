require("dotenv").config()

const port = process.env.PORT;
const express = require('express')
const app = express()
const path = require('path')

var fs = require('fs')
var https = require('https')
var count = 0;
var count2 = 0;
var count3 = 0;

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


          // Crear el objeto con los datos del archivo y su contenido cifrado
          var objeto = {
            nombre: req.body.name ,
            email: req.body.email ,
            password: req.body.passwd,
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
    
            var json = JSON.stringify(objeto);
    
            // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
            console.log(json);
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
