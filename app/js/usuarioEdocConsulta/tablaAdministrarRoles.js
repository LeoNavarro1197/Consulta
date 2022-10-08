import { registrarEventosUsuario } from "../../../assets/js/main.js";
import { WEB_CONFIGURATION_URLS } from "../../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../../assets/js/web.config.js";
import { VENTANAS, TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION, KEY_TOKEN} from '../../../assets/js/ventanas.config.js';

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

const URL = WEB_CONFIGURATION_URLS.API;
const METHODS = WEB_CONFIGURATION_METHODS.API;


//-------permisos------------
var arraySegundo = [];
var resultSegundo;

var arrayCompletoAdministrarRoles = []

//--------------tabla principal-----------------

var tableAdministrarRoles;
function cargarTablaRoles() {
    tableAdministrarRoles = $("#tablaAdministrarRoles").DataTable({
        dom: 'Bfrtip',
        pageLength: 2,
        destroy: true,
          // Multi Select
          select: {
            style: "multi",
            selector: "td:first-child"
          },
          searching: false,
    language: {
        search: "_INPUT_",
        searchPlaceholder: "Buscar",
        "paginate": {
            "previous": "<i class='icon-selectorDown-izq' aria-hidden='true'></i>",
            "next": "<i class='icon-selectorDown-der' aria-hidden='true'></i>"
          },
          buttons: {
            selectNone: "Borrar selección"
          }
        },
        "ajax": {
                url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_rols_user_consul_x_id_compania,
                "type": "GET",
                "dataType": "json",
                "dataSrc": function (respuesta) {
                    
                    return respuesta.resultado.roles;
                    },
                "data":
                    function (d) {
                        d.Coincidencia = null;
                        d.TopConsulta = 100;
                        d.numsItemsOmitir = 0;
                        d.numsItemsTomar = 100;
                    },
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader("Authorization",
                    "Bearer" + Cookies.get(KEY_TOKEN)
                    )},
                    "error": function (result) {
                        
                    }
                },
                "columns": [
                    {
                        defaultContent:
                            "<tr> <th scope='row' class='tablabodyth'> <div class='tablabodythdiv'> <button id='borrarRol' class='focusNone tablabodythdivbtn1'><span class='icon-close tablabodythdivbtn1span1'></span></button> <button id='editarRol' class='focusNone tablabodythdivbtn1' data-toggle='modal' data-target='#editRol'><span class='icon-editar tablabodythdivbtn1span2'></span></button></div></th></tr>",
                        title: "Acción",
                        className: "colorFuente",
                        orderable: false,
                        width: "20px"
                        },
                    { "data": "nombre", "title": "Rol",  "className": "colorFuente", width: "20px", orderable: false, },
                    { "data": "descripcion", "title": "Descripción Rol",  "className": "colorFuente", width: "20px", orderable: false, },
                    { "data": "estado", "title": "Estado",  "className": "colorFuente", width: "20px", orderable: false,
                    render: function (data) {
                        var color = 'black';
                        if (data === 0) {
                            color = 'red';
                          }
                        if (data === 1) {
                          color = 'green';
                        }   
                        if (data === 1) {
                          return '<span style="color:' + color + '; font-size: 13px;">' + 'Activo' + '</span>'
                        } else if (data === 0) {
                          return '<span style="color:' + color + '; font-size: 13px;">' + 'Inactivo' + '</span>'
                        }
                      }
                    },
                ]
  });

  $(".dataTables_wrapper").css("width","670px");
}

// ----------------------------arbol---------------------------

