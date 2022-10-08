//  $(document).ready(function() {
// // Modal Select Usuario Cre Noti
// var tblCreNoti = document.querySelector("#tblCreNoti");

// tblCreNoti = $("#tblCreNoti").DataTable({
//   dom: 'Bfrtip',
//         pageLength: 7,
//         buttons: [
//           {
//             extend: 'selectAll',
//             text: '<i class="icon-check" aria-hidden="true"></i>',
//             titleAttr: 'Seleccionar todo'
//           },
//           {
//             extend: 'selectNone',
//             text: '<i class="icon-unchecked" aria-hidden="true"></i>',
//             titleAttr: 'Seleccionar todo'
//           },
//           {
//                 text: '<i class="icon-plus" aria-hidden="true"></i>',
//                 action: function ( e, dt, node, config ) {
//                   console.log(tblCreNoti
//       .rows(".selected")
//       .data()
//       .toArray());
//                 }
//            }
//         ],
//           // Multi Select
//           select: {
//             style: "multi",
//             selector: "td:first-child"
//           },
//           // Select Column
//           columnDefs: [
//             {className: "dt-center",orderable: false, targets: [1,2,3]},
//             {
//               orderable: false,
//               className: "select-checkbox",
//               targets: 0
//             }
//           ],
//         language: {
//           search: "_INPUT_",
//           searchPlaceholder: "Buscar",
//           "paginate": {
//               "previous": "<i class='icon-arrow-left' aria-hidden='true'></i>",
//             "next": "<i class='icon-arrow-right' aria-hidden='true'></i>"
//             },
//             buttons: {
//               selectNone: "Borrar selección"
//             }
//           },
//         ajax: {
//           url: "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Administration/Administracion/ObtenerClientesPorParametros",
//           type: "GET",
//           dataType: "json",
//           beforeSend: function (xhr) {
//             xhr.setRequestHeader(
//               "Authorization",
//               "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJVc3VhcmlvIjoiYWRtaW5fMjAyMSIsIkNsYXZlRW5jcmlwdGFkYSI6ImNPQVJzajNUZDVnKzgyRUVkUzJxN2c9PSIsIklkQ29tcGFuaWEiOiIyIiwiUnVjQ29tcGFuaWEiOiIzMTAxNzQ2Nzk1IiwiQ29ycmVvIjoia2V2aW4ubWFyaXNjYWxAZ3VydS1zb2Z0LmNvbSIsIklkVXN1YXJpbyI6IjEiLCJuYmYiOjE2Mzg0ODYxODIsImV4cCI6MTYzODcwODE4MiwiaWF0IjoxNjM4NDg2MTgyLCJpc3MiOiJlRG9jIiwiYXVkIjoiUG9ydGFsQ29uc3VsdGEifQ.DhskfDKC1U7QEEtKjVlSVnMmM6YQFWsZBQX2uGxCfBhLE0-VCcyD001fZCeA4xNu-M6SGijmWzRtEeOM5FM3FQ"
//             );
//           },
//           dataSrc: function (respuesta) {
//             return respuesta.resultado.usuarios;
//           },
//           data: function (d) {
//             d.numsItemsOmitir = 0;
//             d.numsItemsTomar = 100;
//           },
//           error: function (res) {
//             console.log("error");
//           },
//         },
//         columns: [
//           {
//             defaultContent:"",
//             title: "Acción",
//             width: "80px"
//           },
//           {
//             data: "idUsuario",
//             visible: false,
//           },
//           { data: "identificacion", title: "ID", width: "100px" },
//           { data: "razonSocial", title: "Nombre", width: "200px" },
//         ],
//       });
	  
//       //tblCreNoti.draw();
// });
  

