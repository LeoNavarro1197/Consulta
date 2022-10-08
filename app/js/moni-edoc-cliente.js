import { registrarEventosUsuario } from "../../assets/js/main.js";
import { WEB_CONFIGURATION_URLS } from "../../assets/js/web.config (1).js";
import { WEB_CONFIGURATION_METHODS } from "../../assets/js/web.config.js";
import { KEY_TOKEN } from '../../assets/js/ventanas.config.js';

// const URL = WEB_CONFIGURATION_URLS.API;
// const METHOD = WEB_CONFIGURATION_METHODS.API;

const WEB_CONFIG = JSON.parse(localStorage.getItem('web_config'));
const WEB_CONFIG2 = JSON.parse(localStorage.getItem('web_config2'));
const WEB_CONFIG3 = JSON.parse(localStorage.getItem('web_config3'));

// Crear Notificacion
$("#btnCreNotiFin").click(function () {
  const API_url =
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.mant_noti_cli;

  $.ajax({
    type: "POST",
    url: API_url,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      // "IdNotificacion": 1014,
      IdTipoEnvioNotificacion: parseInt(
        localStorage.getItem("slcMetodoEnvioNum")
      ),
      Titulo: localStorage.getItem("titleCreNoti"),
      Mensaje: localStorage.getItem("msgCreNoti"),
      FechaDesde: localStorage.getItem("fechaDesdeCreNoti"),
      FechaHasta: localStorage.getItem("fechaHastaCreNoti"),
      Estado: 1,
    }),
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      registrarEventosUsuario(
        WEB_CONFIG3.acciones_user.exportar_excel,
        WEB_CONFIG3.id_ventanas.usuario_edoc_cliente,
        "Exportar excel."
      );

      console.log(res);

      Swal.fire({
        title: "¡Que bien!",
        text: "La notificación se ha creado satisfactoriamente",
        icon: "success",
        confirmButtonColor: "#2797d2",
      });
    },
    error: function (xhr, ajaxOptions, throwError) {
      console.log(xhr);
      Swal.fire({
        title: "¡Oh no!",
        text: `Hubo un error al realizar el proceso \n ${xhr.responseJSON.mensajeRespuesta}`,
        icon: "error",
        confirmButtonColor: "#2797d2",
      });
      Swal.fire("Error", "error", "error");
    },
  });
});

// Mostrar Datos Modal Cre Noti 3rd Step
$("#btnCreNotiModal2").click(function () {
  const inner_box_msg = document.querySelector("#innerBoxMsg");
  let template_msg = `
  <h5>Titulo:</h5>
  <p>${localStorage.getItem("titleCreNoti")}</p>
  <h5>Tipo envío:</h5>
  <p>${localStorage.getItem("slcMetodoEnvio")}
  <h5>Rango de fecha:</h5>
  <p>${localStorage.getItem("fechaDesdeCreNoti")} - ${localStorage.getItem(
    "fechaHastaCreNoti"
  )}
  <h5>Mensaje:</h5>
  <p>${localStorage.getItem("msgCreNoti")}
  
  `;

  const inner_box_users = document.querySelector("#innerBoxUsers");
  let users = tblCreNoti.rows(".selected").data().toArray();

  let template_users = "<ul>";

  for (let i = 0; i < users.length; i++) {
    template_users += "<li>" + users[i].razonSocial + "</li>";
  }

  template_users += "</ul>";

  inner_box_users.innerHTML = template_users;

  inner_box_msg.innerHTML = template_msg;
});

let tblCreNoti = document.getElementById("tblCreNoti");

tblCreNoti = $("#tblCreNoti").DataTable({
  dom: "Bfrtip",
  pageLength: 7,
  buttons: ["selectAll", "selectNone"],
  // Multi Select
  select: {
    style: "multi",
    selector: "td:first-child",
  },
  // Select Column
  columnDefs: [
    {
      orderable: false,
      className: "select-checkbox",
      targets: 0,
    },
  ],
  language: {
    buttons: {
      selectAll: "Seleccionar todo",
      selectNone: "Deseleccionar",
    },
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
    url:
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.obt_clientes_x_params,
    type: "GET",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer" + Cookies.get(KEY_TOKEN)
      );
    },
    dataSrc: function (respuesta) {
      return respuesta.resultado.usuarios;
    },
    data: function (d) {
      d.numsItemsOmitir = 0;
      d.numsItemsTomar = 100;
    },
    error: function (res) {
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
      Swal.fire("Error", "error", "error");
    },
  },
  columns: [
    {
      defaultContent: "",
      title: "",
      width: "80px",
      orderable: false,
    },
    {
      data: "idUsuario",
      visible: false,
    },
    { data: "identificacion", title: "ID", width: "100px" },
    { data: "razonSocial", title: "Nombre", width: "200px" },
  ],
});

