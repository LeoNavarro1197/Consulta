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

    //---------------------obtener logo principio-----------------------
    
    $.ajax({
        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_logo_ride,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        beforeSend: function() {
            $('#spinnerPdf').html("<span class='sr-only'>Loading...</span>");
            // document.getElementById("PdfModal").style.height = "200px";
        },
        success: function(data){
            
            if(data.resultado != null){
                
                document.getElementById("spinnerPdf").style.display = "none";
                // document.getElementById("PdfModal").style.height = "400px";
                var filename = 'logo.png';
                var url = 'data:application/image;base64,' + data.resultado;
                $("#framePDF").attr("src",url);
            }
        },
        error: function(error){
        console.error(error);
        }
    });

    //---------------------obtener banner principio-----------------------
    
    $.ajax({
        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_banner_ride,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        beforeSend: function() {
            $('#spinnerPdf').html("<span class='sr-only'>Loading...</span>");
            // document.getElementById("PdfModal").style.height = "200px";
        },
        success: function(data){
            
            if(data.resultado != null){
                
                document.getElementById("spinnerPdf").style.display = "none";
                // document.getElementById("PdfModal").style.height = "400px";
                var filename = 'banner.png';
                var url = 'data:application/image;base64,' + data.resultado;
                $("#framePDF3").attr("src",url);
            }
        },
        error: function(error){
        console.error(error);
        }
    });
  
    //-----------------cargar logo---------------------------

    $("#btnCargarLogo").on("click", function(){

    var file = document.querySelector('#file-upload').files[0];
    getBase64(file)
    .then(res => {
    
            $.ajax({
                type: "POST",
                url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.guardar_logo_ride,
                dataType: 'json',
                data: JSON.stringify({
                    ArchivoBase64: res
                }),
                contentType: 'application/json',
                headers: {
                    Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
                },
                success: function(resultado){
                    
                    if(resultado.resultado == true){
                        var inputFile = $("#info");
                        inputFile[0].textContent = "Subir nuevo logo aquí (450 x 240 png o jpg)"
                        // $("#estadosCertificado").modal('show');
                        Swal.fire({
                            icon: 'success',
                            title: "Bien",
                            text: 'Logo Cargado Satisfactoriamente',
                            confirmButtonColor: '#2797d2',
                        })
                        registrarEventosUsuario(TIPO_ACCION_USUARIO.Agregar, VENTANAS.LogosBanner, "");
                    }
                },
                error: function(xhr, ajaxOptions, throwError){
                    var inputFile = $("#info");
                    inputFile[0].textContent = "Subir nuevo logo aquí (450 x 240 png o jpg)"
                    Swal.fire({
                        icon: 'error',
                        title: "Error",
                        text: '',
                        confirmButtonColor: '#2797d2',
                      })
                    // if(xhr.status === 400){
                    
                    // }
                },
                complete: function () {
                    // $("#modalPdf").modal('show');

                    $.ajax({
                        url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_logo_ride,
                        type: 'GET',
                        dataType: 'json',
                        headers: {
                            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
                        },
                        beforeSend: function() {
                            $('#spinnerPdf').html("<span class='sr-only'>Loading...</span>");
                            // document.getElementById("PdfModal").style.height = "200px";
                        },
                        success: function(data){

                            if(data.resultado != null){
                                
                                document.getElementById("spinnerPdf").style.display = "none";
                                // document.getElementById("PdfModal").style.height = "400px";
                                var filename = 'logo.png';
                                var url = 'data:application/image;base64,' + data.resultado;
                                $("#framePDF").attr("src",url);
                            }
            },
            error: function(error){
                console.error(error);
            }
        });
                }
            });
    })
    .catch(err => {
            var inputFile = $("#info");
            inputFile[0].textContent = "Subir nuevo logo aquí (450 x 240 png o jpg)"
            Swal.fire({
                icon: 'error',
                title: "Error",
                text: 'Falta Logo',
                confirmButtonColor: '#2797d2',
              })
        })
        
    });

    //-----------------cargar banner---------------------------

    $("#btnCargarBanner").on("click", function(){

        var file = document.querySelector('#file-upload2').files[0];
        getBase64(file)
        .then(res => {
        
                $.ajax({
                    type: "POST",
                    url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.guardar_banner_ride,
                    dataType: 'json',
                    data: JSON.stringify({
                        ArchivoBase64: res
                    }),
                    contentType: 'application/json',
                    headers: {
                        Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
                    },
                    success: function(resultado){
                        
                        if(resultado.resultado == true){
                            var inputFile = $("#info2");
                            inputFile[0].textContent = "Subir nuevo banner aquí (450 x 240 png o jpg)"
                            // $("#estadosCertificado").modal('show');
                            Swal.fire({
                                icon: 'success',
                                title: "Bien",
                                text: 'Banner Cargado Satisfactoriamente',
                                confirmButtonColor: '#2797d2',
                            })
                            registrarEventosUsuario(TIPO_ACCION_USUARIO.Agregar, VENTANAS.LogosBanner, "");
                        }
                    },
                    error: function(xhr, ajaxOptions, throwError){
                        var inputFile = $("#info2");
                        inputFile[0].textContent = "Subir nuevo banner aquí (450 x 240 png o jpg)"
                        Swal.fire({
                            icon: 'error',
                            title: "Error",
                            text: '',
                            confirmButtonColor: '#2797d2',
                          })
                        // if(xhr.status === 400){
                        
                        // }
                    },
                    complete: function () {
                        // $("#modalPdf").modal('show');
    
                        $.ajax({
                            url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_banner_ride,
                            type: 'GET',
                            dataType: 'json',
                            headers: {
                                Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
                            },
                            beforeSend: function() {
                                $('#spinnerPdf').html("<span class='sr-only'>Loading...</span>");
                                // document.getElementById("PdfModal").style.height = "200px";
                            },
                            success: function(data){
    
                                if(data.resultado != null){
                                    
                                    document.getElementById("spinnerPdf").style.display = "none";
                                    // document.getElementById("PdfModal").style.height = "400px";
                                    var filename = 'banner.png';
                                    var url = 'data:application/image;base64,' + data.resultado;
                                    $("#framePDF3").attr("src",url);
                                }
                },
                error: function(error){
                    console.error(error);
                }
            });
                    }
                });
        })
        .catch(err => {
                var inputFile = $("#info2");
                inputFile[0].textContent = "Subir nuevo banner aquí (450 x 240 png o jpg)"
                Swal.fire({
                    icon: 'error',
                    title: "Error",
                    text: 'Falta banner',
                    confirmButtonColor: '#2797d2',
                  })
            })
            
        });

    //-------------obtener logo en pdf---------------------------

    $("#obtenerLogoCargado").on("click", function(){

        $("#modalPdf").modal('show');

        $.ajax({
            url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_logo_ride,
            type: 'GET',
            dataType: 'json',
            headers: {
                Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
            },
            beforeSend: function() {
                $('#spinnerPdf').html("<span class='sr-only'>Loading...</span>");
                document.getElementById("PdfModal2").style.height = "200px";
            },
            success: function(data){
                
                if(data.resultado != null){
                    
                    document.getElementById("spinnerPdf").style.display = "none";
                    // document.getElementById("PdfModal").style.height = "400px";
                    var filename = 'logo.png';
                    var url = 'data:application/image;base64,' + data.resultado;
                    $("#framePDF2").attr("src",url);
                    document.getElementById("PdfModal2").style.height = "400px";
                }
            },
            error: function(error){
                console.error(error);
            }
        });
    });

    //-------------obtener banner en pdf---------------------------

    $("#obtenerBannerCargado").on("click", function(){

        $("#modalPdf").modal('show');

        $.ajax({
            url: WEB_CONFIG.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_banner_ride,
            type: 'GET',
            dataType: 'json',
            headers: {
                Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
            },
            beforeSend: function() {
                $('#spinnerPdf').html("<span class='sr-only'>Loading...</span>");
                document.getElementById("PdfModal2").style.height = "200px";
            },
            success: function(data){
                
                if(data.resultado != null){
                    
                    document.getElementById("spinnerPdf").style.display = "none";
                    // document.getElementById("PdfModal").style.height = "400px";
                    var filename = 'banner.png';
                    var url = 'data:application/image;base64,' + data.resultado;
                    $("#framePDF2").attr("src",url);
                    document.getElementById("PdfModal2").style.height = "400px";
                }
            },
            error: function(error){
                console.error(error);
            }
        });
    });
});