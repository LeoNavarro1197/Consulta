// import { api } from '../../../../web.config.json';
// import { from '../../../../web2.config.json';

// const URL = api.api_auth.url + api.api_auth.methods.auth;

// var api_auth = {}

// api_auth = {
//   data
// }

// console.log(api_auth);
// const data_api;
// var api_method;
// console.log(auth);

// console.log(data_api);

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));

$(function () {
  $("#contenedorProfile").load("../../../../dashboard.html"); 
  // return this;
});

// Obtener Datos Usuario
$(document).ready(function () {
  // const API_url = URL.API_SECURITY.URL + URL.API_SECURITY.METHODS.OBT_MIS_DATOS_USUARIO;
  
  $.ajax({
    type: "GET",
    url: WEB_CONFIG.api_url.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_mis_datos_user,
    dataType: "json",
    headers: {
      Authorization:
        "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    success: function (res) {
      let inputs = document.querySelectorAll('.form-control');

      inputs[0].value = res.resultado.nombre;
      inputs[1].value = res.resultado.usuario;
      inputs[2].value = res.resultado.email;
      inputs[3].value = res.resultado.nombreRol;

      console.log(res);
    },
    error: function (xhr, ajaxOptions, throwError) {
      console.log("error");
    },
  });
});

$(function () {
  console.log("mi cuenta")
  $("#contenedorProfile").load("../../../dashboard.html"); 
  // return this;
  // $("#contenedorProfile").load("../../../app/home-page.html"); 
});
