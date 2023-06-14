var zip
var fileInput
var file
var blobZip
var desc 
var date 

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
	desc = document.querySelector('#inputDesc').value;
	date = document.querySelector('#inputDate').value;
	
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
	const valores = window.location.search;

//Mostramos los valores en consola:

//Creamos la instancia
const urlParams = new URLSearchParams(valores);

//Accedemos a los valores
var user = urlParams.get('email');

	const options = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			},
		body: JSON.stringify({name: name, desc: desc, date: date, user: user})
	};

	console.log(options);

	fetch( 'http://localhost:5505/upload', options)
	.then(function(response){
		return response.json(); 
	})
	.catch(error=>{console.log(error)})

	fetch( 'http://localhost:5505/download' )
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
    input2.setAttribute("name", "borrar");
	input2.setAttribute("class", "borrar");
    div.prepend(input2);

	let input5 = document.createElement('input');
    input5.setAttribute("type", "button");
	input5.setAttribute("name", "uploadTasks");
	input5.setAttribute("value", "subir tareas");
    div.prepend(input5);

	let input7 = document.createElement('input');
    input7.setAttribute("type", "button");
	input7.setAttribute("name", "getTask");
	input7.setAttribute("value", "coger tareas");
    div.prepend(input7);

	let input4 = document.createElement('input');
    input4.setAttribute("type", "button");
	input4.setAttribute("name", "addTask");
	input4.setAttribute("value", "Añadir tarea");
    div.prepend(input4);

	let input3 = document.createElement('input');
    input3.setAttribute("type", "text");
	input3.setAttribute("class", "taskTxt");
    div.prepend(input3);
    
	let label = document.createElement('label');
	label.textContent = 'Introduce la tarea:';
	div.prepend(label);
	
	div2.innerHTML = "Nombre: " + nombre + "<br/>Descripción: " + descripcion + "<br/>Fecha: " + fecha;
	div.prepend(div2);
	h2.prepend(div);
	
	
    seccion.insertBefore(div, h2.nextSibling);
	
	let e = seccion.querySelector('.informacion input[name="borrar"]');
    e.addEventListener('click', borrazip, false);

	let e2 = seccion.querySelector('.informacion input[name="addTask"]');
    e2.addEventListener('click', addTask, false);

	let e3 = seccion.querySelector('.informacion input[name="uploadTasks"]');
    e3.addEventListener('click', uploadTasks, false);

	let e4 = seccion.querySelector('.informacion input[name="getTask"]');
    e4.addEventListener('click', getTask, false);

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
  
  function addTask(event) {
	let div = document.createElement('div');
	let seccion = queryAncestorSelector(event.currentTarget, "section");

	let e = seccion.getElementsByClassName("taskTxt")[0].value;

	div.innerHTML = "<label><input type='checkbox' name='chkbox' onchange='marcarDesmarcar()'> Tarea: " + e +"</label><br>";
	div.setAttribute("class", "task");

	seccion.appendChild(div);
  }

  function uploadTasks(event) {
	let seccion = queryAncestorSelector(event.currentTarget, "section");
	let name = seccion.querySelector('h2').innerHTML;
	let array = [];

	seccion.querySelectorAll('.task').forEach(item => {
		array.push(item.innerHTML);
	});
	
	const valores = window.location.search;
	const urlParams = new URLSearchParams(valores);

	//Accedemos a los valores
	var user = urlParams.get('email');

	console.log(name);
	console.log(user);

	const options = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			},
		body: JSON.stringify({name: name, tasks: array, user: user})
	};

	fetch( 'http://localhost:5505/uploadTask', options)
	.then( response => { 
		console.log(response);})
	.catch(error=>{console.log(error)})

  }

  function getTask(event) {
	let seccion = queryAncestorSelector(event.currentTarget, "section");
	const valores = window.location.search;
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
		body: JSON.stringify({user: user})
	};


	fetch( 'http://localhost:5505/getTask', options)
	.then( response => { 
		console.log(response);
		response.json().then((data) => {
			if(data != null){
				console.log(data);
				let div = document.createElement('div');
			
				let e = data.tasks[0];;
			
				div.innerHTML = e + "<br/>";
				div.setAttribute("class", "task");
			
				seccion.appendChild(div);
			}
		});
})
	.catch(error=>{console.log(error)})
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


  async function init() {
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

	const valores = window.location.search;
	//Creamos la instancia
const urlParams = new URLSearchParams(valores);

//Accedemos a los valores
var user = urlParams.get('email');

	const options = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			},
		body: JSON.stringify({user: user})
	};



		fetch( 'http://localhost:5505/archive', options)
		.then( response => { 
			console.log(response);
			response.json().then((data) => {
				if(data != null){
					let seccion = document.createElement('section');
		
					seccion.innerHTML = '<h2>' + data.nombre + '</h2>';
					seccion.setAttribute("id", data.nombre);
					seccion.setAttribute("class", data.nombre); 
				
					document.querySelector('main').appendChild(seccion);
				
					let li = document.createElement('li'); 
					li.innerHTML = '<a ' + 'href=#' + data.nombre + '> ' + data.nombre + ' </a>';
					//li.setAttribute("id",aux);
				
					document.querySelector('ul').appendChild(li);
					
					mostrarzipscreados(seccion,seccion.querySelector('h2'),data.nombre,data.desc,data.date) ;
				}
			});
})
		.catch(error=>{console.log(error)})
    
  }

  function marcarDesmarcar() {

	var ps = document.getElementsByName('chkbox');
console.log(ps.length);
	for(var i = 0; i < ps.length; i++){
	  // console: imprime el elemento pulsado <p>
	  if(ps[i].checked){
		var value = queryAncestorSelector(ps[i], "label");
		value.textContent += "✔"
	  }
	  else{
		var value = queryAncestorSelector(ps[i], "label");
		value.textContent -= "✔"
	  }
	}
  }
  
document.addEventListener('DOMContentLoaded',init,false);