import { WEB_CONFIGURATION_URLS } from "../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../assets/js/web.config.js";
import { KEY_TOKEN } from '../../assets/js/ventanas.config.js';

// const URL = WEB_CONFIGURATION_URLS.API;
// const METHOD = WEB_CONFIGURATION_METHODS.API;

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));

const inputs = document.querySelectorAll(".input");
const inputs_rec = document.querySelectorAll(".input-rec");

$(function () {
  $("#contenedorProfile").load("../../../dashboard.html"); 
  // return this;
});

// Obtener Mis Recursos
$(document).ready(function () {
  const API_url =
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.obt_mis_recursos;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      const correo_recepcion = document.getElementById("correoRecepcion");
      const correo_emision = document.getElementById("correoEmision");
      const fecha_caduca = document.getElementById("fechaCaducidad");

      const dataEmi = res.resultado.correoEmision;
      const dataRecep = res.resultado.correoRecepcion;
      const dataFechaCad = new Date(
        res.resultado.fechaCaducaCertificadoDigital
      );

      const dataFechaConverted = dataFechaCad.toLocaleString("es-PA", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      const title_tipo_envio = document.querySelector('#titleTipoEnvioCorreoEmi');

      correo_recepcion.innerHTML = dataRecep;
      correo_emision.innerHTML = dataEmi;
      fecha_caduca.innerHTML = dataFechaConverted;

      if (res.resultado.tipoEnvioCorreoEmision == 0) {
        title_tipo_envio.textContent = "SMTP";
        
      } else if (res.resultado.tipoEnvioCorreoEmision == 1) {
        title_tipo_envio.textContent = "Sengrid";
        
      } else if (res.resultado.tipoEnvioCorreoEmision == 2) {
        title_tipo_envio.textContent = "Amazon";

      }


      localStorage.setItem(
        "tipoEnvioCorreoEmi",
        res.resultado.tipoEnvioCorreoEmision
      );

    },
    error: function (xhr, ajaxOptions, throwError) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        iconColor: "#fff",
        color: "#fff",
        background: "#ff4747",
      });
    },
  });
});

// Obtener data correo recepcion
$(document).ready(function () {
  const API_url =
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.obt_serv_correo_rec;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      inputs_rec[0].value = res.resultado.correo;
      inputs_rec[1].value = res.resultado.clave;
      inputs_rec[2].value = res.resultado.puerto;
      inputs_rec[3].value = res.resultado.servidor;
      inputs_rec[4].value = res.resultado.idServidorCorreoRecepcion;

      if (res.resultado.estado == true) {
        inputs_rec[5].value = "Activo";
      } else {
        inputs_rec[5].value = "Inactivo";
      }

      $("#cbox1Rec").prop("checked", res.resultado.enableSsl);
      $("#cbox2Rec").prop("checked", res.resultado.setearCertValidation);

    },
    error: function (xhr, ajaxOptions, throwError) {
      console.log(xhr);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        iconColor: "#fff",
        color: "#fff",
        background: "#ff4747",
      });
    },
  });
});

const btn_test = document.getElementById("testCorreoRec");

btn_test.addEventListener("click", (e) => {
  e.preventDefault();
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.test_serv_correo_pop3;

  let cbx_rec = $("#cbox1Rec").prop("checked");
  let cbx2_rec = $("#cbox2Rec").prop("checked");
  let input_rec1 = $("#correoRec").val();
  let input_rec2 = $("#passRec").val();
  let input_rec3 = $("#portRec").val();
  let input_rec4 = $("#servRec").val();

  $.ajax({
    type: "GET",
    url: API_url,
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    data: {
      host: input_rec4,
      puerto: input_rec3,
      mail: input_rec1,
      clave: input_rec2,
      ssl: cbx_rec,
      setearCertificado: cbx2_rec,
    },
    success: function (res) {

      if (res.resultado == false) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "error",
          title: "Los datos no pasaron el testeo",
          iconColor: "#fff",
          color: "#fff",
          background: "#ff4747",
        });
      } else if (res.resultado == true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Los datos son validos",
          iconColor: "#fff",
          color: "#fff",
          background: "#6acc52",
        });
      }
    },
    error: function (xhr, ajaxOptions, throwError) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        iconColor: "#fff",
        color: "#fff",
        background: "#ff4747",
      });
    },
  });
});

$(document).ready(function () {
  const API_url =
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.obt_serv_correo_emi;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      inputs[0].value = res.resultado.correo;
      inputs[1].value = res.resultado.clave;
      inputs[2].value = res.resultado.usuario;
      inputs[3].value = res.resultado.servidor;
      inputs[4].value = res.resultado.puerto;

      $("#cbox1").prop("checked", res.resultado.enableSsl);
      $("#cbox2").prop("checked", res.resultado.activarAcuse);
      $("#cbox3").prop("checked", res.resultado.activarPagoOnline);
      $("#cbox4").prop("checked", res.resultado.activarAceptaRechaza);

    },
    error: function (xhr, ajaxOptions, throwError) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: xhr,
        iconColor: "#fff",
        color: "#fff",
        background: "#ff4747",
      });
    },
  });
});

