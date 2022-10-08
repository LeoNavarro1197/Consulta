// import { WEB_CONFIGURATION_URLS } from "./web.config (1).js";

import { KEY_TOKEN } from "../../assets/js/ventanas.config.js";

// import { WEB_CONFIGURATION_METHODS } from "./web.config.js";
// import { VENTANAS, TIPO_ACCION_USUARIO } from "./web.config (1).js";

// const URL = WEB_CONFIGURATION_URLS.API;
// const METHOD = WEB_CONFIGURATION_METHODS.API;

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));

// Toggle sidebar
let sidebar = document.querySelector(".sidebar");
let sidebar_btn = document.querySelector(".menu-icon");
// var homePage =  $("#contenedorProfile").load("../../app/home-page.html"); 


// $(function () {
//   console.log("homepage")
//   homePage;
  
// });



// Funcion para cambiar icono sidebar
function menuIconChange() {
  if (!sidebar.classList.contains("close-s")) {
    sidebar_btn.classList.replace("icon-openMenu", "icon-closeMenu");
  } else {
    sidebar_btn.classList.replace("icon-closeMenu", "icon-openMenu");
  }
}

// $('#pruebaBoton').on("click", function () {
//   console.log("entro main");
// });

// Boton mi cuenta
$('#btnMiCuenta').on("click", function () {
  
  $("#pageTitle").text("Mi Cuenta");
  // $("#contenedorProfile").remove(); 
  // location.reload();
  // $("#contenedorProfile").load("../../app/administracion/my-account/profile.html"); 
  
});

$(".menu-icon").click(() => {
  sidebar.classList.toggle("close-s");
  menuIconChange();
});

// Navbar
// const pfp_btn = document.querySelector("#profile-btn");
// const pfp_list = document.querySelector("#profile-list");

// $("#profile-btn").click(() => {
//   if (pfp_list.style.display === "block") {
//     pfp_list.style.display = "none";
//   } else {
//     pfp_list.style.display = "block";
//   }
// });

// const bell_btn = document.querySelector("#bell-btn");
// const bell_list = document.querySelector("#bell-list");

// $("#bell-btn").click(() => {
//   if (bell_list.style.display === "block") {
//     bell_list.style.display = "none";
//   } else {
//     bell_list.style.display = "block";
//   }
// });

// Obtener DGI Status
$(document).ready(function () {
  // const API_url = "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Administration/Administracion/ObtenerEstadoDGI";
  const API_url =
    WEB_CONFIG.api_url.api_administration.url + WEB_CONFIG2.api_methods.api_administration.methods.obt_dgi;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    success: function (res) {},
    error: function (xhr, ajaxOptions, throwError) {
    },
  });
});

// Obtener Datos Usuario
$(document).ready(function () {
  // const API_url =
  //   "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Security/Seguridad/ObtenerMisDatosUsuario";
  const API_url =
  WEB_CONFIG.api_url.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_mis_datos_user;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    success: function (res) {},
    error: function (xhr, ajaxOptions, throwError) {
    },
  });
});

// Obtener Comunicado
$(document).ready(function () {
  // const API_url =
  //   "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Administration/Administracion/ObtenerComunicadosPorIdTipoDestinatarioPorDestinatario";
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_coms_x_id_dest_x_dest;

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
        if (res.resultado[i].leido === false) {
          htmlBuilder += "<tr>";
          htmlBuilder += `<td> <button class="btn btn-danger btn-sm" onclick="showPDF(${i}, ${res.resultado[i].idComunicado})"><span class="icon-pdf"></span></button>`;
          htmlBuilder +=
            "<td>" +
            new Date(res.resultado[i].fechaRegistra).toLocaleString("es-PA") +
            "</td>";
          htmlBuilder += "<td>" + res.resultado[i].descripcion + "</td>";
          htmlBuilder += "</tr>";

        }
        $("#tbody").html(htmlBuilder);
      }

      const newCom = document.querySelector("#newCom");
      for (let i = 0; i < res.resultado.length; i++) {
        if (!res.resultado[i].leido === false) {
          newCom.style.display = "none";
        }
      }

    },
    error: function (xhr, ajaxOptions, throwError) {
    },
  });
});

