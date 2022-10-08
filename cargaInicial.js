
$(document).ready(() => {
  $.getJSON('web.config.json', function (data) {
    var WEB_CONFIG = data;

    localStorage.setItem('web_config', JSON.stringify(WEB_CONFIG));
  });

  $.getJSON('web2.config.json', function (data) {
    var WEB_CONFIG2 = data;

    localStorage.setItem('web_config2', JSON.stringify(WEB_CONFIG2));
  });

  $.getJSON('ventanas.config.json', function (data) {
    var WEB_CONFIG3 = data;

    localStorage.setItem('web_config3', JSON.stringify(WEB_CONFIG3));
  });
});