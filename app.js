require("dotenv").config()

const port = process.env.PORT;
const express = require('express')
const app = express()
const path = require('path')

var fs = require('fs')
var https = require('https')


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

    let sql = "SELECT password FROM users WHERE EMAIL='" + req.body.email + "'";

})

app.post('/register', function(req, res)
{
    //VALIDAR SENTENCIA ENTRANTE POR EL CLIENTE
    console.log(req.body);
    let sql = "INSERT INTO users (name, email, password) VALUES ('"+ req.body.name + "', '"+ req.body.name  +"', '" + req.body.passwd + "')";

      console.log("User registered");
      res.redirect('archives.html ?id=" + this.id "');


          // Crear el objeto con los datos del archivo y su contenido cifrado
          var objeto = {
            nombre: req.body.name ,
            email: req.body.name ,
            passwd: req.body.passwd,
            //archivos
            //tareas
        };

        var json = JSON.stringify(objeto);

        // Guardar el archivo serializado, comprimido y cifrado en la carpeta del cliente
        console.log(json);
        guardarArchivo(json, req.body.name);
})

/*
  ARCHIVOS - CRUD 
*/

app.post('/upload', function(req, res)
{
    let sql = "INSERT INTO archives (name, file, user) VALUES ('"+ req.body.name + "', '"+ req.body.file['files'] + "', '"+  req.body.user + "')";
})


app.post('/download', function(req, res)
{
    let sql = "SELECT * FROM archives where name='"+ req.body.name + "'";
})

// Función para guardar un archivo en la carpeta del cliente
function guardarArchivo(texto, nombreArchivo) {
  var archivo = new Blob([texto], { type: "application/json" });


  if (typeof document !== 'undefined') {
    var enlace = document.createElement("a");
    enlace.download = nombreArchivo + ".cif";
    enlace.href = window.URL.createObjectURL(archivo);
    enlace.style.display = "none";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    window.URL.revokeObjectURL(enlace.href);
 }

}

app.listen(port, function(){
  console.log(`Servidor iniciado en el puerto: ${port}`);
});