function showPDF(x, c) {
  // const API_url =
  //   "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Administration/Administracion/MarcarLeidoComunicadoPorIdComunicadoPorIdDestinatario";
  const API_url =
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.marc_leido_com_x_id_com_x_id_dest;
  
    $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    data: { IdComunicado: c, IdDestinatario: 1 },
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    success: function (res) {
    },
    error: function (xhr, ajaxOptions, throwError) {
    },
  });
}

showPDF();

// Obtener Datos Usuario
$(document).ready(function () {
  // const API_url =
  //   "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Security/Seguridad/ObtenerMisDatosUsuario";
  const API_url =
    WEB_CONFIG.api_url.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_mis_datos_user;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    success: function (res) {
      armarMenu(res);

    },
    error: function (xhr, ajaxOptions, throwError) {
    },
  });
});

function armarMenu(resultadoData) {
  var Menu = { html: "" };
  var NombrePermisoPadre = "";
  var PermisosData = resultadoData.resultado.permisos;
  var PermisosAgregados = [];
  var IconoPadre = "";

  Menu.html += `<ul class='nav-links'>`;

  for (var i = 0; i < PermisosData.length; i++) {
    armarSubmenu(Menu, PermisosData[i]);
  }

  Menu.html += "</ul>";

  $("#menu-items").html(Menu.html);
  function armarSubmenu(Menu, Permiso) {
    if (PermisosData[i].idPermisoPadre != null) {
      if (
        PermisosAgregados.find((P) => P.idPermiso === Permiso.idPermiso) == null
      ) {
        var PermisoPadreEncontrado = PermisosData.find(
          (P) =>
            P.idPermiso === Permiso.idPermisoPadre && P.idPermisoPadre != null
        );
        Menu.html +=
          "<li class='link'><div class='icon-link'> <a href='app/home-page.html' target='iframe'> <i class='{Icono}'></i> <span class='link_name'>{NombrePermiso}</span> </a> {arrow} </div>";
        if (PermisoPadreEncontrado == null) {
          NombrePermisoPadre = Permiso.nombre;
          IconoPadre = Permiso.icono;
        } else {
          NombrePermisoPadre = PermisoPadreEncontrado.nombre;
          IconoPadre = PermisoPadreEncontrado.icono;
        }
        Menu.html = Menu.html.replace("{NombrePermiso}", NombrePermisoPadre);
        Menu.html = Menu.html.replace("{Icono}", IconoPadre);
        var PermisosHijosEncontrado = PermisosData.filter(
          (P) => P.idPermisoPadre === Permiso.idPermiso
        );
        if (PermisosHijosEncontrado.length) {
          Menu.html = Menu.html.replace(
            "{arrow}",
            "<i class='icon-forward arrow'></i>"
          );
          Menu.html +=
            "<ul class='sub-menu'> <li><a class='link_name' href='#'>{NombrePermiso}</a></li>";
          Menu.html = Menu.html.replace("{NombrePermiso}", NombrePermisoPadre);
          PermisosAgregados.push(Permiso);
          for (var j = 0; j < PermisosHijosEncontrado.length; j++) {
            Menu.html +=
              "<li> <a class='sidebar-link' href='{Pagina}' target='iframe' >{NombrePermiso}</a > </li>";
            Menu.html = Menu.html.replace(
              "{NombrePermiso}",
              PermisosHijosEncontrado[j].nombre
            );
            Menu.html = Menu.html.replace(
              "{Pagina}",
              PermisosHijosEncontrado[j].pagina
            );
            PermisosAgregados.push(PermisosHijosEncontrado[j]);
            /*var PermisoHijosEncontradosRecurrencia=permisosData.find( Permiso => Permiso.idPermisoPadre === PermisosHijosEncontrado[j].idPermiso );
                    if(PermisoHijosEncontradosRecurrencia!=null){
                        cargarPermisosHijos(permisosData,Menu.html,PermisosHijosEncontrado[j]);
                    }*/
          }
          Menu.html += "</ul>";
        } else {
          Menu.html = Menu.html.replace("{arrow}", "");
        }
        Menu.html += "</li>";
      }
    }
  }
  // Menu & submenu sidebar
  let arrow = document.querySelectorAll(".arrow");
  let icon = document.querySelectorAll(".icon-link");
  
  for (let i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
      let arrow_parent = e.target.parentElement.parentElement; //Seleccionando elemento padre arrow
      
      arrow_parent.classList.toggle("showMenu");
    });
    
    icon[i].addEventListener("click", (e) => {
      let icon_parent = e.target.parentElement.parentElement;
      
      icon_parent.classList.toggle("light-blue-back");
    });
  }
  let links_menu = document.querySelectorAll(".sidebar-link");

  $('.icon-link a').on("click", function () {
    $("#pageTitle").text("Tablero");
  });

  $(links_menu[0]).on("click", function () {
    $("#pageTitle").text("Monitor General");
  });
  
  $(links_menu[1]).on("click", function () {
    $("#pageTitle").text("Monitor Mail");
  });
  
  $(links_menu[2]).on("click", function () {
    $("#pageTitle").text("Búsqueda por Criterio");
  });
  
  $(links_menu[3]).on("click", function () {
    $("#pageTitle").text("Usuario Edoc Consulta");
  });

  $(links_menu[4]).on("click", function () {
    $("#pageTitle").text("Usuario Edoc Cliente");
  });

  $(links_menu[5]).on("click", function () {
    $("#pageTitle").text("Certificado Digital");
  });

  $(links_menu[6]).on("click", function () {
    $("#pageTitle").text("Manuales de Usuario");
  });

  $(links_menu[7]).on("click", function () {
    $("#pageTitle").text("Alertas & Comunicados");
  });

  $(links_menu[8]).on("click", function () {
    $("#pageTitle").text("Logos & Banner");
  });
}

