import { registrarEventosUsuario } from "../../../assets/js/main.js";
import { WEB_CONFIGURATION_URLS } from "../../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../../assets/js/web.config.js";
import { VENTANAS, TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION, KEY_TOKEN } from '../../../assets/js/ventanas.config.js';

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

const URL = WEB_CONFIGURATION_URLS.API;
const METHODS = WEB_CONFIGURATION_METHODS.API;


//------------valores dropdown------------
var identificarRol = null, identificarNombreRol;

//------datos crear usuario-------
var idUsuario = 0;
var usuario = "";
var nombreApellido = "";
var correo = "";
var telefono = "";
var rolNuevo;
var bandera2 = false;
var banderaRol = false;

//-------permisos------------
var resultSegundoPrincipal = [];
var resultSegundoSolamente = [];

var numeroEnteroPrincipal = [];
var numeroEnteroSolamente = [];

var arrayCompleto = []
var arrayCompletoSolamente = []


function NumText(string){//solo letras y numeros
    var out = '';
    //Se añaden las letras validas
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890 ';//Caracteres validos
	
    for (var i=0; i<string.length; i++)
       if (filtro.indexOf(string.charAt(i)) != -1) 
	     out += string.charAt(i);
    return out;
}

var aparecerVentana = document.getElementById("botonCrearRol"); // Encuentra el elemento en el sitio
aparecerVentana.onclick = ventana; // Agrega función onclick al elemento

function ventana() {
    //alert("Evento onclick ejecutado!");
    // document.getElementById("botonCrearRol2").style.display = "initial";
    document.getElementById("ventanaCrearUsuario2Inputs").style.display = "flex";
    document.getElementById("tablaVertical").style.display = "initial";
    document.getElementById("ventanaCrearUsuario2PosicionVertial").style.paddingTop = "40px";
    document.getElementById("ventanaCrearUsuario2Tamano").style.height = "635px";   
}

function llenarDropdownVacio(){

    $.ajax({
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_rols_user_consul_x_id_compania,
        type: 'GET',
        dataType: 'json',
        data: {
            Coincidencia: null,
            TopConsulta: 9999,
            numsItemsOmitir: 0,
            numsItemsTomar: 9999
        },
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){

            var plantilla = "";

            for(let i = 0; i < data.resultado.roles.length; i++) {
                plantilla += `
                    <option id="${[i]}" onclick="asignarInput()" value="${data.resultado.roles[i].idRol}">${data.resultado.roles[i].nombre}</option>
                `
            }

            $("#opciones").html(`<option value="null">Seleccionar Rol</option>` + plantilla);
            $("#opciones2").html(`<option value="null">Seleccionar Rol</option>` + plantilla);
        },
        error: function(err){
            
        },
        complete: function () {
            
        }
    });
}

function llenarDropdown(){

    $.ajax({
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_rols_user_consul_x_id_compania,
        type: 'GET',
        dataType: 'json',
        data: {
            Coincidencia: null,
            TopConsulta: 9999,
            numsItemsOmitir: 0,
            numsItemsTomar: 9999
        },
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){
        
            var plantilla = "";
            var ultimoRol, ultimoRolValor;

            for(let i = 0; i < data.resultado.roles.length; i++) {
                plantilla += `
                    <option id="${[i]}" onclick="asignarInput()" value="${data.resultado.roles[i].idRol}">${data.resultado.roles[i].nombre}</option>
                `
                ultimoRol = data.resultado.roles[i].nombre;
                ultimoRolValor = data.resultado.roles[i].idRol;
            }

            $("#opciones").html(`<option value=${ultimoRolValor}>${ultimoRol}</option>` + plantilla);
            $("#opciones2").html(`<option value=${ultimoRolValor}>${ultimoRol}</option>` + plantilla);
        },
        error: function(err){
            
        },
        complete: function () {
            
        }
    });
}

$(document).ready(function(){

    document.getElementById("botonCrearSolamenteRol2").style.display = "initial";
    document.getElementById("ventanaCrearUsuario2InputsSolamente").style.display = "flex";
    document.getElementById("tablaVerticalSolamente").style.display = "initial";
    document.getElementById("ventanaCrearUsuario2PosicionVertialSolamente").style.paddingTop = "40px";

    //--------------------llenar dropdown----------------------

    llenarDropdownVacio();

    //-----------------------------permisos----------------------------

    $.ajax({
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_permi_activ_consul,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){
            
        },
        error: function(err){
            
        }
    });

});

