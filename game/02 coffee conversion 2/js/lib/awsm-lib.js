// Generated by CoffeeScript 1.9.0
var log;

log = function(message, message_type) {
  var date, message_color, n, new_content, old_content, time;
  message_color = 'ui_info';
  if (typeof message_type !== 'undefined') {
    message_color = 'ui_system';
  }
  date = new Date;
  n = date.toDateString();
  time = date.toLocaleTimeString();
  old_content = document.getElementById('ui_container').innerHTML;
  new_content = '<div class=' + message_color + '><span class=\'ui_time\'>' + time + '</span><br />' + message + '</div>';
  return document.getElementById('ui_container').innerHTML = new_content + old_content;
};

//# sourceMappingURL=awsm-lib.js.map
