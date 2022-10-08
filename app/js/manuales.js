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
        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_manu_x_id_tipo_dest_x_dest,
        type: 'GET',
        dataType: 'json',
        data: {
            IdTipoDestinatario: 1,
        },
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        // beforeSend: function() {
        //     $('#spinnerPdf').html("<span class='sr-only'>Loading...</span>");
        //     document.getElementById("PdfModal").style.height = "200px";
        // },
        success: function(data){
            var plantilla = "";
            plantilla += `
                <tr>
                    <td>Manual</td>
                    <td>Fecha</td>
                    <td style="display: flex; justify-content: end;">Descripción</td>                            
                </tr>
                <tr class="lineaHorizontal2">
                    <td><button id="botonPDFManuales" class="focusNone" style="border: none; background: transparent;"><span class="icon-pdf" style="padding: 0px 2px 0px 0px;"></span></button></td>
                    <td>${moment(data.resultado[0].fechaRegistra).format("DD/MM/YYYY HH:mm")}</td>
                    <td style="display: flex; justify-content: end;">${data.resultado[0].descripcion}</td>
                </tr>
            `
                $("#cuerpoManuales").html(plantilla);
                // document.getElementById("spinnerPdf").style.display = "none";

                var btnPDFManuales = document.querySelector("#botonPDFManuales");

                btnPDFManuales.addEventListener("click", () => {
                    $("#modalPdf").modal('show');
                    
                    document.getElementById("spinnerPdf").style.display = "none";
                    document.getElementById("PdfModal").style.height = "400px";
                    var filename = data.cufe + '.pdf';
                        var url = 'data:application/pdf;base64,' + data.resultado[0].archivoAdjunto;
                        $("#framePDF").attr("src",url);
                        //$("#PdfModal").html(html);
                });
        },
        error: function(error){
            console.error(error);
        },
    });
});