// Mantenimiento Correo Emision
$("#btnEditCorreoEmi").click(function (e) {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.mant_serv_correo_emi;

  let ins = $("#correo").val();
  let ins2 = $("#user1").val();
  let ins3 = $("#serv").val();
  let ins4 = $("#pass").val();
  let ins5 = $("#port").val();

  let cbx = $("#cbox1").prop("checked");
  let cbx2 = $("#cbox2").prop("checked");
  let cbx3 = $("#cbox3").prop("checked");
  let cbx4 = $("#cbox4").prop("checked");

  $.ajax({
    type: "POST",
    url: API_url,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      IdServidorCorreoEmision: 2,
      correo: ins,
      usuario: ins2,
      clave: ins4,
      servidor: ins3,
      puerto: parseInt(ins5),
      enableSsl: cbx,
      activarAcuse: cbx2,
      activarPagoOnline: cbx3,
      activarAceptaRechaza: cbx4,
      nombreMostrar: "GuruSoft S.A.",
      asunto: "Ha recibido un(a) {TipoDocumento} nuevo(a)",
      cuerpo: "cuerpo del correo",
      tipoEnvio: parseInt(localStorage.getItem("tipoEnvioCorreoEmi")),
    }),
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      Swal.fire({
        title: "¡Que bien!",
        text: "El proceso se ha realizado satisfactoriamente",
        icon: "success",
        confirmButtonColor: "#2797d2",
      });
    },
    error: function (xhr, ajaxOptions, throwError) {
      Swal.fire({
        title: "¡Oh no!",
        text: `Hubo un error al realizar el proceso \n ${xhr.responseJSON.mensajeRespuesta}`,
        icon: "error",
        confirmButtonColor: "#2797d2",
      });
    },
  });
});

// Mantenimiento Correo Recepcion
$("#btnEditCorreoRec").click(function (e) {
  const API_url =
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.mant_serv_correo_rec;

  let ins = $("#correoRec").val();
  // let ins2 = $("#user1Rec").val();
  let ins3 = $("#servRec").val();
  let ins4 = $("#passRec").val();
  let ins5 = $("#portRec").val();

  let cbx = $("#cbox1Rec").prop("checked");
  let cbx2 = $("#cbox2Rec").prop("checked");
  let cbx3 = $("#cbox3Rec").prop("checked");

  $.ajax({
    type: "POST",
    url: API_url,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      IdServidorCorreoRecepcion: 0,
      Correo: ins,
      Clave: ins4,
      Servidor: ins3,
      Puerto: parseInt(ins5),
      EnableSsl: cbx,
      ValidacionCertificado: cbx2,
      GuardarAdjunto: cbx3,
      // nombreMostrar: "GuruSoft S.A.",
      // asunto: "Ha recibido un(a) {TipoDocumento} nuevo(a)",
      // cuerpo: "cuerpo del correo",
      // tipoEnvio: parseInt(localStorage.getItem("tipoEnvioCorreoEmi")),
    }),
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      Swal.fire({
        title: "¡Que bien!",
        text: "El proceso se ha realizado satisfactoriamente",
        icon: "success",
        confirmButtonColor: "#2797d2",
      });
    },
    error: function (xhr, ajaxOptions, throwError) {
      Swal.fire({
        title: "¡Oh no!",
        text: `Hubo un error al realizar el proceso \n ${xhr.responseJSON.mensajeRespuesta}`,
        icon: "error",
        confirmButtonColor: "#2797d2",
      });
    },
  });
});

const btn_test_emi_smtp = document.getElementById("btnTestCorreo");

btn_test_emi_smtp.addEventListener("click", (e) => {
  e.preventDefault();
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.test_serv_correo_smtp;

  // let cbx = $("#cbox1SMTP").prop("checked");
  // let input = $("#servSMTP").val();
  // let input2 = $("#portSMTP").val();
  // let input3 = $("#user1SMTP").val();
  // let input4 = $("#correoSMTP").val();
  // let input5 = $("#passSMTP").val();
  let input6 = $("#correoTestSMTP").val();

  $.ajax({
    type: "GET",
    url: API_url,
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    data: {
      // host: input,
      // puerto: input2,
      // mail: input4,
      // usuario: input3,
      // clave: input5,
      // ssl: cbx,
      mailDestino: input6,
    },
    success: function (res) {

      if (res.resultado == false) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "error",
          title: "El Correo no cumple con los requerimientos",
          iconColor: "#fff",
          color: "#fff",
          background: "#ff4747",
        });
      } else if (res.resultado == true) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "El correo cumple con los requerimientos",
          iconColor: "#fff",
          color: "#fff",
          background: "#6acc52",
        });
      }
    },
    error: function (xhr, ajaxOptions, throwError) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        iconColor: "#fff",
        color: "#fff",
        background: "#ff4747",
      });
    },
  });
});

$("#btnMantCorreoEmi").click(function (e) {
  e.preventDefault();

  const var_tipo_envio = localStorage.getItem("tipoEnvioCorreoEmi");

  if (var_tipo_envio == "0") {
    $("#mantCorreoEmisionSMTP").modal("show");
  } else if (var_tipo_envio == "1") {
    $("#mantCorreoEmisionSengrid").modal("show");
  } else if (var_tipo_envio == "2") {
    $("#mantCorreoEmisionAmazon").modal("show");
  }
});

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#pass");

