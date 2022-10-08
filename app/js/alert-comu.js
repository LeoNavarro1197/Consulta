// import { WEB_CONFIGURATION_URLS } from '../../../assets/js/web.config (1).js';
// import { WEB_CONFIGURATION_METHODS } from '../../../assets/js/web.config.js';

// const URL = WEB_CONFIGURATION_URLS.API;
// const METHOD = WEB_CONFIGURATION_METHODS.API;

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));

$(function () {
  $("#contenedorProfile").load("../../../dashboard.html"); 
  // return this;
});

function initTag() {
  $("#fin-input").tagsly({
    suggestions: function (input, cb) {},
    beforeSave: function (input) {
      var regex =
        /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!regex.test(input)) {
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
          title: input + " No es válido",
          iconColor: "#fff",
          color: "#fff",
          background: "#ff4747",
        });

        return false;
      }
      localStorage.setItem("newMail", input);
      return true;
    },
    afterSave: function () {
      saveContact();
    },
    placeholder: "",
    maxItems: 5,
    });
  $("#tec-input").tagsly({
    suggestions: function (input, cb) {},
    beforeSave: function (input) {
      var regex =
        /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!regex.test(input)) {
        alert(
          "Correo: " +
            input +
            " no corresponde a un correo electronico válido."
        );
        return false;
      }
      return true;
    },
    afterSave: function (input) {

      saveContact();
    },
    placeholder: "",
    maxItems: 5,

  });
  $("#alert-input").tagsly({
    suggestions: function (input, cb) {},
    beforeSave: function (input) {
      var regex =
        /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!regex.test(input)) {
        alert(
          "Correo: " +
            input +
            " no corresponde a un correo electronico válido."
        );
        return false;
      }
      return true;
    },
    afterSave: function (input) {

      saveContact();
    },
    placeholder: "",
    maxItems: 5,
  });
}

// Obtener Comunicado
$(document).ready(function () {
  obtenerContactos();

  // const API_url =
  //   "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Administration/Administracion/ObtenerComunicadosPorIdTipoDestinatarioPorDestinatario";
  const API_url =
  WEB_CONFIG.api_url.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_com_x_id_tipo_dest_x_dest;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    data: { IdTipoDestinatario: 3, Destinatario: 1 },
    headers: {
      Authorization: "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    success: function (res) {
      var htmlBuilder = "";

      for (var i = 0; i < res.resultado.length; i++) {
        htmlBuilder += "<tr>";
        htmlBuilder +=
          '<td> <button class="btn btn-danger btn-sm"><span class="icon-pdf"></span></button>';
        htmlBuilder +=
          "<td>" +
          new Date(res.resultado[i].fechaRegistra).toLocaleString(
            "es-PA"
          ) +
          "</td>";
        htmlBuilder += "<td>" + res.resultado[i].descripcion + "</td>";
        htmlBuilder += "</tr>";
      }
      $("#tbody").html(htmlBuilder);

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

// Guardar Contacto
function saveContact() {
  var fin_input = document.querySelector("#fin-input").value;
  var tec_input = document.querySelector("#tec-input").value;
  var alert_input = document.querySelector("#alert-input").value;

  // const API_url =
  //       "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Administration/Administracion/GuardarContactosAlertaComunicado";
  const API_url =
  WEB_CONFIG.api_url.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.guardar_contact_alert_com;

      $.ajax({
        type: "POST",
        url: API_url,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify([
          {
            IdTipoContactoAlertaComunicado: 1,
            Correos: fin_input,
            Telefonos: "0979874743;0979874744",
          },
          {
            IdTipoContactoAlertaComunicado: 2,
            Correos: tec_input,
            Telefonos: "0979874743;0979874744",
          },
          {
            IdTipoContactoAlertaComunicado: 3,
            Correos: alert_input,
            Telefonos: "0979874743;0979874744",
          }
        ]),
        headers: {
          Authorization: "Bearer" + `${sessionStorage.getItem("token")}`,
        },
        success: function (res) {

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
            title: "El correo se registró exitosamente",
            iconColor: "#fff",
            color: "#fff",
            background: "#61ff69",
          });
        },
        error: function (xhr, ajaxOptions, throwError) {

          Swal.fire(
            "¡Oh no!",
            `Hubo un error al realizar el proceso \n ${xhr.responseJSON.mensajeRespuesta}`,
            "error"
          );
        },
      });
}

// Obtener contactos
function obtenerContactos() {
  // const API_url =
  //   "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Administration/Administracion/ObtenerContactosAlertaComunicado";
  const API_url =
  WEB_CONFIG.api_url.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_contact_alert_com;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization:
        "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    success: function (res) {
      document.querySelector('#fin-input').value = res.resultado[0].correos;
      document.querySelector('#tec-input').value = res.resultado[1].correos;
      document.querySelector('#alert-input').value = res.resultado[2].correos;

      initTag();
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
}