$("#btnSiguienteColor").click(function () {
    
    // habilitar siguiente (crear usuario)
    usuario = $('#usuario').val();
    nombreApellido = $('#nombreApellido').val();
    correo = $('#correo').val();
    telefono = $('#telefono').val();

    if(usuario == "" || correo == "" || telefono == "" || nombreApellido == ""){ 
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: "Verifica que todos los campos del formulario esten completos",
            confirmButtonColor: '#2797d2',
          })
    }else{
        $("#crearusuario2").modal('show');
        $("#crearusuario").modal('hide');
    }
});

$("#opciones").change(function(){

    $("#jstreeCargarPermisos").jstree("destroy");

    var idRolParaPermisos = $(this).val()
    var numeroEnteroParaPermisos = Number(idRolParaPermisos);

    $.ajax({
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_permi_x_id_rol_user_consul,
        type: 'GET',
        dataType: 'json',
        data: {
            IdRol: numeroEnteroParaPermisos
        },
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){
            
            document.getElementById("permisosAsignadosAEsteRol").style.display = "initial";
            document.getElementById("ventanaCrearUsuario2PosicionVertial").style.paddingTop = "40px";
            document.getElementById("ventanaCrearUsuario2Tamano").style.height = "600px";

            document.getElementById("botonCrearRol").style.display = "initial";
            document.getElementById("textoCrearRol").style.display = "initial";
            document.getElementById("botonCrearRol2").style.display = "none";
            document.getElementById("botonCrearRolGris").style.display = "none";
            document.getElementById("textoCrearRolGris").style.display = "none";

            document.getElementById("ventanaCrearUsuario2Inputs").style.display = "none";
            document.getElementById("tablaVertical").style.display = "none";
            // document.getElementById("ventanaCrearUsuario2PosicionVertial").style.paddingTop = "40px";
            // document.getElementById("ventanaCrearUsuario2Tamano").style.height = "375px"; 
            
            cargarPermisosPreCargados(data.resultado);
            
        },
        error: function(err){
            
        },
        complete: function () {
            
        }
    });
});
    
function cargarPermisosPreCargados(permisosData){
    
  var PermisosTree = [];
  var parent=null;
  for(var i=0;i<permisosData.length;i++){
      if(permisosData[i].idPermisoPadre==null){
          parent="#";
      }else{
          parent=permisosData[i].idPermisoPadre;
      }
      PermisosTree[i]={ "id" : permisosData[i].idPermiso, "parent" : parent, "text" : permisosData[i].nombre };
  }
  $('#jstreeCargarPermisos').jstree({"plugins" : ["state"], 'core' : {
      'data' : PermisosTree
  } });
}

$("#botonSiguienteNumero2").click(function () {

    //------------------variable datos crear Rol (combo)---------------------

    identificarRol = document.getElementById("opciones").value;
    
    identificarNombreRol = $("#opciones option:selected").text();
    

    // ----------------------------variables crear ususario-------------------------

    usuario = $('#usuario').val();
    nombreApellido = $('#nombreApellido').val();
    correo = $('#correo').val();
    telefono = $('#telefono').val();
    rolNuevo = $('#rol').val();

    $("#name").text(nombreApellido);
    $("#user").text(usuario);
    $("#email").text(correo);
    $("#cel").text(telefono);
    $("#rol").text(identificarNombreRol);

    // ---------------- antes de siguiente verifique los campos------------------------------------------------

    // var identificarNombreRolMirar = $("#opciones").val();

    if(identificarNombreRol == "Seleccionar Rol"){
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: "Selecciona un Rol",
            confirmButtonColor: '#2797d2',
          })
    }else{
        $("#crearusuario3").modal('show');
        $("#crearusuario2").modal('hide');
    }
});

// ----------------------------arbol 1---------------------------