function permisos () {
    $.ajax({
        async: true,
        type: "GET",
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_permi_activ_consul,
        dataType: "json",
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function (data) {
          cargarPermisosTree(data.resultado);
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });            
};

var numeroEntero = [];
function cargarPermisosTree(permisosData){
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
  $('#jstreePermisos').jstree({"plugins" : ["checkbox", "state"], 'core' : {
      'data' : PermisosTree
  } });

  $("#jstreePermisos").on("changed.jstree", function(e, data){

    //----------seleccionar el nodo-------------
    
    arrayCompletoAdministrarRoles.length = 0;
    var checked_ids = []; 
    var selectedNodes = $('#jstreePermisos').jstree("get_checked", true);
    $.each(selectedNodes, function() {
        checked_ids.push(this.id, this.parent);
    });
    

    checked_ids.push("1");

    //---------------iterar array------------------

    arraySegundo = checked_ids.reduce((acc,item)=>{
            if(!acc.includes(item)){
                acc.push(item);
            }
            return acc;
        },[])

    removeItemFromArr( arraySegundo, '#' );

    for(var i=0; i<arraySegundo.length;i++){
      arrayCompletoAdministrarRoles[i] = Math.abs(arraySegundo[i]); 
    }
    
    
    
  });
}

function removeItemFromArr ( arr, item ) {
  var i = arr.indexOf( item );

  if ( i !== -1 ) {
      arr.splice( i, 1 );
  }
}

//------------------editar rol--------------------

$(document).ready(function () {

    cargarTablaRoles();
    $("#tablaAdministrarRoles tbody").on("click", "#editarRol", function (e) {
        permisos();
        
        e.preventDefault();
        var data = tableAdministrarRoles.row($(this).parents("tr")).data();
        var input_edit = document.querySelectorAll(".input-edit-rol");
        var btnEditUser = document.querySelector("#btnEditRol");
        
        
        input_edit[0].value = data.nombre;
        input_edit[1].value = data.descripcion;
        
        btnEditUser.addEventListener("click", () => {
          $.ajax({
              url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.man_rol_user_consul,
              method: "POST",
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify({
                  IdRol: data.idRol,
                  Nombre: input_edit[0].value,
                  Estado: 1,
                  Descripcion: input_edit[1].value,
                  Permisos: arrayCompletoAdministrarRoles
                }),
              headers: {
              Authorization:
                  "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
              },
              success: function (res) {
                if(res.resultado == true){
                  
                  // $("#editTrueFalse").html("Editado Satisfactoriamente");
                  // $("#editarRolModal").modal('show');
                  // $("#Administrarroles").modal('hide');
                  Swal.fire({
                      icon: 'success',
                      title: "Bien",
                      text: 'Editado Satisfactoriamente',
                      confirmButtonColor: '#2797d2',
                    })
                    registrarEventosUsuario(TIPO_ACCION_USUARIO.Editar, VENTANAS.UsuarioEdocConsulta, "editar rol: " + input_edit[0].value);
                }
              },
              error: function (xhr, ajaxOptions, throwError) {
              
              // $("#editTrueFalse").html("Editado Insatisfactoriamente");
              // $("#editarRolModal").modal('show');
              // $("#Administrarroles").modal('hide');
              Swal.fire({
                  icon: 'error',
                  title: "Error",
                  text: 'Editado Insatisfactoriamente',
                  confirmButtonColor: '#2797d2',
                })
              },
              complete: function () {
                  tableAdministrarRoles.ajax.reload();
              }
          });

        });
        
    });

    //---------------borrar rol-------------------------

    $("#tablaAdministrarRoles tbody").on("click", "#borrarRol", function (e) {
        
        e.preventDefault();
        var data = tableAdministrarRoles.row($(this).parents("tr")).data();
        
        
        $.ajax({
            url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.man_rol_user_consul,
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                IdRol: data.idRol,
                Nombre: data.nombre,
                Estado: 0,
                Descripcion: data.descripcion,
                Permisos: data.permisos
              }),
            headers: {
            Authorization:
                "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
            },
            success: function (res) {
            
            if(res.resultado == true){
              
              // $("#editTrueFalse").html("Eliminado Satisfactoriamente");
              // $("#editarRolModal").modal('show');
              // $("#Administrarroles").modal('hide');
              Swal.fire({
                icon: 'success',
                title: "Bien",
                text: 'Eliminado Satisfactoriamente',
                confirmButtonColor: '#2797d2',
              })
              registrarEventosUsuario(TIPO_ACCION_USUARIO.Eliminar, VENTANAS.UsuarioEdocConsulta, "eliminar rol: " + data.nombre);
            }
            
            },
            error: function (xhr, ajaxOptions, throwError) {
            
            // $("#editTrueFalse").html("Eliminado Insatisfactoriamente");
            // $("#editarRolModal").modal('show');
            // $("#Administrarroles").modal('hide');
            Swal.fire( 'Error', 'Eliminado Insatisfactoriamente', 'error' )
            Swal.fire({
                icon: 'error',
                title: "Error",
                text: 'Eliminado Insatisfactoriamente',
                confirmButtonColor: '#2797d2',
              })
            },
            complete: function () {
                tableAdministrarRoles.ajax.reload();
            }
        });
        
    });
});

$("#btnConsultarrr").click(function () {
    if (tableAdministrarRoles != null) {
        tableAdministrarRoles.ajax.reload();
    }
});

$("#botonCrearRol2").click(function () {
    setTimeout(ejecutarTabla, 3000); 
});

$("#botonCrearSolamenteRol2").click(function () {
    setTimeout(ejecutarTabla, 3000); 
});

function ejecutarTabla(){
    tableAdministrarRoles.ajax.reload();
}