togglePassword.addEventListener("click", function (e) {
  // toggle the type attribute
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  // toggle the eye / eye slash icon
  this.classList.toggle("bi-eye");
});

$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_total_clientes;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      const newData = res.resultado;
      const total_cli_res = document.getElementById("totalCliRes");

      total_cli_res.innerHTML = newData;
    },
    error: function (xhr, ajaxOptions, throwError) {
    },
  });
});

// - Obtener Total Provedores
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_total_proveedores;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      const newData = res.resultado;
      const total_prov_res = document.getElementById("totalProvRes");

      total_prov_res.innerHTML = newData;
    },
    error: function (xhr, ajaxOptions, throwError) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        iconColor: "#fff",
        color: "#fff",
        background: "#ff4747",
      });
    },
  });
});

// Obtener Datos Usuario
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_emision.url + 
  WEB_CONFIG2.api_methods.api_emision.methods.total_docu_emi_hoy;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      const total_fac_emi = document.getElementById("totalFactEmi");
      const data_fact_emi = res.resultado[0].totalPendientesEnviar;

      total_fac_emi.innerHTML = data_fact_emi;

      console.log(res);

    },
    error: function (xhr, ajaxOptions, throwError) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        iconColor: "#fff",
        color: "#fff",
        background: "#ff4747",
      });
    },
  });
});

// - Obtener Facturas Emitidas Hoy
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_total_correos_hoy;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      localStorage.setItem("emails", JSON.stringify(res.resultado));

    },
    error: function (xhr, ajaxOptions, throwError) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "error",
        title: xhr.responseJSON.mensajeRespuesta,
        iconColor: "#fff",
        color: "#fff",
        background: "#ff4747",
      });
    },
  });
});

// Graphics
// Graphic Columns
var options = {
  series: [],
  labels: ["Pendiente por enviar", "En proceso de autorización", "Rechazados", "Autorizados"],
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    locales: [
      {
        name: "es",
        options: {
          months: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ],
          shortMonths: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          days: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          toolbar: {
            exportToSVG: "Descargar SVG",
            exportToPNG: "Descargar PNG",
            // menu: "Menu"
          },
        },
      },
    ],
    defaultLocale: "es",
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
    },
  },
  xaxis: {
    type: "category",
    categories: ["FE", "NC", "ND"],
    labels: {
      format: undefined,
      formatter: undefined,
      datetimeUTC: true,
      datetimeFormatter: {
        year: "yyyy",
        month: "ddd y",
        day: "dd MMM",
        hour: "HH:mm",
      },
    },
  },
  yaxis: {
    show: false
  },
  legend: {
    position: "right",
    offsetY: 40,
    horizontalAlign: "right"
  },
  colors: ["#24356b", "#81f495", "#ed6a5a", "#dea54b"],
  fill: {
    opacity: 1,
  },
  noData: {
    text: 'Loading...'
  }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// Graphic PIE
var options = {
  series: [],
  chart: {
    width: 580,
    height: 320,
    type: "pie",
  },
  labels: ['Correos enviados', 'Correos no enviados', 'Correos pendientes'],
  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: "bottom",
          horizontalAlign: "right"
        },
      },
    },
  ],
  colors: ["#24356b", "#81f495", "#ed6a5a"],
  noData: {
    text: 'Loading...'
  }
};

var chart2 = new ApexCharts(document.querySelector("#chart2"), options);
chart2.render();

const total_doc_emi_hoy_url = WEB_CONFIG.api_url.api_emision.url + WEB_CONFIG2.api_methods.api_emision.methods.total_docu_emi_hoy;

// $(document).ready(() => {
//   $.ajax({
//     beforeSend: function(request) {
//       request.setRequestHeader("Authorization", "Bearer" + `${sessionStorage.getItem("token")}`);
//     },
//     dataType: "json",
//     url: total_doc_emi_hoy_url,
//     success: function(response) {
//       console.log("docu",response);
//         chart2.updateSeries([{
//           name: 'Correos enviados',
//           data: response.resultado.totalEnviados
//         },
//         {
//           name: 'Correos no enviados',
//           data: response.resultado.totalNoEnviados
//         },
//         {
//           name: 'Correos pendientes',
//           data: response.resultado.totalConError
//         }
//       ])
//     }
//   });
// });

const total_correos_hoy_url = WEB_CONFIG.api_url.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_total_correos_hoy;

$(document).ready(() => {
  $.ajax({
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", "Bearer" + `${sessionStorage.getItem("token")}`);
    },
    dataType: "json",
    url: total_correos_hoy_url,
    success: function(response) {
      console.log(response);
        chart2.updateSeries([{
          name: 'Correos enviados',
          data: response.resultado.totalEnviados
        },
        {
          name: 'Correos no enviados',
          data: response.resultado.totalNoEnviados
        },
        {
          name: 'Correos pendientes',
          data: response.resultado.totalConError
        }
      ])
    }
  });
});