function permisosPrincipal () {
    
    $.ajax({
        async: true,
        type: "GET",
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_permi_activ_consul,
        dataType: "json",
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function (data) {
          cargarPermisosTreePrincipal(data.resultado);
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });            
};

function cargarPermisosTreePrincipal(permisosData){
  var PermisosTree = [];
  var parent=null;
  for(var i=0;i<permisosData.length;i++){
      if(permisosData[i].idPermisoPadre==null){
          parent="#";
      }else{
          parent=permisosData[i].idPermisoPadre;
      }
      PermisosTree[i]={ "id" : permisosData[i].idPermiso, "parent" : parent, "text" : permisosData[i].nombre };
  }
  $('#jstreePrincipal').jstree({"plugins" : ["checkbox", "state"], 'core' : {
      'data' : PermisosTree
  } });

  $("#jstreePrincipal").on("changed.jstree", function(e, data){

    //----------seleccionar el nodo-------------
    
    arrayCompleto.length = 0;
    var checked_ids = []; 
    var selectedNodes = $('#jstreePrincipal').jstree("get_checked", true);
    $.each(selectedNodes, function() {
        checked_ids.push(this.id, this.parent);
    });

    checked_ids.push("1");

    //---------------iterar array------------------

        resultSegundoPrincipal = checked_ids.reduce((acc,item)=>{
            if(!acc.includes(item)){
                acc.push(item);
            }
            return acc;
        },[])

        removeItemFromArr( resultSegundoPrincipal, '#' );
        

        for(var i=0; i<resultSegundoPrincipal.length;i++){
            arrayCompleto[i] = Math.abs(resultSegundoPrincipal[i]); 
        }
        
        
  });
}

// ----------------------------arbol 2---------------------------

function permisosSolamente () {
    $.ajax({
        async: true,
        type: "GET",
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_permi_activ_consul,
        dataType: "json",
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function (data) {
            cargarPermisosTreeSolamente(data.resultado);
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });            
};

function cargarPermisosTreeSolamente(permisosData){
  var PermisosTree = [];
  var parent=null;
  for(var i=0;i<permisosData.length;i++){
      if(permisosData[i].idPermisoPadre==null){
          parent="#";
      }else{
          parent=permisosData[i].idPermisoPadre;
      }
      PermisosTree[i]={ "id" : permisosData[i].idPermiso, "parent" : parent, "text" : permisosData[i].nombre };
  }
  $('#jstreeSolamente').jstree({"plugins" : ["checkbox", "state"], 'core' : {
      'data' : PermisosTree
  } });

  $("#jstreeSolamente").on("changed.jstree", function(e, data){

    //----------seleccionar el nodo-------------

        arrayCompletoSolamente.length = 0;
        var checked_ids = []; 
        var selectedNodes = $('#jstreeSolamente').jstree("get_checked", true);
        $.each(selectedNodes, function() {
            checked_ids.push(this.id, this.parent);
        });

        checked_ids.push("1");

    //---------------iterar array------------------

        resultSegundoSolamente = checked_ids.reduce((acc,item)=>{
            if(!acc.includes(item)){
                acc.push(item);
            }
            return acc;
        },[])

        removeItemFromArr( resultSegundoSolamente, '#' );

        for(var i=0; i<resultSegundoSolamente.length;i++){
            arrayCompletoSolamente[i] = Math.abs(resultSegundoSolamente[i]); 
        }
        
  });
}

function removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );
 
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
}

$("#botonCrearRol2").click(function () {

    // ----------------------------crear rol-------------------------

    var nombreRol = $('#nombreRol').val();
    var descripcionRol = $('#descripcionRol').val();


    if(nombreRol == "" || descripcionRol == "" || resultSegundoPrincipal.length == 0){
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: "Antes de crear un rol, completa todos los campos",
            confirmButtonColor: '#2797d2',
          })
    }else{

        document.getElementById("botonCrearRol").style.display = "initial";
        document.getElementById("textoCrearRol").style.display = "initial";
        document.getElementById("botonCrearRol2").style.display = "none";
        document.getElementById("botonCrearRolGris").style.display = "none";
        document.getElementById("textoCrearRolGris").style.display = "none";

        document.getElementById("ventanaCrearUsuario2Inputs").style.display = "none";
        document.getElementById("tablaVertical").style.display = "none";
        document.getElementById("ventanaCrearUsuario2PosicionVertial").style.paddingTop = "60px";
        document.getElementById("ventanaCrearUsuario2Tamano").style.height = "375px"; 
        document.getElementById("botonCrearRol2").style.display = "none";

        $.ajax({
            url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.man_rol_user_consul,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                // IdRol: 0,
                Nombre: nombreRol,
                Estado: 1,
                Descripcion: descripcionRol,
                Permisos: arrayCompleto
            }),
            contentType: 'application/json',
            headers: {
                Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
            },
            success: function(data){
                if(data.resultado == true){

                    Swal.fire({
                        icon: 'success',
                        title: "Bien",
                        text: 'Rol creado satisfactoriamente',
                        confirmButtonColor: '#2797d2',
                    })
                    registrarEventosUsuario(TIPO_ACCION_USUARIO.Agregar, VENTANAS.UsuarioEdocConsulta, "nombre del rol: " + nombreRol);
                }
            },
            error: function(err){
                
                Swal.fire({
                    icon: 'error',
                    title: "Error",
                    text: 'No se pudo crear el rol',
                    confirmButtonColor: '#2797d2',
                  })
            },
            complete: function(){
                // banderaRol = true;
                
                //     setInterval(function() {
                //         $("#opciones").load();
                //     },1000
                // )

                banderaRol = true;
                llenarDropdown();
    
                $('#nombreRol').val("");
                $('#descripcionRol').val("");
            }
        });
    }
});

