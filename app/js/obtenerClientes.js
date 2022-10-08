import { registrarEventosUsuario } from "../../assets/js/main.js";
import { WEB_CONFIGURATION_URLS } from "../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../assets/js/web.config.js";
import { VENTANAS, TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION, KEY_TOKEN } from '../../assets/js/ventanas.config.js';
// import { KEY_TOKEN } from "../../assets/js/ventanas.config.js";

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

const URL = WEB_CONFIGURATION_URLS.API;
const METHODS = WEB_CONFIGURATION_METHODS.API;

var idCliente = null;
var tablaDocumentosSegundo;
var inputEnviarCorreo;

var idRolTipos;
var idRolEstados;

var fechaDesde;
var fechaHasta;

//------------paramametros parte superior--------------------

var autorizadas = document.getElementById("autorizadas");
var rechazadas = document.getElementById("rechazadas");
var pendienteEnvio = document.getElementById("pendienteEnvio");
var pendienteValidacion = document.getElementById("pendienteValidacion");

var facturasEmitidasHoy = document.getElementById("facturasEmitidasHoy");
var notaDebito = document.getElementById("notaDebito");
var notaCredito = document.getElementById("notaCredito");

var totalDocumentos = document.getElementById("totalDocumentos");

//----------------valores generales--------------------------------

function inicializarACero(){
  autorizadas.textContent = 0;
  rechazadas.textContent = 0;
  pendienteEnvio.textContent = 0;
  pendienteValidacion.textContent = 0;
  facturasEmitidasHoy.textContent = 0;
  notaDebito.textContent = 0;
  notaCredito.textContent = 0;
  totalDocumentos.textContent = 0;
}

function valoresGenerales() {

  $.ajax({
    type: 'GET',
    url: WEB_CONFIG.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_docs_x_id_comp_x_params,
    dataType: 'json',
    data: {
        numItemsOmitir: 0,
        numItemsTomar: 9999,
        FechaDesde: fechaDesde,
        FechaHasta: fechaHasta
    },
    headers: {
        Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
    },
    // headers: {
    //     Authorization: "Bearer " + Cookies.get('token')
    // },
    success: function(data){
        
        if(idRolEstados == null){
            rechazadas.textContent = data.resultado.totalAutorizados;
            autorizadas.textContent = data.resultado.totalNoAutorizados;
            pendienteEnvio.textContent = data.resultado.totalPendientesEnviar;
            pendienteValidacion.textContent = data.resultado.totalEnProcesoAutorizacion;
        }
        else if(idRolEstados == 1){
          pendienteEnvio.textContent = data.resultado.totalEnProcesoAutorizacion;
        }
        else if(idRolEstados == 2){
          autorizadas.textContent = data.resultado.totalAutorizados
        }
        else if(idRolEstados == 3){
          rechazadas.textContent = data.resultado.totalNoAutorizados;
        }
        else if(idRolEstados == 4){
          rechazadas.textContent = data.resultado.totalNoAutorizados;
        }
        else if(idRolEstados == 5){
          pendienteValidacion.textContent = data.resultado.totalEnProcesoAutorizacion;
        }
        else if(idRolEstados == 6){
          rechazadas.textContent = data.resultado.totalNoAutorizados;
        }
        else if(idRolEstados == 7){
          pendienteEnvio.textContent = data.resultado.totalPendientesEnviar;
        }
        else if(idRolEstados == 10){
          autorizadas.textContent = data.resultado.totalAutorizados
        }
        else if(idRolEstados == 11){
          rechazadas.textContent = data.resultado.totalNoAutorizados;
        }
        else if(idRolEstados == 12){
          pendienteEnvio.textContent = data.resultado.totalPendientesEnviar;
        }

        if(idRolTipos == 1){
            facturasEmitidasHoy.textContent = data.resultado.totalNotasDebito;
        }
        else if(idRolTipos == 3){
            notaDebito.textContent = data.resultado.totalFacturas;
        }
        else if(idRolTipos == 2){
            notaCredito.textContent = data.resultado.totalNotasCredito;
        }
        else if(idRolTipos == null){
            facturasEmitidasHoy.textContent = data.resultado.totalNotasDebito;
            notaDebito.textContent = data.resultado.totalFacturas;
            notaCredito.textContent = data.resultado.totalNotasCredito;
        }
      
        totalDocumentos.textContent = data.resultado.totalDocumentos;
    },
    error: function(xhr, ajaxOptions, throwError){
      
    }
  });
}

