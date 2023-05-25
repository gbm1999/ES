var bcrypt = require(['bcrypt']);
// var NodeRSA = require(['node-rsa'])

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

function validarEmail(valor) {
    re=/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
	if(!re.exec(valor)){
		return false
	}
	return true;
	
    
}

function validarContra(valor) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/.test(valor)){
        return true;
    }
    return false;
    
}

// Función para generar un par de claves pública y privada utilizando RSA
async function generateRSAKeys() {

    const key = new node-rsa({ b: 1024 });

    var publicKey = key.exportKey('public');
    var privateKey = key.exportKey('private');

    console.log('Clave generada en generate: ' + publicKey);
    /*let claves = []
    let { publicKey, privateKey } = await Crypto.subtle.generateKey(
        //Algoritmo de definicion de claves y sus parámetros
        {
            name: 'RSA-OAEP',                                           // Utilizampos el algoritmo RSA con esquema de cifrado OAEP
            modulusLength: 2048,                                        // Longitud del módulo de 2048b. Es un estándar común para claves RSA
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),         // Representa el vlaor decimal 65537, que es un exponente público que se considera seguro
            hash: { name: 'SHA-256' },                                  // Utilizamos SHA-256 como función hash en el esquema de cifrado
        },
        // Colocamos 'extractable' a true para poder extraer la clave de la API Web Crypto
        true,
        // Especificamos que los usos previstos para la clave serán tanto encriptar como desencriptar
        ['encrypt', 'decrypt']
    );
    console.log('ClaveGenerada: ' + publicKey);
    

    // Se exporta de la API en formato "spki" (Subject Public Key Info)
    let exportedPublicKey = await Crypto.subtle.exportKey('spki', publicKey);
    console.log(exportedPublicKey);
    // Se exporta de la API en formato "pkcs8" (Private-Key Cryptography Standard #8)
    let exportedPrivateKey = await Crypto.subtle.exportKey('pkcs8', privateKey);

    claves[0] = arrayBufferToBase64String(exportedPublicKey);
    claves[1] = arrayBufferToBase64String(exportedPrivateKey);
    console.log('ClaveArray' + claves[0] + ' ClaveArray2: '  + claves[1]);

    return claves;
    return {
        publicKey: arrayBufferToBase64String(exportedPublicKey),
        privateKey: arrayBufferToBase64String(exportedPrivateKey),
    };*/
}


// Función para encriptar la clave privada con la contraseña de acceso a la aplicación
function encryptPrivateKey(privateKey, password) {
    var encryptedPrivateKey = Crypto.AES.encrypt(privateKey, password);
    return encryptedPrivateKey;
}

// convierte un ArrayBuffer en una cadena de texto en formato Base64
function arrayBufferToBase64String(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);                 // codifica la cadena binaria en formato Base64.
}

function cogerDatosRegistro() 
{   
	let nombre = document.querySelector('#nombre').value;
  	let correo = document.querySelector('#correo').value;
	let contraseña = document.querySelector('#contra').value;
    let confirmcontra = document.querySelector('#confcontra').value;
    let passwdHashed = '';
    let claves = [];      //Si los parámetros de registro son correctos, aquí se almacenarán las claves pública/privada del usuario

    if(validaVacio(nombre) || validaVacio(correo) || validaVacio(contraseña) || validaVacio(confirmcontra))
    {
        alert("Rellene todos los campos");
   	    return false;
    }
    else{
        if(validarEmail(correo) == false)
        {
            alert("La dirección de email es incorrecta.");
            return false;
        }
        else{
            if(validarContra(contraseña) == false){
                alert("La contraseña no cumple con los requisitos mínimos. Debe contener como mínimo: " +
                            "mínimo 8 carácteres, " +
                            "una letra mayúscula, " + 
                            "una letra minúscula, " +
                            "no se permiten espacios en blanco, " +
                            "máximo 15 carácteres, " +
                            "un dígito y un carácter especial. " + 
                            "Por ejemplo: !qwertyA1");
                return false;
            }
            else{
                if(contraseña!=confirmcontra){
                    alert("Las contraseñas no coinciden.");
                    return false;
                }
                else{
                    document.querySelector('#nombre').value = '';
                    document.querySelector('#correo').value = '';
                    document.querySelector('#contra').value = '';
                    document.querySelector('#confcontra').value = '';
                }
            }
        }
        console.log("Vamo a generar las claves");
        //Generamos el par de claves pública/privada
        claves = generateRSAKeys();
        console.log("clavePub:" + claves[0]);
        // Encriptar la clave privada con la contraseña de acceso a la aplicación
        let encryptedPrivateKey = encryptPrivateKey(claves[1], contraseña);
        // Almacenar la clave privada en el archivo de datos principal cifrado
        // con la contraseña de acceso a la aplicación
        fs.writeFileSync('/pubKeys/' + correo + '.pem', claves[0]);

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(contraseña, salt, function(err, hash) {
                console.log(salt)
                console.log(keys.publicKey)
                const params = {
                    'name': nombre,
                    'email': correo,
                    'passwd': hash,
                    'publicKey': claves[1]
                };
        
                const options = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify(params)
                };
        
                fetch( 'http://localhost:5500/register', options )
                .then( response => { location.href = 'archives.html';})
                .catch(error=>{console.log(error)})
            })
        });
    }
}

function cogerDatosSesion()
{
  	let correo = document.querySelector('#email').value;
	let contraseña = document.querySelector('#contraini').value;

    if(validaVacio(correo) || validaVacio(contraseña))
    {
        alert("Rellene todos los campos");
   	    return false;
    }
    else{
        if(validarEmail(correo) == false)
        {
            alert("La dirección de email es incorrecta.");
            return false;
        }
        else{
            document.querySelector('#email').value = '';
            document.querySelector('#contraini').value = '';
        }
    }


    const params = {
        'email': correo
    };

    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        body: JSON.stringify(params)
    };

    fetch( 'http://localhost:5500/login', options )
    .then(function(response) {
        return response.json(); 
    })
    .then(function(data) {
        console.log(data);
        bcrypt.compare(contraseña, data.password, function(err, res)
        {
            if(res == true)
            {
                console.log(this.email.value);
                location.href = 'archives.html?email=' + correo+ '';
            }
            else
            {
                alert('El usuario y/o la contraseña no coinciden');
            }
        })
    })
    .catch(error=>{console.log(error)})
    
}

function init() {
	let registro = document.querySelector('#registro');
	registro.addEventListener('click', cogerDatosRegistro, false);
    let sesion = document.querySelector('#sesion');
	sesion.addEventListener('click', cogerDatosSesion, false);
    
  }
  
//document.addEventListener('DOMContentLoaded',init,false);