$("#btnFinalizar").click(function () {

    $('#nombreRol').val("");
    $('#descripcionRol').val("");

    $('#usuario').val("");
    $('#nombreApellido').val("");
    $('#correo').val("");
    $('#telefono').val("");

    var numeroEntero = Number(identificarRol);

    $.ajax({
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.mant_user_consul,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            IdUsuario: 0,
            Usuario: usuario,
            Nombre: nombreApellido,
            Email: correo,
            Telefono: telefono,
            IdRol: numeroEntero,
            Estado: true
        }),
        contentType: 'application/json',
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){
            if(data.resultado == true){
            
                Swal.fire( 'Bien', 'Usuario y Rol creados', 'success' )
                // $("#editTrueFalse").html("Usuario y Rol creados");
                // $("#editarRolModal").modal('show');
                Swal.fire({
                    icon: 'success',
                    title: "Bien",
                    text: 'Usuario y rol creados',
                    confirmButtonColor: '#2797d2',
                })
                registrarEventosUsuario(TIPO_ACCION_USUARIO.Agregar, VENTANAS.UsuarioEdocConsulta, "nombre del usuario: " + usuario);
            }
        },
        error: function(err){
            
            Swal.fire({
                icon: 'error',
                title: "Error",
                text: 'No se pudo crear el usuario',
                confirmButtonColor: '#2797d2',
              })
            // $("#editTrueFalse").html(err.responseText);
            // $("#editarRolModal").modal('show');
        }
    });
});

var btnAdministrarRoles = document.querySelector("#btnAdministrarRoles");

btnAdministrarRoles.addEventListener("click", () => {
    permisosSolamente();
});

var crearSolamenteRol = document.querySelector("#botonCrearSolamenteRol2");
crearSolamenteRol.addEventListener("click", () => {

    var nombreRolSolamente = $('#nombreRolSolamente').val();
    var descripcionRolSolamente = $('#descripcionRolSolamente').val();


    if(nombreRolSolamente == "" || descripcionRolSolamente == "" || resultSegundoSolamente.length == 0){
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: "Antes de crear un rol, completa todos los campos",
            confirmButtonColor: '#2797d2',
          })
    }else{
        $.ajax({
            url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.man_rol_user_consul,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                // IdRol: 0,
                Nombre: nombreRolSolamente,
                Estado: 1,
                Descripcion: descripcionRolSolamente,
                Permisos: arrayCompletoSolamente
            }),
            contentType: 'application/json',
            headers: {
                Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
            },
            success: function(data){
                if(data.resultado == true){

                    // $("#editTrueFalse").html("Rol Creado");
                    // $("#editarRolModal").modal('show');
                    // $("#crearsolamenterol").modal('hide');
                    // $("#Administrarroles").modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: "Bien",
                        text: 'Rol creado satisfactoriamente',
                        confirmButtonColor: '#2797d2',
                    })
                    registrarEventosUsuario(TIPO_ACCION_USUARIO.Agregar, VENTANAS.UsuarioEdocConsulta, "nombre del rol: " + nombreRolSolamente);
                }
            },
            error: function(err){
                
                // $("#editTrueFalse").html(err.responseText);
                // $("#editarRolModal").modal('show');
                // $("#crearsolamenterol").modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: "Error",
                    text: 'No se pudo crear el rol',
                    confirmButtonColor: '#2797d2',
                  })
            }
        });
    }
    
});

$("#botonCrearRol").click(function () {

    permisosPrincipal();
    document.getElementById("botonCrearRol").style.display = "none";
    document.getElementById("textoCrearRol").style.display = "none";
    document.getElementById("botonCrearRol2").style.display = "initial";
    document.getElementById("botonCrearRolGris").style.display = "initial";
    document.getElementById("textoCrearRolGris").style.display = "initial";
    document.getElementById("ventanaCrearUsuario2PosicionVertial").style.paddingTop = "10px";

    document.getElementById("permisosAsignadosAEsteRol").style.display = "none";
    document.getElementById("ventanaCrearUsuario2Tamano").style.height = "630px";
    
});

$("#botonCrearRolGris").click(function () {

    document.getElementById("botonCrearRol").style.display = "initial";
    document.getElementById("textoCrearRol").style.display = "initial";
    document.getElementById("botonCrearRol2").style.display = "none";
    document.getElementById("botonCrearRolGris").style.display = "none";
    document.getElementById("textoCrearRolGris").style.display = "none";

    document.getElementById("ventanaCrearUsuario2Inputs").style.display = "none";
    document.getElementById("tablaVertical").style.display = "none";
    document.getElementById("ventanaCrearUsuario2PosicionVertial").style.paddingTop = "40px";
    document.getElementById("ventanaCrearUsuario2Tamano").style.height = "375px";  
    
});