function obtenerEstadosEmision(){

  $.ajax({
    url: WEB_CONFIG.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_status_emi,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + Cookie.get(KEY_TOKEN)
    },
    success: function (data) {
      console.log(data);
      var plantilla = "";
      

      for (let i = 0; i < data.resultado.length; i++) {
        plantilla += `
                <div class="lineaHorizontal buscar2menudiv"></div>
                <option class="dropdown-item buscar2menua" value="${data.resultado[i].id}" href="#">${data.resultado[i].nombre}</option>
            `;
      }
      $("#opciones2").html('<option class="dropdown-item buscar2menua" value="0" selected href="#">Todos los estados de documentos</option>' + plantilla);
    },
    error: function (err) {
      console.error(err);
    },
  });
}

function obtenerTiposEmision() {

  $.ajax({
    url: WEB_CONFIG.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_tipos_emi,
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
      $("#opciones1").html('<option class="dropdown-item buscar2menua" value="0" selected href="#">Todos los tipos de documentos</option>' + plantilla);
    },
    error: function (err) {
      
    },
  });
}

$(document).ready(function () {

  var date = new Date();
  const formatDate = (date) => {
    let formatted_date =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    return formatted_date;
  };

  fechaDesde = document.getElementById("fechaDesde").value = formatDate(date)
  fechaHasta = document.getElementById("fechaHasta").value = formatDate(date)

  inicializarACero();

  valoresGenerales();

  //--------------tagsly-----------------

  $("#enviarCorreoInput").tagsly({
    suggestions: function (input, cb) {},
    placeholder: "",
    maxItems: 5,
  });

  //-----------------------------buscar id de cliente----------------------------

  document.getElementById("tablaSecundaria").style.display = "none";

  //------------estados documentos-----------------

  obtenerEstadosEmision();

  //------------tipos documentos-----------------

  obtenerTiposEmision();

  //----------------------------------tabla principal 1----------------------------------

  document.getElementById("tablaSecundaria").style.display = "initial";
  setTimeout(ejecutarTabla, 1000);
});

//-----------------------------buscar id de cliente----------------------------

  // idCliente = $(this).find("td").text();
  // $("#buscar").val(idCliente);

