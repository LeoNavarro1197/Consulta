
$(document).ready(function(e) {
    $('#showSweet').click(function() {
      swal("OK", "", "success");
    });
    var jsonArr = [];
    
    $('#ajaxData').click(function() {
      $("#showLoading").addClass("fa-spin");
      $.ajax({
        url: "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Security/Seguridad/ObtenerPermisosActivosConsulta",
        method: "get"
      }).done(function(users) {
        jsonArr = [];
        $.each( users, function( index, user ) {
          var obj = {};
                      obj.id = "user" + user.idPermiso;
                      obj.text = user.nombre;
                      obj.parent = user.idPermisoPadre;
                      // obj.data = user;
                      // obj.icon = "fa fa-user";
                      // obj.children = true;
                      jsonArr.push(obj);
        });
        $.ajax({
          url: "https://devreg5.guru-soft.com/EdocPanama/4.5/EdocConsulta/Api/Security/Seguridad/ObtenerPermisosActivosConsulta",
          method: "get"
        }).done(function(posts) {
          $.each( posts, function( index, post ) {
            var obj = {};
                      obj.id = "post" + post.idPermiso;
                      obj.text = post.nombre;
                      obj.parent = post.idPermisoPadre;
                      // obj.data = user;
                      // obj.icon = "fa fa-user";
                      // obj.children = true;
                      jsonArr.push(obj);
          });
          $("#showLoading").removeClass("fa-spin");
          console.log(jsonArr);
          $('#jstree')
          .on('changed.jstree', function (e, data) {
            var i, j, r = [];
            for(i = 0, j = data.selected.length; i < j; i++) {
              r.push(data.instance.get_node(data.selected[i]).text);
            }
            $('#node').html('Selected: ' + r.join(', '));
          })
          .jstree({ 
            'core' : {
              'data' : jsonArr
            }
          });
        });
      }).fail(function(jqXHR, textStatus) {
        $("#showLoading").removeClass("fa-spin");
        alert("Request failed: " + jqXHR.statusText);
      });
    });

    
  });