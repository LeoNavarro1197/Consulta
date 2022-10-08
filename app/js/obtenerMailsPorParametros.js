import { registrarEventosUsuario } from "../../assets/js/main.js";
// import { TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION } from "../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_URLS } from "../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../assets/js/web.config.js";
import { VENTANAS, TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION, KEY_TOKEN } from '../../assets/js/ventanas.config.js';

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

const URL = WEB_CONFIGURATION_URLS.API;
const METHOD = WEB_CONFIGURATION_METHODS.API;


//////////////////////////////// Búsqueda cliente //////////////////////////////////

var idClienteMail = null;
var estado = false, tipo = false;

var tablaDocumentosSegundo;

var idRolTiposMail;
var idRolEstadosMail;

var fechaDesde;
var fechaHasta;

//------------paramametros parte superior--------------------

var enviadoSinErrores = document.getElementById('enviadoSinErrores');
var enviadoParcialmente = document.getElementById('enviadoParcialmente');
var enColaDeEnvio = document.getElementById('enColaDeEnvio');
var noEnviado = document.getElementById('noEnviado');

var mailsEnviadosHoy = document.getElementById('mailsEnviadosHoy');

function inicializarACeroMail() {
    enviadoSinErrores.textContent = 0;
    enviadoParcialmente.textContent = 0;
    enColaDeEnvio.textContent = 0;
    noEnviado.textContent = 0;
    mailsEnviadosHoy.textContent = 0;
}

function valoresGeneralesMail() {

    $.ajax({
        type: 'GET',
        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_mails_x_params,
        dataType: 'json',
        data: {
            numsItemsOmitir: 0,
            numsItemsTomar: 9999,
            FechaDesde: fechaDesde,
            FechaHasta: fechaHasta
        },
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){
            

            if(idRolEstadosMail == null){
                enviadoSinErrores.textContent = data.resultado.totalEnviados;
                enviadoParcialmente.textContent = data.resultado.totalEnviadosParcialmente;
                enColaDeEnvio.textContent = data.resultado.totalEnColaEnvio;
                noEnviado.textContent = data.resultado.totalNoEnviados;
                mailsEnviadosHoy.textContent = data.resultado.totalEnviados;
            }
            else if(idRolEstadosMail == 0){
                noEnviado.textContent = data.resultado.totalNoEnviados;
            }
            else if(idRolEstadosMail == 1){
                enviadoSinErrores.textContent = data.resultado.totalEnviados;
            }
            else if(idRolEstadosMail == 2){
                enviadoParcialmente.textContent = data.resultado.totalEnviadosParcialmente;
            }
            else if(idRolEstadosMail == -1){
                noEnviado.textContent = data.resultado.totalNoEnviados;
            }
            else if(idRolEstadosMail == -2){
                noEnviado.textContent = data.resultado.totalNoEnviados;
            }
            else if(idRolEstadosMail == -4){
                noEnviado.textContent = data.resultado.totalNoEnviados;
            }
            mailsEnviadosHoy.textContent = data.resultado.totalMails;

        },
        error: function(xhr){
            
        },
        complete: function () {
            
        }
    });
}

function obtenerCliente(){

    $.ajax({
        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_clientes,
        type: 'GET',
        dataType: 'json',
        data: {
            TopConsulta: 9999,
            numsItemsOmitir: 0,
            numsItemsTomar: 7
        },
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data) {
            var plantilla = "";

            for(let i = 0; i < data.resultado.usuarios.length; i++) {
            plantilla += `
                <tr style="cursor: pointer">
                    <th scope="row" style="border-radius: 20px 0px 0px 20px;">
                        <span class="icon-documentos" style="padding: 10px;"></span>
                    </th>
                    <td style="font-size: 12px">${data.resultado.usuarios[i].identificacion}</td>
                    <td style="border-radius: 0px 20px 20px 0px; font-size: 12px;">${data.resultado.usuarios[i].razonSocial}</td>
                </tr>
            `
            }
            $("#datosMail").html(plantilla);
        },
        error: function(err){
            
        }
    
    });
}

function obtenerEstadosMail(){

    $.ajax({
        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_status_mail,
        type: "GET",
        dataType: "json",
        headers: {
          Authorization: "Bearer " + Cookies.get(KEY_TOKEN),
        },
        success: function (data) {
          var plantilla = "";
            

          for (let i = 0; i < data.resultado.length; i++) {
            plantilla += `
                    <div class="lineaHorizontal buscar2menudiv"></div>
                    <option class="dropdown-item buscar2menua" value="${data.resultado[i].id}" href="#">${data.resultado[i].nombre}</option>
                `;
          }
          $("#opciones2").html('<option class="dropdown-item buscar2menua" value="3" selected href="#">Todos los estados de mail</option>' + plantilla);
        },
        error: function (err) {
          
        },
      });
}