$("#llenarTableBuscarCliente").click(function () {
  
  $("#tablaBuscarClientesGeneral").DataTable({
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

$("#seleccionarClienteSelect").click(function () {
  $("#seleccionarCliente").val(idCliente);
});

$("#clienteSeleccionadoSelect").click(function () {
  $("#clienteSeleccionado").val(idCliente);
});

//////////////////////////////// Dropdowns //////////////////////////////////

//////////////////////////////// Búsqueda //////////////////////////////////

$("#btnConsultarGeneral").click(function (e) {

  const opcionesUno = document.querySelector("#opciones1");

  for(var i = 0; i <= opcionesUno.value; i++) {
    if (opcionesUno.value == i) {
      idRolTipos = i;
    }
  }

  if(idRolTipos == 0){
    idRolTipos = null
  }

  const opcionesDos = document.querySelector("#opciones2");

  for(var i = 0; i <= opcionesDos.value; i++) {
    if (opcionesDos.value == i) {
      idRolEstados = i;
    }
  }

  if(idRolEstados == 0){
    idRolEstados = null
  }

  //------------fecha hoy--------------------

  // var date = new Date();
  // const formatDate = (date) => {
  //   let formatted_date =
  //     date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  //   return formatted_date;
  // };

  // if(fechaDesde == formatDate(date) && fechaHasta == formatDate(date)){
  //   fechaDesde = formatDate(date)
  //   fechaHasta = formatDate(date)
  // }else{
  //   fechaDesde = document.getElementById("fechaDesde").value;
  //   fechaHasta = document.getElementById("fechaHasta").value;
  // }

  fechaDesde = document.getElementById("fechaDesde").value;
  fechaHasta = document.getElementById("fechaHasta").value;

  //------------datos generales-------------

  inicializarACero();

  valoresGenerales();

  //-------------------------------tabla cargada-------------------------------------

  setTimeout(ejecutarTabla, 1000);

});

function ejecutarTabla() {
  tablaDocumentosSegundo = $("#tablaDocumentos2").DataTable({
    pageLength: 5,
    destroy: true,
    scrollX: true,
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
      url: WEB_CONFIG.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_docs_x_id_comp_x_params,
      type: "GET",
      dataType: "json",
      dataSrc: function (respuesta) {
        console.log(respuesta)
        return respuesta.resultado.documentos;
      },
      data: function (d) {
        d.RucReceptor = idCliente;
        d.IdEstadoDocumento = idRolEstados;
        d.IdTipoDocumento = idRolTipos;
        d.numItemsOmitir = 0;
        d.numItemsTomar = 9999;
        d.FechaDesde = fechaDesde;
        d.FechaHasta = fechaHasta;
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer" + Cookies.get(KEY_TOKEN)
        );
      },
      error: function (result) {
        
      },
      complete: function () {
        if (!tablaDocumentosSegundo.data().any()) {
          
          autorizadas.textContent = 0;
          rechazadas.textContent = 0;
          pendienteEnvio.textContent = 0;
          pendienteValidacion.textContent = 0;
          facturasEmitidasHoy.textContent = 0;
          notaDebito.textContent = 0;
          notaCredito.textContent = 0;
          totalDocumentos.textContent = 0;
          
        }
      },
    },
    columns: [
      {
        defaultContent:
          "<tr> <th scope='row' class='tablabodyth'> <div class='tablabodythdiv'> <button id='descargarPdf' data-toggle='modal' data-target='#modalPdf' class='focusNone navPaginacionLiA3 tablabodythdivbtn1'><span class='icon-pdf tablabodythdivbtn1span1'></span></button> <button id='descargarXml' class='focusNone navPaginacionLiA tablabodythdivbtn1' data-toggle='modal' data-target='#editUser'><span class='icon-xml tablabodythdivbtn1span2'></span></button><button id='descargarZip' class='focusNone navPaginacionLiA tablabodythdivbtn1'><span class='icon-descargar tablabodythdivbtn1span1'></span></button><div class='btn-group tablabodythdivbtngroup'><button type='button' class='btn-default navPaginacionLiA2 focusNone tablabodythdivdropdown' data-toggle='dropdown'><span class='tablathspan icon-opciones'></span></button><ul class='dropdown-menu tablaul' role='menu'><li><a href='#' id='historialConexion' class='tablatha' data-toggle='modal' data-target='#historialdeconexion' style='font-size: 11px;'>Ver historial de conexión</a></li>  <li><a href='#' id='reenviarcorreo' class='tablatha' data-toggle='modal' data-target='#verreenviarcorreo' style='font-size: 11px;'>Reenviar correo</a></li> </ul></div></div></th></tr>",
        title: "Acción",
        className: "colorFuente",
        orderable: false,
        width: "150px",
      },
      {
        data: "estadoDocumento",
        title: "Estado Documento",
        className: "colorFuente",
        width: "100px",
        orderable: false,
        // render: function (data) {
        //     var color = 'black';
        //     if (data === 0) {
        //         color = 'orange';
        //         }
        //     if (data === 1) {
        //         color = 'green';
        //     }
        //     if (data === 2) {
        //         color = 'red';
        //     }
        //     if (data === -1) {
        //         color = 'red';
        //     }
        //     if (data === -2) {
        //         color = 'red';
        //     }
        //     if (data === 1) {
        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'Autorizados' + '</span>'
        //     } else if (data === 0) {
        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'No enviado' + '</span>'
        //     } else if (data === 2) {
        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'Rechazados' + '</span>'
        //     } else if (data === -1) {
        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'Devueltos' + '</span>'
        //     } else if (data === -2) {
        //         return '<span style="color:' + color + '; font-size: 13px;">' + 'Error en firma' + '</span>'
        //     }
        //     }
      },
      {
        data: "numDocumento",
        title: "Número Documento",
        className: "colorFuente",
        width: "150px",
        orderable: false,
      },
      {
        data: "tipoDocumento",
        title: "Tipo Documento",
        className: "colorFuente",
        width: "100px",
        orderable: false,
        // render: function (data) {
        //     var color = 'black';
        //     if (data === 0) {
        //         color = 'green';
        //         }
        //     if (data === 1) {
        //         color = 'green';
        //     }
        //     if (data === 2) {
        //         color = 'green';
        //     }
        //     if (data === 1) {
        //         return '<span style=" font-size: 13px;">' + 'Nota Débito' + '</span>'
        //     } else if (data === 0) {
        //         return '<span style=" font-size: 13px;">' + 'Factura' + '</span>'
        //     } else if (data === 2) {
        //         return '<span style=" font-size: 13px;">' + 'Nota Crédito' + '</span>'
        //     }
        //     }
      },
      {
        data: "razonSocialEmisor",
        title: "Razón Social Emisor",
        className: "colorFuente",
        width: "100px",
        orderable: false,
      },
      {
        data: "razonSocialReceptor",
        title: "Razón Social Receptor",
        className: "colorFuente",
        width: "100px",
        orderable: false,
      },
      {
        data: "rucReceptor",
        title: "Ruc Receptor",
        className: "colorFuente",
        width: "150px",
        orderable: false,
      },
      {
        data: "fechaEmision",
        title: "Fecha Emision",
        className: "colorFuente",
        width: "100px",
        orderable: false,
        render: function (data) {
          if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
          return data;
        },
      },
      {
        data: "fechaIngresoEdoc",
        title: "Fecha Ingreso Edoc",
        className: "colorFuente",
        width: "100px",
        orderable: false,
        render: function (data) {
          if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
          return data;
        },
      },
      {
        data: "cufe",
        title: "Cufe",
        className: "colorFuente",
        width: "500px",
        orderable: false,
      },
    ],
  });
}

//--------------------------------visualizar PDF---------------------------------------

$("#tablaDocumentos2").on("click", "#descargarPdf", function (e) {
  
  e.preventDefault();
  var data = tablaDocumentosSegundo.row($(this).parents("tr")).data();

  $.ajax({
    url: WEB_CONFIG.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_archivo_doc_emi_x_cufe,
    method: "GET",
    data: {
      TipoArchivo: TIPO_ARCHIVO_DOCUMENTO_EMISION.Pdf,
      Cufe: data.cufe,
    },
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    beforeSend: function () {
      // $("#framePDF").attr("");
      $("#spinnerPdf").html("<span class='sr-only'>Loading...</span>");
      document.getElementById("PdfModal").style.height = "200px";
    },
    contentType: "application/pdf",
    success: function (res) {
      if(res.resultado != null){
        document.getElementById("spinnerPdf").style.display = "none";
        document.getElementById("PdfModal").style.height = "400px";
        var filename = data.cufe + ".pdf";
        var url = "data:application/pdf;base64," + res.resultado;
        $("#framePDF").attr("src", url);
        
        registrarEventosUsuario(TIPO_ACCION_USUARIO.DescargaPDF, VENTANAS.MonitorGeneral, "CUFE: " + data.cufe);
      }
    },
    error: function (xhr, ajaxOptions, throwError) {
      
      Swal.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        text: "Error",
        confirmButtonColor: "#2797d2",
      });
    },
  });
});