export function registrarEventosUsuario(
  idTipoAccionUsuario,
  idVentana,
  descripcion
) {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url
  +
  WEB_CONFIG2.api_methods.api_administration.methods.registrar_even_user_consul;

  $.ajax({
    type: "POST",
    url: API_url,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      IdTipoAccionUsuario: idTipoAccionUsuario,
      IdVentana: idVentana,
      Descripcion: descripcion,
    }),
    headers: {
      Authorization: "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    error: function (xhr, ajaxOptions, throwError) {
      Swal.fire("Error", "error", "error");
    },
  });
}

export function setUserSession(email) {
  $.getJSON('sessionObject.json', function (json) {
    let user = json;
  
    user.email = email;
    user.username = "user1";
  
    // console.log(user);
    sessionStorage.setItem('user', JSON.stringify(user));

  });
}

$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url
  +
  WEB_CONFIG2.api_methods.api_administration.methods.consul_config_inicial_edoc_consult;

  $.ajax({
    type: "GET",
    async: false,
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${sessionStorage.getItem("token")}`,
    },
    success: function (res) {
      let site_key = res.resultado.webRecaptchaClaveSitioWeb;

      localStorage.setItem("siteKey", site_key);

    },
    error: function (xhr, ajaxOptions, throwError) {
    },
  });
});

function RefreshToken(funcParam){
  var Token=JSON.parse(Cookies.get(KEY_TOKEN));
  $.ajax({
    type:"GET",
    url:WEB_CONFIG.api_url.api_auth.url + WEB_CONFIG.api_url.methods.refresh_token,
    data:{RefreshToken:Token.RefreshToken},
    success: function(data) {
      Cookies.set(KEY_TOKEN, JSON.stringfy(data));
      funcParam();
    },
    error: function(data) {
    }
  });
}

// if(data.status==No autorizado){
//   RefreshToken(ConsultarUsuariosClientes);
//   return;
// }