$(document).ready(function() {

    var date = new Date();
    const formatDate = (date) => {
        let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        return formatted_date;
    };

    fechaDesde = document.getElementById("fechaDesde").value = formatDate(date)
    fechaHasta = document.getElementById("fechaHasta").value = formatDate(date)

    inicializarACeroMail();

    valoresGeneralesMail();

    document.getElementById("tablaSecundaria").style.display = "none";

    obtenerCliente();

    //------------estados mails-----------------

    obtenerEstadosMail();

    //----------------------------------tabla principal 1----------------------------------
    
    document.getElementById("tablaSecundaria").style.display = "initial";
    setTimeout(ejecutarTabla, 1000);

});

// idClienteMail = $(this).find("td:eq(0)").text();
// $("#buscarMail").val(idClienteMail);

$("#llenarTableBuscarCliente").click(function () {
  
    $("#tablaBuscarClientesMail").DataTable({
      pageLength: 5,
      destroy: true,
      scrollX: true,
      "bLengthChange": false,
      // Multi Select
      select: {
        style: "multi",
        selector: "td:first-child",
      },
      // Select Column
      columnDefs: [
        { className: "dt-center", orderable: false, targets: [1, 2, 3] },
        {
          orderable: false,
          className: "select-checkbox",
          targets: 0,
        },
      ],
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Filtrar",
        lengthMenu: "Mostrar _MENU_ ",
        emptyTable: "No hay información",
        processing: "Procesando...",
        paginate: {
          previous: "<i class='icon-selectorDown-izq' aria-hidden='true'></i>",
          next: "<i class='icon-selectorDown-der' aria-hidden='true'></i>",
        },
        buttons: {
          selectNone: "Borrar selección",
        },
      },
      ajax: {
        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_clientes,
        type: "GET",
        dataType: "json",
        dataSrc: function (respuesta) {
          return respuesta.resultado.usuarios;
        },
        data: function (d) {
          d.TopConsulta = 9999,
          d.numsItemsOmitir = 0,
          d.numsItemsTomar = 7
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader(
            "Authorization",
            "Bearer" + Cookies.get(KEY_TOKEN)
          );
        },
      },
      columns: [
        {
          defaultContent:
          "<tr style='cursor: pointer'><th scope='row' style='border-radius: 20px 0px 0px 20px;'><span class='icon-documentos' style='padding: 10px;'></span></th></tr>",
          title: "Acción",
          className: "colorFuente",
          orderable: false,
          width: "50px",
        },
        {
          data: "identificacion",
          title: "No. identificación",
          className: "colorFuente",
          width: "220px",
          orderable: false,
        },
        {
          data: "razonSocial",
          title: "Nombre o razón social",
          className: "colorFuente",
          width: "220px",
          orderable: false,
        },
        {
          data: "email",
          title: "Email",
          className: "colorFuente",
          width: "200px",
          orderable: false,
        },
      ],
    });
  });

$("#seleccionarClienteMailSelect").click(function () {
    $("#seleccionarClienteMail").val(idClienteMail);
});

$("#clienteSeleccionadoMailSelect").click(function () {
    $("#clienteSeleccionadoMail").val(idClienteMail);
});

//////////////////////////////// Búsqueda //////////////////////////////////
//////////////////////////////// Dropdowns //////////////////////////////////


$("#btnConsultar").click(function (e) {

    const opcionesUno = document.querySelector("#opciones1");

    for(var i = -4; i <= opcionesUno.value; i++) {
        if (opcionesUno.value == i) {
            idRolTiposMail = i;
        }
    }
    
    if(idRolTiposMail == 21){
        idRolTiposMail = null
    }

    const opcionesDos = document.querySelector("#opciones2");

    for(var i = -4; i <= opcionesDos.value; i++) {
        if (opcionesDos.value == i) {
            idRolEstadosMail = i;
        }
    }
    
    if(idRolEstadosMail == 3){
        idRolEstadosMail = null
    }

    //------------fecha hoy--------------------

    fechaDesde = document.getElementById("fechaDesde").value;
    fechaHasta = document.getElementById("fechaHasta").value;

    //------------datos generales-------------

    inicializarACeroMail();

    valoresGeneralesMail();

    //-------------------------------tabla cargada-------------------------------------

    
    ejecutarTabla();
    var info = tablaDocumentosSegundo.page.info();
});  



