import { registrarEventosUsuario } from "../../../assets/js/main.js";
import { WEB_CONFIGURATION_URLS } from "../../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../../assets/js/web.config.js";
import { VENTANAS, TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION, KEY_TOKEN } from '../../../assets/js/ventanas.config.js';

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

const URL = WEB_CONFIGURATION_URLS.API;
const METHODS = WEB_CONFIGURATION_METHODS.API;

var identificarEditarRol, identificarEditarNombreRol;

var tableHistorialConexion;

//----------------tabla principal------------------

var table;
function cargarTabla() {
  table = $("#tablaUsuariosConsulta").DataTable({
    // dom: 'Bfrtip',
    pageLength: 5,
    "scrollX": true,
          // Multi Select
          select: {
            style: "multi",
            selector: "td:first-child"
          },
          // Select Column
          columnDefs: [
            {className: "dt-center",orderable: false, targets: [1,2,3]},
            {
              orderable: false,
              className: "select-checkbox",
              targets: 0
            }
          ],
          language: {
                search: "_INPUT_",
                searchPlaceholder: "Filtrar",
                lengthMenu: "Mostrar _MENU_ ",
                "emptyTable": "No hay información",
                "processing": "Procesando...",
                "paginate": {
                    "previous": "<i class='icon-selectorDown-izq' aria-hidden='true'></i>",
                    "next": "<i class='icon-selectorDown-der' aria-hidden='true'></i>"
                },
                buttons: {
                    selectNone: "Borrar selección"
                }
        },
    "ajax": {
            url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_users_consul,
            "type": "GET",
            "dataType": "json",
            "dataSrc": function (respuesta) {
                
                return respuesta.resultado.usuarios;
                },
            "data":
                function (d) {
                    d.Coincidencia = null;
                    d.TopConsulta = 9999;
                    d.numsItemsOmitir = 0;
                    d.numsItemsTomar = 9999;
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
                        "<tr> <th scope='row' class='tablabodyth'> <div class='tablabodythdiv'> <button id='borrarUsuario' class='focusNone tablabodythdivbtn1'><span class='icon-close tablabodythdivbtn1span1'></span></button> <button id='editarUsuario' class='focusNone tablabodythdivbtn1' data-toggle='modal' data-target='#editUser'><span class='icon-editar tablabodythdivbtn1span2'></span></button><div class='btn-group tablabodythdivbtngroup'><button type='button' class='btn-default focusNone tablabodythdivdropdown' data-toggle='dropdown'><span class='tablathspan icon-opciones'></span></button><ul class='dropdown-menu tablaul' role='menu'><li><a href='#' id='historialConexion' class='tablatha' data-toggle='modal' data-target='#historialdeconexion' style='font-size: 11px;'>Ver historial de conexión</a></li>  <li><a href='#' id='historialActividad' class='tablatha' data-toggle='modal' data-target='#historialdeactividad' style='font-size: 11px;'>Ver historial de actividad</a></li> </ul></div></div></th></tr>",
                    title: "Acción",
                    className: "colorFuente",
                    orderable: false,
                    width: "150px"
                    },
                { "data": "email", "title": "Email",  "className": "colorFuente", width: "250px", orderable: false,},
                { "data": "estado","title": "Estado",  "className": "colorFuente", orderable: false, 
                render: function (data) {
                    var color = 'black';
                    if (data === 1) {
                      color = 'black';
                    } 
                    if (data === 0) {
                      color = 'black';
                    }
                    if (data === 1) {
                      return '<span style=" font-size: 13px;">' + 'Activo' + '</span>'
                    } else if (data === 0) {
                      return '<span style=" font-size: 13px;">' + 'Inactivo' + '</span>'
                    }
                  } 
                },
                { "data": "fechaCreacion","title": "Fecha Creación", "className": "colorFuente", width: "150px",
                    "render": function (data) {
                        if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
                        return data;
                    }
                },
                { "data": "idUsuario","title": "Id Usuario", "className": "colorFuente", width: "100px", orderable: false, },
                { "data": "ipLogin","title": "Ip Login",  "className": "colorFuente", width: "100px", orderable: false, },
                { "data": "nombre","title": "Nombre",  "className": "colorFuente", orderable: false, },
                { "data": "telefono","title": "Telefono",  "className": "colorFuente", orderable: false, },
                { "data": "ultimaConexion","title": "Última Conexión",  "className": "colorFuente", width: "150px", orderable: false,
                    "render": function (data) {
                        if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
                        return data;
                    }
                },
                { "data": "usuario","title": "Usuario",  "className": "colorFuente", orderable: false,},
                // { "data": "idRol","title": "Id Rol", "className": "colorFuente" },
            ]
  });
}