tblCreNoti.draw();

let btn_first_step = document.getElementById("btnFirstStep");

btn_first_step.onclick = function () {
  saveDataFirstStep();
};

function saveDataFirstStep() {
  localStorage.setItem(
    "titleCreNoti",
    document.querySelector("#titleCreNoti").value
  );
  localStorage.setItem(
    "fechaDesdeCreNoti",
    document.querySelector("#fechaDesdeCreNoti").value
  );
  localStorage.setItem(
    "fechaHastaCreNoti",
    document.querySelector("#fechaHastaCreNoti").value
  );
  localStorage.setItem(
    "msgCreNoti",
    document.querySelector("#msgCreNoti").value
  );
  switch (document.querySelector("#slcMetodoEnvio").value) {
    case "0":
      localStorage.setItem("slcMetodoEnvio", "Correo electrónico");
      localStorage.setItem("slcMetodoEnvioNum", "0");

      break;

    case "1":
      localStorage.setItem("slcMetodoEnvio", "SMS");
      localStorage.setItem("slcMetodoEnvioNum", "1");
      break;

    case "2":
      localStorage.setItem("slcMetodoEnvio", "WhatsApp");
      localStorage.setItem("slcMetodoEnvioNum", "2");
      break;

    default:
      break;
  }
  localStorage.setItem(
    "slcPlantilla",
    document.querySelector("#slcPlantilla").value
  );

  setTimeout(() => {
    $("#btnFirstStep").attr("disabled", "disabled");
  }, 2000);
}

// Obtener Tipos Envio
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_tipo_env_noti_plant;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      let slc_metodo_envio = document.querySelector("#slcMetodoEnvio");
      let plantilla = "<option selected>Seleccione por donde enviar</option>";

      localStorage.setItem("temp1", res.resultado[0].plantilla);
      localStorage.setItem("temp2", res.resultado[1].plantilla);
      localStorage.setItem("temp3", res.resultado[2].plantilla);

      for (let i = 0; i < res.resultado.length; i++) {
        plantilla += `
            <option value='${i}'>${res.resultado[i].nombre}</option>
            `;
      }

      $(slc_metodo_envio).html(plantilla);
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

function showTemplate(sel) {
  let slc_value = document.querySelector("#slcMetodoEnvio").value;
  let slc_platilla = document.querySelector("#slcPlantilla");
  let msgCreNoti = document.querySelector("#msgCreNoti");

  let selected_item = sel.options[sel.selectedIndex].text;

  if (selected_item == "Correo Electronico") {
    $("#slcPlantilla").attr("disabled", "disabled");
  } else {
    $("#slcPlantilla").removeAttr("disabled");
  }

  if (localStorage.getItem("temp1") == "null") {
    localStorage.setItem("temp1", "");
  }

  switch (slc_value) {
    case "0":
      slc_platilla.innerHTML = `<option value='Correo electrónico' selected>${localStorage.getItem(
        "temp1"
      )}</option>`;
      msgCreNoti.value = localStorage.getItem("temp1");
      break;

    case "1":
      slc_platilla.innerHTML = `<option value='SMS' selected>${localStorage.getItem(
        "temp2"
      )}</option>`;
      msgCreNoti.value = localStorage.getItem("temp2");

      break;

    case "2":
      slc_platilla.innerHTML = `<option value='WhatsApp' selected>${localStorage.getItem(
        "temp3"
      )}</option>`;
      msgCreNoti.value = localStorage.getItem("temp3");

      break;

    default:
      break;
  }
}

$("#slcMetodoEnvio").on("change", function () {
  showTemplate(this);
});

