import { registrarEventosUsuario } from "../../assets/js/main.js";
import { WEB_CONFIGURATION_URLS } from "../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../assets/js/web.config.js";
import { VENTANAS, TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION, KEY_TOKEN } from '../../assets/js/ventanas.config.js';

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

const URL = WEB_CONFIGURATION_URLS.API;
const METHODS = WEB_CONFIGURATION_METHODS.API;


$(document).ready(function() {

  $.ajax({
    url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_certificado_dig,
    type: 'GET',
    dataType: 'json',
    headers: {
        Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
    },
    success: function(data) {
      var plantilla = "";
      plantilla += `
        <tr>
        <td>Empresa</td>
        <td id="empresa" style="display: flex; justify-content: end;">${data.resultado.razonSocial}</td>                            
        </tr>
        <tr class="lineaHorizontal2">
            <td>Fecha de vencimiento</td>
            <td id="fechaDeVencimiento" style="display: flex; justify-content: end;">${moment(data.resultado.fechaCaducidad).format("DD/MM/YYYY HH:mm")}</td>
        </tr>
        <tr class="lineaHorizontal2">
            <td>Clave</td>
            <td id="clave" style="display: flex; justify-content: end;">***************</td>
        </tr>
      `
        $("#datosEmpresa").html(plantilla);
    },
    error: function(error){
        console.error(error);
    }
});

  // var ejemplo = $("table tbody tr").val($(this).find("td:eq(1)").text());
  

    function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
            if ((encoded.length % 4) > 0) {
              encoded += '='.repeat(4 - (encoded.length % 4));
            }
            resolve(encoded);
          };
          reader.onerror = error => reject(error);
        });
      }

    $("#btnCargarCertificado").on("click", function(){

      var pass;

          var passCertificado = $("#passCertificado").val();
          var passCertificadoConfirmar = $("#passCertificadoConfirmar").val();

          if(passCertificado == passCertificadoConfirmar){
            pass = passCertificado;

            var file = document.querySelector('#file-upload').files[0];
              getBase64(file)
              .then(res => {
              
                    $.ajax({
                        type: "POST",
                        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.guardar_certificado_dig,
                        dataType: 'json',
                        data: JSON.stringify({
                          Archivo: res,
                          Clave: pass,
                        }),
                        contentType: 'application/json',
                        headers: {
                            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
                        },
                        success: function(resultado){
                          if(resultado != null){
                              var inputFile = $("#info");
                              inputFile[0].textContent = "Subir nuevo certificado aquí"
                              $("#passCertificado").val("");
                              $("#passCertificadoConfirmar").val("");
                              // $("#estadosCertificado").modal('show');
                              Swal.fire({
                                icon: 'success',
                                title: "Bien",
                                text: 'Certificado Cargado Satisfactoriamente',
                                confirmButtonColor: '#2797d2',
                              })
                              $("#estadosCargarCertificado").html("Certificado Cargado Satisfactoriamente");

                              $.ajax({
                                url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_certificado_dig,
                                type: 'GET',
                                dataType: 'json',
                                headers: {
                                    Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
                                },
                                success: function(data){
                                  var plantilla = "";
                                  plantilla += `
                                    <tr>
                                    <td>Empresa</td>
                                    <td id="empresa" style="display: flex; justify-content: end;">${data.resultado.razonSocial}</td>                            
                                    </tr>
                                    <tr class="lineaHorizontal2">
                                        <td>Fecha de vencimiento</td>
                                        <td id="fechaDeVencimiento" style="display: flex; justify-content: end;">${moment(data.resultado.fechaCaducidad).format("DD/MM/YYYY HH:mm")}</td>
                                    </tr>
                                    <tr class="lineaHorizontal2">
                                        <td>Clave</td>
                                        <td id="clave" style="display: flex; justify-content: end;">***************</td>
                                    </tr>
                                  `
                                    $("#datosEmpresa").html(plantilla);
                                },
                                error: function(error){
                                    console.error(error);
                                }
                            });
                            registrarEventosUsuario(TIPO_ACCION_USUARIO.Agregar, VENTANAS.CertificadoDigital, "");
                          }
                            
                        },
                        error: function(xhr, ajaxOptions, throwError){
                            var inputFile = $("#info");
                            inputFile[0].textContent = "Subir nuevo certificado aquí"
                            $("#passCertificado").val("");
                            $("#passCertificadoConfirmar").val("");
                            // $("#estadosCertificado").modal('show');
                            Swal.fire({
                              icon: 'error',
                              title: "Error",
                              text: 'Clave Invalida',
                              confirmButtonColor: '#2797d2',
                            })
                            $("#estadosCargarCertificado").html("Clave Invalida");
                            // if(xhr.status === 400){
                              
                            // }
                        }
                    });
            })
            .catch(err => {
              var inputFile = $("#info");
              inputFile[0].textContent = "Subir nuevo certificado aquí"
              $("#passCertificado").val("");
              $("#passCertificadoConfirmar").val("");
              // $("#estadosCertificado").modal('show');
              Swal.fire({
                icon: 'error',
                title: "Error",
                text: 'Falta Certificado',
                confirmButtonColor: '#2797d2',
              })
              $("#estadosCargarCertificado").html("Falta Certificado");
            })
          }else{
            var inputFile = $("#info");
            inputFile[0].textContent = "Subir nuevo certificado aquí"
            $("#passCertificado").val("");
            $("#passCertificadoConfirmar").val("");
            // $("#estadosCertificado").modal('show');
            Swal.fire({
              icon: 'error',
              title: "Error",
              text: 'Las Claves no Coinciden',
              confirmButtonColor: '#2797d2',
            })
            $("#estadosCargarCertificado").html("Las Claves no Coinciden");
            
          }
    });

});

