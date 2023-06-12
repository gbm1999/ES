if(!bcrypt)
{
    var bcrypt = require(['bcrypt']);
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
  

function cogerDatosRegistro() 
{   
	let nombre = document.querySelector('#nombre').value;
  	let correo = document.querySelector('#correo').value;
	let contraseña = document.querySelector('#contra').value;
    let confirmcontra = document.querySelector('#confcontra').value;
    let passwdHashed = '';

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

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(contraseña, salt, function(err, hash) {
                console.log(salt)
                const params = {
                    'name': nombre,
                    'email': correo,
                    'passwd': hash
                };
        
                const options = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify(params)
                };
        
                fetch( 'http://localhost:5505/register', options )
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

    fetch( 'http://localhost:5505/login', options )
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
  
document.addEventListener('DOMContentLoaded',init,false);