$(document).ready(function () {
  $(".cre-input").on("change", function () {
    let empty = false;
    $(".cre-input").each(function () {
      empty = $(this).val().length == "";
    });
    if (empty) $("#btnFirstStep").attr("disabled", "disabled");
    else $("#btnFirstStep").attr("disabled", false);
  });
});

// Modal Select Cli Rep Login
var tblSelectCliRepLogin = document.querySelector("#tblSelectCliRepLogin");

tblSelectCliRepLogin = $("#tblSelectCliRepLogin").DataTable({
  pageLength: 7,
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
    url:
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.obt_clientes_x_params,
    type: "GET",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer" + Cookies.get(KEY_TOKEN)
      );
    },
    dataSrc: function (respuesta) {
      return respuesta.resultado.usuarios;
    },
    data: function (d) {
      d.RucCliente = null;
      d.FechaDesde = null;
      d.FechaHasta = null;
      d.numsItemsOmitir = 0;
      d.numsItemsTomar = 100;
    },
    error: function (xhr) {
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
  },
  columns: [
    {
      defaultContent:
        "<tr><th'scope'='row'><button type='button' class='btn btn-primary' id='btnSelectCliRepLog' data-dismiss='modal'>Seleccionar</button></th></tr>",
      title: "Acción",
      className: "",
      orderable: false,
    },
    {
      data: "idUsuario",
      visible: false,
    },
    { data: "razonSocial", title: "Nombre", width: "200px" },
    { data: "identificacion", title: "ID", width: "200px" },
  ],
});

tblSelectCliRepLogin.draw();

$("#tblSelectCliRepLogin tbody").on(
  "click",
  "#btnSelectCliRepLog",
  function (e) {
    e.preventDefault();
    var data = tblSelectCliRepLogin.row($(this).parents("tr")).data();
    const input_selectCliRepLog = document.querySelector(
      "#inputSelectCliRepLog"
    );

    localStorage.setItem("userRepLog", data.identificacion);

    input_selectCliRepLog.value = localStorage.getItem("userRepLog");
  }
);

// Reporte Login Clientes
var tblRepLoginCli;

tblRepLoginCli = $("#tblRepLoginCli").DataTable({
  pageLength: 10,
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
    url:
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.obt_clientes_x_params,
    type: "GET",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer" + Cookies.get(KEY_TOKEN)
      );
    },
    dataSrc: function (respuesta) {
      return respuesta.resultado.usuarios;
    },
    data: function (d) {
      var fechaDesdeRepLogin = document.querySelector(
        "#fechaDesdeRepLogin"
      ).value;
      var fechaHastaRepLogin = document.querySelector(
        "#fechaHastaRepLogin"
      ).value;
      var ruc_client_rep_log = document.querySelector(
        "#inputSelectCliRepLog"
      ).value;

      d.RucCliente = ruc_client_rep_log;
      d.FechaDesde = fechaDesdeRepLogin;
      d.FechaHasta = fechaHastaRepLogin;
      d.numsItemsOmitir = 0;
      d.numsItemsTomar = 100;
    },
    error: function (xhr) {
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
  },
  columns: [
    {
      data: "ultimaConexion",
      title: "Fecha Acceso",
      width: "100px",
      render: function (data) {
        if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
        return data;
      },
    },
    {
      data: "idUsuario",
      title: "ID",
      width: "60px",
      visible: true,
    },
    { data: "razonSocial", title: "Nombre/Razon Social", width: "100px" },
  ],
});

tblRepLoginCli.draw();

$("#btnConsultarRepLogin").click(function () {
  if (tblRepLoginCli != null) {
    registrarEventosUsuario(
      WEB_CONFIG3.acciones_user.consulta,
      WEB_CONFIG3.id_ventanas.usuario_edoc_cliente,
      "Consulta usuario."
    );
    tblRepLoginCli.ajax.reload();
  }
});

$("#tblRepLoginCli tbody").on("click", "#btnConsultarRepLogin", function (e) {
  e.preventDefault();
  var data = tblSelectCli.row($(this).parents("tr")).data();
  const input_selectCli = document.querySelector("#idClientFilter");

  localStorage.setItem("userRepLogin", data.identificacion);

  input_selectCli.value = localStorage.getItem("userRepLogin");
});