//-----------------------------descargar XML----------------------------------

$("#tablaDocumentos2").on("click", "#descargarXml", function (e) {
  
  e.preventDefault();
  var data = tablaDocumentosSegundo.row($(this).parents("tr")).data();

  $.ajax({
    url: WEB_CONFIG.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_archivo_doc_emi_x_cufe,
    method: "GET",
    data: {
      TipoArchivo: TIPO_ARCHIVO_DOCUMENTO_EMISION.Xml,
      Cufe: data.cufe,
    },
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    contentType: "application/xml",
    success: function (res) {
      if (res.resultado != null) {
        const linkSource = `data:application/xml;base64,${res.resultado}`;
        const downloadLink = document.createElement("a");
        const fileName = data.cufe + ".xml";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        registrarEventosUsuario(TIPO_ACCION_USUARIO.DescargarXML, VENTANAS.MonitorGeneral, "CUFE: " + data.cufe);
      }
    },
    error: function (xhr, ajaxOptions, throwError) {
      
      Swal.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        text: "Error",
        confirmButtonColor: "#2797d2",
      });
    },
  });
});

//-----------------------------descargar ZIP----------------------------------

$("#tablaDocumentos2").on("click", "#descargarZip", function (e) {
  
  e.preventDefault();
  var data = tablaDocumentosSegundo.row($(this).parents("tr")).data();

  $.ajax({
    url: WEB_CONFIG.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_archivo_doc_emi_x_cufe,
    method: "GET",
    data: {
      TipoArchivo: TIPO_ARCHIVO_DOCUMENTO_EMISION.Zip,
      Cufe: data.cufe,
    },
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    contentType: "application/xml",
    success: function (res) {
      if (res.resultado != null) {
        const linkSource = `data:application/xml;base64,${res.resultado}`;
        const downloadLink = document.createElement("a");
        const fileName = data.cufe + ".zip";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        registrarEventosUsuario(TIPO_ACCION_USUARIO.DescargarZIP, VENTANAS.MonitorGeneral, "CUFE: " + data.cufe);
      }
    },
    error: function (xhr, ajaxOptions, throwError) {
      
      Swal.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        text: "Error",
        confirmButtonColor: "#2797d2",
      });
    },
  });
});

