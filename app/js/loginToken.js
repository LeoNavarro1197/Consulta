import { registrarEventosUsuario, setUserSession } from "../../assets/js/main.js";
// import { WEB_CONFIGURATION_URLS } from "../../assets/js/web.config (1).js";
import { KEY_TOKEN } from '../../assets/js/ventanas.config.js';

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

// const URL = WEB_CONFIGURATION_URLS.API;

$(document).ready(function () {
  $("#btnLogin").on("click", function () {
    
    // document.cookie = "token = Tokeeen; max-age = 20";
    var email = $("#email").val();
    var pass = $("#pass").val();
    var idcompania = $("#idcompania").val();
    var formData = email + ":" + pass + ":" + idcompania;
    if (email == "" || pass == "" || idcompania == "") {
      Swal.fire({
        icon: 'error',
        title: "Error",
        text: 'Uno o mas campos del formulario estan vacios',
        confirmButtonColor: '#2797d2',
      })
      // alert("Uno o mas campos del formulario estan vacios");
      return;
    } 
      var vReCaptcha = "";
      if ($("#DivReCaptchaGoogle").length > 0) {
        //alert("DivReCaptchaGoogleGs Existe");
        try {
          vReCaptcha = grecaptcha.getResponse(widgetDivReCaptchaGoogle);
        } catch (err) {
      try { grecaptcha.reset(widgetDivReCaptchaGoogle); } catch (e) { }
      vReCaptcha = "";
      }
      if (vReCaptcha == "") { 
        Swal.fire({
          icon: 'error',
          title: "Error",
          text: 'Captcha incorrecto, Comprueba que eres humano',
          confirmButtonColor: '#2797d2',
        })
        return; }
    } else {
      //alert("DivReCaptchaGoogleGs NO Existe");
    }
    // IniciarLoading();
    $.ajax({
      type: "GET",
      url: WEB_CONFIG.api_url.api_auth.url + WEB_CONFIG2.api_methods.api_auth.methods.auth,
      dataType: "json",
      data: {
        Id: 5,
        RucCiaNube: idcompania,
        ReCaptcha: vReCaptcha
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa(formData));
          document.getElementById("spinnerPdf").style.display = "initial";
          document.getElementById("contenedorIndex").style.display = "none";
          document.getElementById("footerGuru").style.display = "none";
          // $('#spinnerPdf').html("<span class='sr-only'>Loading...</span>");
        },
        success: function (data) {
          if(data != null){
            // document.getElementById("spinnerPdf").style.display = "none";
            // document.getElementById("contenedorIndex").style.display = "initial";
            // document.getElementById("footerGuru").style.display = "none";
            // sessionStorage.setItem("token", data.token);
            console.log(data)
            // var expira = new Date(new Date().getTime() + 30 * 60 * 1000);
            // Cookies.set('token', data.token, {
            //   expires: expira
            // });
            Cookies.set(KEY_TOKEN, data.token);
            // Cookies.set(KEY_TOKEN, JSON.stringify(data));
            window.location.href = "app/home-page.html";
            registrarEventosUsuario(WEB_CONFIG3.acciones_user.inicio_sesion, WEB_CONFIG3.id_ventanas.inicio, "id compañia: " + idcompania);
            
            setUserSession(email);
          }
        },
        error: function (xhr, ajaxOptions, throwError) {
          // document.getElementById("spinnerPdf").style.display = "none";
          console.log(xhr, ajaxOptions, throwError);
          setTimeout(() => {
            window.location.href = "./index.html";
          }, 3000);
          Swal.fire({
            icon: 'error',
            title: "Error",
            text: xhr.responseJSON,
            confirmButtonColor: '#2797d2',
          })
        },
      });
      //}
      document.getElementById("email").value = "";
      document.getElementById("pass").value = "";
      document.getElementById("idcompania").value = "";
     
    });
});

const btn_login = document.querySelector('#btnLogin');
btn_login.addEventListener('click', () => {
  $("body").append(
    // '<div class="overlay"><div class="opacity center"><div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>'
    '<div class="overlay"><div class="opacity center"><div class="lds-roller"></div></div></div>'
  );
  $(".overlay").fadeIn(300);
});