var tblRepNoti;

function cargarTablaNoti() {
  tblRepNoti = $("#tblRepNoti").DataTable({
    pageLength: 10,
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
      url:
      WEB_CONFIG.api_url.api_administration.url +
      WEB_CONFIG2.api_methods.api_administration.methods.obt_noti_cli,
      type: "GET",
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer" + Cookies.get(KEY_TOKEN)
        );
      },
      dataSrc: function (respuesta) {
        return respuesta.resultado.notificaciones;
      },
      data: function (d) {
        d.Coincidencia = null;
        d.TopConsulta = 100;
        d.numsItemsOmitir = 0;
        d.numsItemsTomar = 100;
      },
      error: function (xhr, res) {
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
    },
    columns: [
      {
        defaultContent:
          "<tr><th'scope'='row'><button type='button' data-toggle='modal' id='btnShowMsg' data-target='#modalShowMsg' style='border: none; font-size: 1.4rem'><i class='icon-visualizar'></i></button></th></tr>",
        title: "Acción",
        className: "",
        orderable: false,
      },
      {
        data: "idNotificacion",
        visible: false,
      },
      { data: "titulo", title: "Nombre Notificacion", width: "200px" },
      {
        data: "idTipoEnvioNotificacion",
        title: "Tipo",
        width: "200px",
        render: function (data) {
          if (data == 0) {
            return "<span style='font-size: 1rem;'>Correo electrónico</span>";
          } else if (data == 1) {
            return "<span style='font-size: 1rem;'>SMS</span>";
          } else if (data == 2) {
            return "<span style='font-size: 1rem;'>WhatsApp</span>";
          }
        },
      },
      {
        data: "fechaCreacion",
        title: "Fecha creación",
        width: "200px",
        render: function (data) {
          if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
          return data;
        },
      },
      {
        data: "fechaDesde",
        title: "Fecha inicio publicación",
        width: "200px",
        render: function (data) {
          if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
          return data;
        },
      },
      {
        data: "fechaHasta",
        title: "Fecha fin publicación",
        width: "200px",
        render: function (data) {
          if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
          return data;
        },
      },
    ],
  });
  $("#tblRepNoti tbody").on("click", "#btnShowMsg", function (e) {
    e.preventDefault();
    var data = tblRepNoti.row($(this).parents("tr")).data();
    var msgBox = document.querySelector("#modalShowMsgBox");

    msgBox.textContent = data.mensaje;
  });
}

$("#btnShowNotiTable").click(function (e) {
  e.preventDefault();
  if (tblRepNoti == null) {
    cargarTablaNoti();
  } else {
    tblRepNoti.ajax.reload();
  }
});

var tblSelectCli;

tblSelectCli = $("#tblSelectCli").DataTable({
  pageLength: 7,
  ajax: {
    url:
    WEB_CONFIG.api_url.api_administration.url +
    WEB_CONFIG2.api_methods.api_administration.methods.obt_clientes_x_params,
    type: "GET",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer" + Cookies.get(KEY_TOKEN)
      );
    },
    dataSrc: function (respuesta) {
      return respuesta.resultado.usuarios;
    },
    data: function (d) {
      d.RucCliente = null;
      d.FechaDesde = null;
      d.FechaHasta = null;
      d.numsItemsOmitir = 0;
      d.numsItemsTomar = 100;
    },
    error: function (xhr) {
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
  },
  columns: [
    {
      defaultContent:
        "<tr><th'scope'='row'><button type='button' class='btn btn-primary' id='btnSelectCli' data-dismiss='modal'>Seleccionar</button></th></tr>",
      title: "Acción",
      className: "",
      orderable: false,
    },
    {
      data: "idUsuario",
      visible: false,
    },
    { data: "razonSocial", title: "Nombre", width: "200px" },
    { data: "identificacion", title: "ID", width: "200px" },
  ],
});

tblSelectCli.draw();

$("#tblSelectCli tbody").on("click", "#btnSelectCli", function (e) {
  e.preventDefault();
  var data = tblSelectCli.row($(this).parents("tr")).data();
  const input_selectCli = document.querySelector("#idClientFilter");

  localStorage.setItem("user", data.identificacion);

  input_selectCli.value = localStorage.getItem("user");
});