$(document).ready(function () {

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
            Authorization: "Bearer " + Cookie.get(KEY_TOKEN)
        },
        success: function(data){
        
            var plantilla = "";

            for(let i = 0; i < data.resultado.roles.length; i++) {
                plantilla += `
                    <option id="${[i]}" onclick="asignarInput()" value="${data.resultado.roles[i].idRol}">${data.resultado.roles[i].nombre}</option>
                `
            }
        $("#opciones3").html(`<option value="null">Seleccionar Rol</option>` + plantilla);
        },
        error: function(err){
            
        }
    });

    

    //-------------------editar usuario-------------------------

    cargarTabla();

    $("#tablaUsuariosConsulta tbody").on("click", "#editarUsuario", function (e) {
        
        e.preventDefault();
        var data = table.row($(this).parents("tr")).data();
        var input_edit = document.querySelectorAll(".input-edit");
        var btnEditUser = document.querySelector("#btnEditUser");
        
        input_edit[0].value = data.nombre;
        input_edit[1].value = data.usuario;
        input_edit[2].value = data.email;
        input_edit[3].value = data.telefono;
        input_edit[4].value = data.idRol;
        
        btnEditUser.addEventListener("click", () => {

        //------------identificar el rol--------------

        identificarEditarRol = document.getElementById("opciones3").value;
        
        identificarEditarNombreRol = $("#opciones option:selected").text();
        

        var numeroEntero = Number(identificarEditarRol);
        // data.idRol = numeroEntero

        $.ajax({
            url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.mant_user_consul,
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                IdUsuario: data.idUsuario,
                Usuario: input_edit[1].value,
                Nombre: input_edit[0].value,
                Email: input_edit[2].value,
                Telefono: input_edit[3].value,
                IdRol: numeroEntero,
                Estado: true,
              }),
            headers: {
            Authorization:
                "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
            },
            success: function (res) {
                if(res.resultado == true){
                    
                    // $("#editTrueFalse").html("Usuario Editado Satisfactoriamente");
                    // $("#editarRolModal").modal('show');
                    Swal.fire({
                        icon: 'success',
                        title: "Bien",
                        text: 'Usuario Editado Satisfactoriamente',
                        confirmButtonColor: '#2797d2',
                    })
                    registrarEventosUsuario(TIPO_ACCION_USUARIO.Editar, VENTANAS.UsuarioEdocConsulta, "nombre del usuario: " + input_edit[1].value);
                }
            },
            error: function (xhr, ajaxOptions, throwError) {
            
            // $("#editTrueFalse").html("No se pudo editar");
            // document.getElementById("agrandarModal").style.width = "400px";
            // document.getElementById("para").style.paddingRight = "400px";
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo editar',
                confirmButtonColor: '#2797d2',
              })
            
            $("#editarRolModal").modal('show');
            },
            complete: function () {
                table.ajax.reload();
            }
        });
        
        });
        
    });

    //-----------------borrar usuario-----------------------

    $("#tablaUsuariosConsulta tbody").on("click", "#borrarUsuario", function (e) {
        
        e.preventDefault();
        var data = table.row($(this).parents("tr")).data();
        
        
        $.ajax({
            url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.mant_user_consul,
            method: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                IdUsuario: data.idUsuario,
                Usuario: data.usuario,
                Nombre: data.nombre,
                Email: data.email,
                Telefono: data.telefono,
                IdRol: data.idRol,
                Estado: false,
              }),
            headers: {
            Authorization:
                "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
            },
            success: function (res) {
                if(res.resultado == true){
                    
                    // $("#editTrueFalse").html("Usuario Eliminado Satisfactoriamente");
                    // $("#editarRolModal").modal('show');
                    Swal.fire({
                        icon: 'success',
                        title: "Bien",
                        text: 'Usuario Eliminado Satisfactoriamente',
                        confirmButtonColor: '#2797d2',
                    })
                    registrarEventosUsuario(TIPO_ACCION_USUARIO.Eliminar, VENTANAS.UsuarioEdocConsulta, "nombre del usuario: " + data.usuario);
                }
                
                },
            error: function (xhr, ajaxOptions, throwError) {
                
                // $("#editTrueFalse").html("No se pudo eliminar");
                // document.getElementById("agrandarModal").style.width = "400px";
                // document.getElementById("para").style.paddingRight = "400px";
                // $("#editarRolModal").modal('show');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar',
                    confirmButtonColor: '#2797d2',
                  })
            },
            complete: function () {
                table.ajax.reload();
            }
        });
        
    });

    //---------------------historial de conexion------------------

    $("#tablaUsuariosConsulta tbody").on("click", "#historialConexion", function (e) {
        e.preventDefault();
        var data = table.row($(this).parents("tr")).data();

        tableHistorialConexion = $('#tablaHistorialConexion').DataTable( {
            "pageLength": 2,
            "destroy": true,
            "bLengthChange": false,
            // "scrollX": true,
            searching: false,
            // Multi Select
          select: {
            style: "multi",
            selector: "td:first-child"
          },
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Buscar",
            "paginate": {
                "previous": "<i class='icon-selectorDown-izq' aria-hidden='true'></i>",
                "next": "<i class='icon-selectorDown-der' aria-hidden='true'></i>"
            },
            
        },
            "ajax": {
                    url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_histo_conex_x_id_user_consul,
                    "type": "GET",
                    "dataType": "json",
                    "dataSrc": function (respuesta) {
                        
                        return respuesta.resultado;
                        },
                    "data":
                        function (c) {
                            c.IdUsuario = data.idUsuario
                        },
                    "beforeSend": function (xhr) {
                        xhr.setRequestHeader("Authorization",
                        "Bearer" + Cookies.get(KEY_TOKEN)
                        )},
                        "error": function (result) {
                            
                        }
                    },
                    "columns": [
                        { "data": "fechaHora", "title": "Hora y fecha", "className": "colorFuente", width: "200px", orderable: false,
                            "render": function (data) {
                                if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
                                return data;
                            }
                        },
                        // { "data": "usuario","title": "Usuario", "width": "10%" },
                        { "data": "ipConexion","title": "Ip conexión", "className": "colorFuente", width: "200px", orderable: false,},
                    ]
        }); 
        // $(".dataTables_wrapper").css("width","670px");
    });

    //---------------------historial de actividad------------------

    $("#tablaUsuariosConsulta tbody").on("click", "#historialActividad", function (e) {
        e.preventDefault();
        var data = table.row($(this).parents("tr")).data();

        tableHistorialActividad = $('#tablaHistorialActividad').DataTable( {
            "pageLength": 2,
            "destroy": true,
            "bLengthChange": false,
            // "scrollX": true,
            searching: false,
            // Multi Select
          select: {
            style: "multi",
            selector: "td:first-child"
          },
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Buscar",
            "paginate": {
                "previous": "<i class='icon-selectorDown-izq' aria-hidden='true'></i>",
                "next": "<i class='icon-selectorDown-der' aria-hidden='true'></i>"
            },
            
        },
            "ajax": {
                    url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_historial_event_user_consul,
                    "type": "GET",
                    "dataType": "json",
                    "dataSrc": function (respuesta) {
                        
                        return respuesta.resultado.eventos;
                        },
                    "data":
                        function (c) {
                            c.IdUsuario = data.idUsuario
                            c.FechaDesde = "2021-01-01",
                            c.FechaHasta = "2022-01-14",
                            c.numsItemsOmitir = 0,
                            c.numsItemsTomar = 9999
                        },
                    "beforeSend": function (xhr) {
                        xhr.setRequestHeader("Authorization",
                        "Bearer" + Cookies.get(KEY_TOKEN)
                        )},
                        "error": function (result) {
                            
                        }
                    },
                    "columns": [
                        { "data": "fechaHoraEvento", "title": "Hora y fecha", "className": "colorFuente", width: "200px", orderable: false,
                            "render": function (data) {
                                if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
                                return data;
                            }
                        },
                        // { "data": "usuario","title": "Usuario", "width": "10%" },
                        { "data": "usuario","title": "Usuario", "className": "colorFuente", width: "200px", orderable: false},
                        { "data": "ventana","title": "Módulo/ventana", "className": "colorFuente", width: "200px", orderable: false},
                        { "data": "accion","title": "Acción", "className": "colorFuente", width: "200px", orderable: false},
                    ]
        }); 
        // $(".dataTables_wrapper").css("width","670px");
    });
});

// $("#btnEditRol").click(function () {
//     setTimeout(ejecutarTabla, 1000); 
// });

$("#btnFinalizar").click(function () {
    setTimeout(ejecutarTabla, 1000); 
});

// $("#botonCrearRol2").click(function () {
//     setTimeout(ejecutarTabla, 1000); 
// });

// $("#botonCrearSolamenteRol2").click(function () {
//     setTimeout(ejecutarTabla, 1000); 
// });

// $("#btnEditRol").click(function () {
//     setTimeout(ejecutarTabla, 1000); 
// });

function ejecutarTabla(){
    table.ajax.reload()
}