//-----------------------------Reenviar correo----------------------------------

$("#tablaDocumentos2").on("click", "#reenviarcorreo", function (e) {
  
  e.preventDefault();
  var data = tablaDocumentosSegundo.row($(this).parents("tr")).data();
  var btnEnviarCorreo = document.querySelector("#enviarVariosCorreos");

  btnEnviarCorreo.addEventListener("click", () => {
    inputEnviarCorreo = $("#enviarCorreoInput").val();
    inputEnviarCorreo = inputEnviarCorreo.replace(",", ";") + ";";

    $.ajax({
      url: WEB_CONFIG.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.reenv_mail_doc_emi,
      method: "GET",
      data: {
        Cufe: data.cufe,
        Destinatarios: inputEnviarCorreo,
      },
      headers: {
        Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
      },
      success: function (res) {
        
        if(res != null){
          
          Swal.fire({
            icon: "success",
            title: "Correo enviado exitosamente",
            text: "Bien",
            confirmButtonColor: "#2797d2",
          });
          registrarEventosUsuario(TIPO_ACCION_USUARIO.ReenviarCorreoDocumentoEmitido, VENTANAS.MonitorGeneral, "CUFE: " + data.cufe);
        }
      },
      error: function (xhr, ajaxOptions, throwError) {
        
        Swal.fire({
          icon: "error",
          title: xhr.responseJSON.mensajeRespuesta,
          text: "Error",
          confirmButtonColor: "#2797d2",
        });
      },
    });
  });
  $("#enviarCorreoInput").val("");
});

$("#clickX").click(function () {
  $("#clienteSeleccionado").val(null);
  idCliente = null;
});