// Obtener Total Usuarios
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.obt_total_users_consul;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {},
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

// Obtener Total Usuarios Conectados Recientemente
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_total_users_cli_conect_recien;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      const totalUserConnected = document.querySelector("#totalUserConnected");

      totalUserConnected.innerHTML = res.resultado;
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

// Obtener Comunicados
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_com_x_id_tipo_dest_x_dest;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    data: { IdTipoDestinatario: 3, Destinatario: 1 },
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      var htmlBuilder = "";

      for (var i = 0; i < res.resultado.length; i++) {
        htmlBuilder += "<tr>";
        htmlBuilder +=
          '<td> <button class="btn btn-danger btn-sm"><span class="icon-pdf"></span></button>';
        htmlBuilder +=
          "<td>" +
          new Date(res.resultado[i].fechaRegistra).toLocaleString("es-PA") +
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

// Obtener Total Clientes
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
      const totalClients = document.querySelector("#clients");

      totalClients.innerHTML = res.resultado;
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

// Obtener Total Notificaciones Clientes
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_total_noti_env_cli;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      const notiSent = document.querySelector("#notiSent");

      notiSent.innerHTML = res.resultado;
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

function reloadPage() {
  location.reload();
}

// Mantenimiento Add Usuarios
$("#btnAddUser").click(function () {
  const API_url =
  WEB_CONFIG.api_url.api_security.url +     WEB_CONFIG2.api_methods.api_security.methods.mant_user_cli;

  var input_add = document.querySelectorAll(".input-add");

  $.ajax({
    type: "POST",
    url: API_url,
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    data: JSON.stringify({
      Identificacion: input_add[1].value,
      TipoIdentificacion: 2,
      Nombre: input_add[0].value,
      Email: input_add[2].value,
      Telefono: input_add[3].value,
      Estado: true,
    }),
    success: function (res) {
      registrarEventosUsuario(
        WEB_CONFIG3.acciones_user.agregar,
        WEB_CONFIG3.id_ventanas.usuario_edoc_cliente,
        "Se agregó el usuario: " + input_add[0].value
      );
      Swal.fire({
        title: "¡Que bien!",
        text: "El usuario se ha agregado satisfactoriamente",
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

// Obtener clientes params
$(document).ready(function () {
  const API_url =
  WEB_CONFIG.api_url.api_administration.url +
  WEB_CONFIG2.api_methods.api_administration.methods.obt_clientes_x_params;

  $.ajax({
    type: "GET",
    url: API_url,
    dataType: "json",
    data: {
      RucCliente: null,
      FechaDesde: null,
      FechaHasta: null,
      numsItemsOmitir: 0,
      numsItemsTomar: 100,
    },
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
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

var table;

function cargarTabla() {
  table = $("#tablex").DataTable({
    dom: "Bfrtip",
    pageLength: 10,
    buttons: ["excel"],
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
      url:
      WEB_CONFIG.api_url.api_administration.url +
      WEB_CONFIG2.api_methods.api_administration.methods.obt_clientes_x_params,
      type: "GET",
      dataType: "json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer" + Cookies.get(KEY_TOKEN)
        );
      },
      dataSrc: function (respuesta) {
        return respuesta.resultado.usuarios;
      },
      data: function (d) {
        var fechaDesde = document.querySelector("#fechaDesde").value;
        var fechaHasta = document.querySelector("#fechaHasta").value;
        var ruc_cliente = document.querySelector("#idClientFilter").value;

        d.RucCliente = ruc_cliente;
        d.FechaDesde = fechaDesde;
        d.FechaHasta = fechaHasta;
        d.numsItemsOmitir = 0;
        d.numsItemsTomar = 100;
      },
      error: function (xhr) {
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
    },
    columns: [
      {
        defaultContent:
          "<tr><th 'scope'='row'><button type='button' style='border: none;' class='tblBtnDel'><span class='icon-close'></span></button><button type='button' style='border: none' id='tblBtnEditar' data-toggle='modal' data-target='#editUser'><span class='icon-editar'></span></button><div class='btn-group'><a href='#' class='opt-btn' id='opt-btn'><span class='icon-opciones'></span></a></div></th></tr>",
        title: "Acción",
        className: "",
        width: "80px",
        orderable: false,
      },
      {
        data: "idUsuario",
        visible: false,
      },
      {
        data: "estado",
        title: "Estado",
        width: "80px",
        render: function (data) {
          var color = "black";
          if (data === 1) {
            color = "green";
          }
          if (data === 0) {
            color = "red";
          }
          if (data === 1) {
            return (
              '<span style="color:' +
              color +
              '; font-size: 1rem;">' +
              "Activo" +
              "</span>"
            );
          } else if (data === 0) {
            return (
              '<span style="color:' +
              color +
              '; font-size: 1rem;">' +
              "Inactivo" +
              "</span>"
            );
          }
        },
      },
      {
        data: "fechaCreacion",
        title: "Fecha de registro",
        width: "180px",
        render: function (data) {
          if (data != null) return moment(data).format("DD/MM/YYYY HH:mm");
          return data;
        },
      },
      {
        data: "razonSocial",
        title: "Nombre/Razón social",
        width: "150px",
      },
      { data: "identificacion", title: "ID", width: "100px" },
      { data: "email", title: "Email", width: "250px" },
    ],
  });
}

$(document).ready(function () {
  cargarTabla();

  $("#tablex tbody").on("click", "#tblBtnEditar", function (e) {
    e.preventDefault();
    let data = table.row($(this).parents("tr")).data();
    let input_edit = document.querySelectorAll(".input-edit");
    let btnEditUser = document.querySelector("#btnEditUser");

    input_edit[0].value = data.razonSocial;
    input_edit[1].value = data.identificacion;
    input_edit[2].value = data.email;
    input_edit[3].value = data.telefono;

    btnEditUser.addEventListener("click", () => {
      $.ajax({
        url:
        WEB_CONFIG.api_url.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.mant_user_cli,
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
          IdUsuario: data.idUsuario,
          Identificacion: input_edit[1].value,
          TipoIdentificacion: 2,
          Nombre: input_edit[0].value,
          Email: input_edit[2].value,
          Telefono: input_edit[3].value,
          Estado: true,
        }),
        headers: {
          Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
        },
        success: function (res) {
          registrarEventosUsuario(
            WEB_CONFIG3.acciones_user.editar,
            WEB_CONFIG3.id_ventanas.usuario_edoc_cliente,
            "Se editó el usuario: " + data.razonSocial
          );

          Swal.fire({
            title: "¡Que bien!",
            text: "El usuario ha sido editado satisfactoriamente",
            icon: "success",
            confirmButtonColor: "#2797d2",
          }).then((result) => {
            if (result.isConfirmed) {
              table.ajax.reload();
            }
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
  });

  $("#tablex tbody").on("click", ".tblBtnDel", function (e) {
    e.preventDefault();
    var data = table.row($(this).parents("tr")).data();

    Swal.fire({
      title: "Confirmación",
      text: "¿Estás seguro que deseas inactivarlo?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#2797d2",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        inactUser(data);
      }
    });
  });
});

function inactUser(data) {
  $.ajax({
    url: WEB_CONFIG.api_url.api_security.url + WEB_CONFIG2.api_methods.api_security.methods.mant_user_cli,
    method: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({
      IdUsuario: data.idUsuario,
      Identificacion: data.identificacion,
      TipoIdentificacion: 2,
      Nombre: data.razonSocial,
      Email: data.email,
      // Telefono: '',
      Estado: false,
    }),
    headers: {
      Authorization: "Bearer" + `${Cookies.get(KEY_TOKEN)}`,
    },
    success: function (res) {
      registrarEventosUsuario(
        WEB_CONFIG3.acciones_user.eliminar,
        WEB_CONFIG3.id_ventanas.usuario_edoc_cliente,
        "Se inactivó el usuario: " + data.razonSocial
      );
      table.ajax.reload();

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
        title: "El usuario se inactivó exitosamente",
        iconColor: "#fff",
        color: "#fff",
        background: "#6acc52",
      });
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

$("#btnConsultar").click(function () {
  if (table != null) {
    registrarEventosUsuario(
      WEB_CONFIG3.acciones_user.consulta,
      WEB_CONFIG3.id_ventanas.usuario_edoc_cliente,
      "Consulta usuario."
    );
    table.ajax.reload();
  }
});