function ejecutarTabla(){

    tablaDocumentosSegundo = $('#tablaMail2').DataTable( {
        "pageLength": 5,
        "destroy": true,
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
                url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_mails_x_params,
                "type": "GET",
                "dataType": "json",
                "dataSrc": function (respuesta) {
                    //var json={recordsTotal:respuesta.resultado.totalMails,recordsFiltered:respuesta.resultado.totalMails,data:respuesta.resultado.mails};
                    //return json;
                    //this.page.info()={recordsTotal:respuesta.resultado.totalMails,recordsFiltered:respuesta.resultado.totalMails};
                    return respuesta.resultado.mails;
                 },
                //  "fnDrawCallback": function (oSettings) {
                //     console.log(this.api().page.info())
                // },
                "data":
                    function (d) {
                        var info = $('#tablaMail2').pagination.info();
                        d.RucCliente = idClienteMail;
                        d.Estado = idRolEstadosMail;
                        d.TipoMail = idRolTiposMail;
                        d.numsItemsOmitir = 0;
                        d.numsItemsTomar = 9999;
                        d.FechaDesde = fechaDesde;
                        d.FechaHasta = fechaHasta;
                    },
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader("Authorization",
                    "Bearer" + Cookies.get(KEY_TOKEN)
                    )},
                    "error": function (result) {
                        
                    },
                    "complete": function(){
            
                        if ( ! tablaDocumentosSegundo.data().any() ) {
                            
                            enviadoSinErrores.textContent = 0;
                            enviadoParcialmente.textContent = 0;
                            enColaDeEnvio.textContent = 0;
                            noEnviado.textContent = 0;
                            mailsEnviadosHoy.textContent = 0;
                        }
                    }
                },
                "columns": [
                    {
                        defaultContent:
                            "<tr> <th scope='row' class='tablabodyth'> <div class='btn-group tablabodythdivbtngroup'><button type='button' class='btn-default navPaginacionLiA2 focusNone tablabodythdivdropdown' data-toggle='dropdown'><span class='tablathspan icon-opciones'></span></button><ul class='dropdown-menu tablaul' role='menu'><li><a href='#' id='historialConexion' class='tablatha' data-toggle='modal' data-target='#historialdeconexion' style='font-size: 11px;'>Ver historial de eventos</a></li>   </ul></div></div></th></tr>",
                        title: "Acción",
                        "className": "colorFuente",
                        orderable: false,
                        width: "100px"
                    },
                    { "data": "estado", "title": "Estado", "className": "colorFuente", "width": "100px", orderable: false,
                        // render: function (data) {
                        //     var color = 'black';
                        //     if (data === "Enviado") {
                        //         color = 'green';
                        //         }
                        //     if (data === "Correo no válido") {
                        //         color = 'red';
                        //     }
                        //     if (data === "No enviado") {
                        //         color = 'red';
                        //     }
                        //     if (data === "Error de conexión") {
                        //         color = 'red';
                        //     }
                        //     if (data === "Enviado parcialmente") {
                        //         color = 'orange';
                        //     }    

                        //     if (data === "Enviado") {
                        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'Enviado' + '</span>'
                        //     } else if (data === "Correo no válido") {
                        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'Correo no válido' + '</span>'
                        //     } else if (data === "No enviado") {
                        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'No enviado' + '</span>'
                        //     } else if (data === "Error de conexión") {
                        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'Error de conexión' + '</span>'
                        //     } else if (data === "Enviado parcialmente") {
                        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'Enviado parcialmente' + '</span>'
                        //     }
                        // }
                    },
                    { "data": "tipoMail","title": "Tipo Mail", "className": "colorFuente", "width": "200px", orderable: false, },
                    { "data": "fechaEnvio", "title": "Fecha envio", "className": "colorFuente", "width": "200px", orderable: false, 
                        "render": function (data) {
                            if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
                            return data;
                        }
                    },
                    { "data": "destinatario", "title": "Destinatario", "className": "colorFuente", "width": "250px", orderable: false, },
                    { "data": "asunto", "title": "Asunto", "className": "colorFuente", "width": "400px", orderable: false, },
                    { "data": "mensajeError", "title": "Mensaje de error", "className": "colorFuente", "width": "400px", orderable: false, },
                ]
        });
}

$("#clickMailX").click(function () {
    $("#clienteSeleccionadoMail").val(null);
    idClienteMail = null;
});
