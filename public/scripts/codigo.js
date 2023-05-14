var zip
var fileInput
var file
var blobZip
//Function to show selected files. Their name and size.

function GetFileInfo () {
	zip = new JSZip();
	fileInput = document.getElementById ("fileInput");	
	var message = "";
	if ('files' in fileInput) {
		if (fileInput.files.length == 0) {
			message = "Seleccione uno o mas ficheros.";
		} else {
			for (var i = 0; i < fileInput.files.length; i++) {
				message += "<br /><b>" + (i+1) + ". </b>";
				file = fileInput.files[i];
				console.log("Texto del archivo")
				console.log(file.toString())
				zip.file(file.name,file);
				if (i == 6) {
					message += "<br /><b> ... </b><br />";
					break;
				}
				if ('name' in file) {
					message += "<b>" + file.name + "</b><br />";
				}
				else {
					message += "<b>" + file.fileName + "</b><br />";
				}
				if ('size' in file) {
					message += "Tamaño: " + file.size + " bytes <br />";
				}
				else {
					message += "Tamaño: " + file.fileSize + " bytes <br />";
				}
				if ('mediaType' in file) {
					message += "Tipo: " + file.mediaType + "<br />";
				}
			}
		}
	} 
	else {
		if (fileInput.value == "") {
			message += "Seleccione uno o mas ficheros.";
			message += "<br />Use the Control or Shift key for multiple selection.";
		}
		else {
			message += "Su navegador no soporta estos ficheros!";
			message += "<br />La ruta de ficheros selecionados: " + fileInput.value;
		}	
	}

	var info = document.getElementById ("info");
	info.innerHTML = message;

	const div = document.querySelector("div");  // <div></div>



	
}


async function onSubmit(event)
{	
	//[fileHandle] = await window.showSaveFilePicker();
	//let stream = await fileHandle.createWritable();
	blobZip = new Blob()
	var fileEnc = new Blob()
  var encrypted 
	let jsonData = {
		'metadatos' :[]
	};

	let name = document.querySelector('#inputName').value;
	let desc = document.querySelector('#inputDesc').value;
	let date = document.querySelector('#inputDate').value;
	
	jsonData.metadatos.push(
		{
			"nombre": name,
			"descripcion": desc,
			"fecha": date
		}
	);
	
	json = JSON.stringify(jsonData);
	let obj = JSON.parse(json);
	
 	makeZip(json,name).then((blob)=>{
	
	 //Cifrado Decifrado
		console.log('Start encryption');
		console.log(blob);
		var reader = new FileReader();                                              //Esta linea nos ayuda a leer el contenido de nuestros archivos
		reader.onload = () => {     

        //Cifrado con AES y clave
        var key = generateString(16);
		var keyBlob = new Blob([key]);
		
		saveAs(keyBlob, name + ".key");
				
        var wordArray = CryptoJS.lib.WordArray.create(reader.result);           // Convert: ArrayBuffer -> WordArray
        encrypted = CryptoJS.AES.encrypt(wordArray, key)                        // Encryption: WordArray -> Base64 encoded string 
        
        fileEnc = new Blob([encrypted]);                                        // Create blob from string		

        saveAs(fileEnc, name + ".enc")                                          //Descargar archivo cifrado
       
        var decrypted = CryptoJS.AES.decrypt(encrypted, key);                   // Decryption: Base64 encoded string -> WordArray
        var typedArray = convertWordArrayToUint8Array(decrypted);
        
        var fileDec = new Blob([typedArray]);
        saveAs(fileDec, name + "_dec.zip")
         
    };
    reader.readAsDataURL(blob)
	})

}

const makeZip = (json,name) => {
	zip.file("metadatos.json", json);

	const valores = window.location.search;

//Mostramos los valores en consola:
console.log(valores);

//Creamos la instancia
const urlParams = new URLSearchParams(valores);

//Accedemos a los valores
var user = urlParams.get('email');

console.log(user);

	const options = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			},
		body: JSON.stringify({name: name, file: zip, user: user})
	};

	fetch( 'http://localhost:5500/upload', options)
	.then(function(response){
		return response.json(); 
	})
	.catch(error=>{console.log(error)})

	fetch( 'http://localhost:5500/download' )
	.then( response => { console.log(response);})
	.catch(error=>{console.log(error)})
	
	return new Promise((resolve,reject)=>{                                    //Promesa de que va aregresar un archivo de tipo Zip
		zip.generateAsync({type:"blob"}).then(function (blob) {                 //Tambien podemos cambiar esto por una funcion asicrona y await.
			//saveAs(blob, name + ".zip")
			resolve (blob);
		})
	})
	
}


function colocar(event) {
  event.target.parentNode.querySelector('h2');
}

