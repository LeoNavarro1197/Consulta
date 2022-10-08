import { registrarEventosUsuario } from "../../assets/js/main.js";
// import { TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION } from "../../assets/js/web.config (1).js";
// import { WEB_CONFIGURATION_URLS } from "../../assets/js/web.config (1).js";
// import { WEB_CONFIGURATION_METHODS } from "../../assets/js/web.config.js";
import { KEY_TOKEN } from '../../assets/js/ventanas.config.js';

// const URL = WEB_CONFIGURATION_URLS.API;
// const METHOD = WEB_CONFIGURATION_METHODS.API;

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

// Obtener clientes params
$(document).ready(function () {
  const API_url =
    WEB_CONFIG.api_url.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.total_docu_emi_hoy;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {},
    error: function (xhr, ajaxOptions, throwError) {
      Swal.fire("Error", "error", "error");
    },
  });
});

// Documentos
var tb;

function cargarTabla() {
  tb = $("#tb").DataTable({
    pageLength: 10,
    dom: "Bfrtip",
    buttons: [
      'excel'
    ],
    language: {
      sSearch: "Buscar:",
      sLengthMenu: "Mostrar _MENU_ registros",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
    },
    ajax: {
      url: WEB_CONFIG.api_url.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_docs_x_id_comp_x_cri,
      type: "GET",
      dataType: "json",
      dataSrc: function (respuesta) {
        return respuesta.resultado.documentos;
      },
      data: function (d) {
        var cri_bus_value = $("#slcCriBusqueda").val();
        var des_value = $("#descripcion").val();

        d.IdCriterioBusqueda = cri_bus_value;
        d.Descripcion = des_value;
        d.numItemsOmitir = 0;
        d.numItemsTomar = 100;
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer" + Cookies.get(KEY_TOKEN)
        );
      },
      // success: function (res) {
      //   console.log("res", res);
      // },
      error: function (xhr) {
        console.log(xhr);
      },
    },
    columns: [
      {
        defaultContent:
          "<tr><th style='display: flex' 'scope'='row'><button type='button' data-toggle='modal' data-target='#modalPdf' id='btnPDF' style='border: none;'><span class='icon-pdf'></span></button><button type='button' id='btnXML' style='border: none'><span class='icon-xml'></span></button><button type='button' id='btnZIP' style='border: none'><span class='icon-descargar'></span></button></th></tr>",
        title: "Acción",
        className: "",
        orderable: false,
      },
      { data: "numDocumento", title: "No. Doc", width: "20%" },
      {
        data: "idTipoDocumento",
        title: "Tipo Documento",
        width: "15%",
        render: function (data) {
          if (data == 1) {
            return "<span style='font-size: 1rem;'>Número de Doc</span>";
          } else if (data == 2) {
            return "<span style='font-size: 1rem;'>CUFE</span>";
          }else if (data == 3) {
            return "<span style='font-size: 1rem;'>CUFE</span>";
          }else if (data == 4) {
            return "<span style='font-size: 1rem;'>CUFE</span>";
          }
        },
      },
      {
        data: "razonSocialEmisor",
        title: "Razón Social Emisor",
        width: "15%",
      },
      {
        data: "razonSocialReceptor",
        title: "Razón Social Receptor",
        width: "15%",
      },
      { data: "rucReceptor", title: "RUC", width: "25%" },
      {
        data: "fechaEmision",
        title: "Fecha Emisión",
        width: "25%",
        render: function (data) {
          if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
          return data;
        },
      },
      {
        data: "fechaIngresoEdoc",
        title: "Fecha Registro Edoc",
        width: "25%",
        render: function (data) {
          if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
          return data;
        },
      },
      { data: "cufe", title: "CUFE", width: "80px" },
    ],
  });

  tb.draw();
}

// Import Excel
$('.dt-buttons .buttons-excel').click(() => {
  registrarEventosUsuario(WEB_CONFIG3.acciones_user.exportar_excel, WEB_CONFIG3.id_ventanas.busqueda_x_criterio, "Exportar excel.");
});

// Descargar PDF
$("#tb").on("click", "#btnPDF", function (e) {
  e.preventDefault();
  var data = tb.row($(this).parents("tr")).data();
  $.ajax({
    url:
      WEB_CONFIG.api_url.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_archivo_doc_emi_x_cufe,
    method: "GET",
    data: {
      TipoArchivo: WEB_CONFIG3.tipo_archi_doc_emi.pdf,
      Cufe: data.cufe,
    },
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    beforeSend: function () {
      document.getElementById("PdfModal").style.height = "200px";
    },
    contentType: "application/pdf",
    success: function (res) {
      document.getElementById("spinnerPdf").style.display = "none";

      if (res.resultado != null) {
        document.getElementById("PdfModal").style.height = "400px";
        // var filename = data.cufe + ".pdf";
        var url = "data:application/pdf;base64," + res.resultado;
        $("#framePDF").attr("src", url);

        registrarEventosUsuario(WEB_CONFIG3.acciones_user.descargar_pdf, WEB_CONFIG3.id_ventanas.busqueda_x_criterio, "CUFE: " + data.cufe);
      }
    },
    error: function (xhr, ajaxOptions, throwError) {
      Swal.fire("Error", "error", "error");
    },
  });
});

// Descargar XML
$("#tb").on("click", "#btnXML", function (e) {
  e.preventDefault();
  var data = tb.row($(this).parents("tr")).data();
  $.ajax({
    url:
      WEB_CONFIG.api_url.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_archivo_doc_emi_x_cufe,
    method: "GET",
    data: {
      TipoArchivo: WEB_CONFIG3.tipo_archi_doc_emi.xml,
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

        registrarEventosUsuario(WEB_CONFIG3.acciones_user.descargar_xml, WEB_CONFIG3.id_ventanas.busqueda_x_criterio, "CUFE: " + data.cufe);
      }
    },
    error: function (xhr, ajaxOptions, throwError) {
      Swal.fire("Error", "error", "error");
    },
  });
});

// Descargar ZIP
$("#tb").on("click", "#btnZIP", function (e) {
  e.preventDefault();
  var data = tb.row($(this).parents("tr")).data();
  $.ajax({
    url:
    WEB_CONFIG.api_url.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.obt_archivo_doc_emi_x_cufe,
    method: "GET",
    data: {
      TipoArchivo: WEB_CONFIG3.tipo_archi_doc_emi.zip,
      Cufe: data.cufe,
    },
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    contentType: "application/xml",
    success: function (res) {
      if (res.resultado != null) {
        const linkSource = `data:application/zip;base64,${res.resultado}`;
        const downloadLink = document.createElement("a");
        const fileName = data.cufe + ".zip";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        registrarEventosUsuario(WEB_CONFIG3.acciones_user.descargar_zip, WEB_CONFIG3.id_ventanas.busqueda_x_criterio, "CUFE: " + data.cufe);
      }
    },
    error: function (xhr, ajaxOptions, throwError) {
      Swal.fire("Error", "error", "error");
    },
  });
});

$(document).ready(function () {
  cargarTabla();
});

$("#btnBuscar").click(function () {
  if (tb != null) {
    tb.ajax.reload();
    registrarEventosUsuario(WEB_CONFIG3.acciones_user.consulta, WEB_CONFIG3.id_ventanas.busqueda_x_criterio, "Consulta: Busqueda por criterio.");
  }
});
