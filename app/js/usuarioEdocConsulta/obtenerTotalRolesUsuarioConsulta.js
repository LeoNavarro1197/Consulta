import { registrarEventosUsuario } from "../../../assets/js/main.js";
import { WEB_CONFIGURATION_URLS } from "../../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../../assets/js/web.config.js";
import { VENTANAS, TIPO_ACCION_USUARIO, TIPO_ARCHIVO_DOCUMENTO_EMISION, KEY_TOKEN } from '../../../assets/js/ventanas.config.js';

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

const URL = WEB_CONFIGURATION_URLS.API;
const METHODS = WEB_CONFIGURATION_METHODS.API;


$(document).ready(function() {

    let usuarios = document.getElementById('usuarios');
    let activos = document.getElementById('activos');
    let inactivos = document.getElementById('inactivos');

    $.ajax({
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_total_rols_user_consul,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){
            
            usuarios.textContent = data.resultado.total;
            activos.textContent = data.resultado.totalActivos;
            inactivos.textContent = data.resultado.totalInactivos;
        },
        error: function(err){
            console.error(err);
        }
    });

    let rolesCreados = document.getElementById('rolesCreados');

    $.ajax({
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_total_users_consul,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){
            
            rolesCreados.textContent = data.resultado.total;
        },
        error: function(err){
            console.error(err);
        }
    });

    let usuariosConectados = document.getElementById('usuariosConectados');

    $.ajax({
        url: WEB_CONFIG.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_total_users_consul_conect_recien,
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + Cookies.get(KEY_TOKEN)
        },
        success: function(data){
            
            usuariosConectados.textContent = data.resultado;
        },
        error: function(err){
            console.error(err);
        }
    });
});