function cogerDatos() {
	let nombre = document.querySelector('#inputName').value;
  	let descripcion = document.querySelector('#inputDesc').value;
	let fecha = document.querySelector('#inputDate').value;
	
   
  	if(validaVacio(nombre) || validaVacio(descripcion) || validaVacio(fecha))
	  {   
  	  alert("Rellene todos los campos");
   	  return false;
 	}
	else{
		let submit = document.querySelector('#btnSubmit');
		submit.addEventListener('click', onSubmit, false);
		
		document.querySelector('#inputName').value = '';
		document.querySelector('#inputDesc').value = '';
		document.querySelector('#inputDate').value = '';
		document.querySelector('#fileInput').value = '';
		document.getElementById("info").innerHTML="";


		let seccion = document.createElement('section');

		seccion.innerHTML = '<h2>' + nombre + '</h2>';
		seccion.setAttribute("id", nombre);
		seccion.setAttribute("class", nombre); 

		document.querySelector('main').appendChild(seccion);

		let li = document.createElement('li'); 
		li.innerHTML = '<a ' + 'href=#' + nombre + '> ' + nombre + ' </a>';
		//li.setAttribute("id",aux);

		document.querySelector('ul').appendChild(li);

		mostrarzipscreados(seccion,seccion.querySelector('h2'),nombre,descripcion,fecha);
	}

  
}


  function queryAncestorSelector (node,selector) {
    var parent= node.parentNode;
    var all = document.querySelectorAll(selector);
    var found= false;
    while (parent !== document && !found) {
      for (var i = 0; i < all.length && !found; i++) {
        found= (all[i] === parent)?true:false;
      }
      parent = (!found)?parent.parentNode:parent;
    }
    return (found)?parent:null;
  }
  

  
  function mostrarzipscreados(seccion,h2,nombre,descripcion,fecha) {

    let div = document.createElement('div');
	let div2 = document.createElement('div');
	div.classList.add("informacion");

    
    let input2 = document.createElement('input');
    input2.setAttribute("type", "button");
    input2.setAttribute("value", "Borrar");
    input2.setAttribute("name", "borrar")
	input2.setAttribute("class", "borrar")
    div.prepend(input2);
    
	
	div2.innerHTML = "Nombre: " + nombre + "<br/>Descripción: " + descripcion + "<br/>Fecha: " + fecha;
	div.prepend(div2);
	h2.prepend(div);
	
	
    seccion.insertBefore(div, h2.nextSibling);
	
	let e = seccion.querySelector('.informacion input[name="borrar"]');
    e.addEventListener('click', borrazip, false);
	

  }
  

  function validaVacio(valor) {
    valor = valor.replace("&nbsp;", "");
    valor = valor == undefined ? "" : valor;
    if (!valor || 0 === valor.trim().length) 
    {
      return true;
    }
    else 
    {
      return false;
    }
  }
  
  
  function borrazip(event)
  {
    let seccion = queryAncestorSelector(event.currentTarget, "section");
    let borrar = seccion.querySelectorAll('.borrar');
    queryAncestorSelector(event.currentTarget, seccion).remove();
    document.querySelector('li a[href="#' + seccion.id + '"').remove();
    seccion.remove();
  }
  

function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index=0, word, i;
    for (i=0; i<length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

function generateString(lentgh) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (var i = 0; i < lentgh; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
	return text;
}


  function init() {
	let submit = document.querySelector('#btnSubmit');
	submit.addEventListener('click', onSubmit, false);
    let e = document.querySelector('#nuevozip input[name="crea"]');
    e.addEventListener('click', cogerDatos, false);

    let fs= document.querySelectorAll('.datos');
    for(let i=0;i<fs.length;i++) {
      fs[i].addEventListener(
        'submit',
        function (event) {
          event.preventDefault();
        }, 
        false
      );
    }


	const options = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			},
		body: JSON.stringify({name: name, file: zip, user: user})
	};

	fetch( 'http://localhost:5500/upload', options)
	.then(function(response){
		return response.json(); 
	})
	.catch(error=>{console.log(error)})

	fetch( 'http://localhost:5500/archives', options)
	.then( response => { 
		console.log(response);
		let seccion = document.createElement('section');

		seccion.innerHTML = '<h2>' + nombre + '</h2>';
		seccion.setAttribute("id", nombre);
		seccion.setAttribute("class", nombre); 
	
		document.querySelector('main').appendChild(seccion);
	
		let li = document.createElement('li'); 
		li.innerHTML = '<a ' + 'href=#' + nombre + '> ' + nombre + ' </a>';
		//li.setAttribute("id",aux);
	
		document.querySelector('ul').appendChild(li);
		
		
		mostrarzipscreados(seccion,seccion.querySelector('h2'),response.nombre,response.descripcion,response.date) ;})
	.catch(error=>{console.log(error)})

	console.log("hola");
    
  }
  
document.addEventListener('DOMContentLoaded',init,false);