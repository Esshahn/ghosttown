// Generated by CoffeeScript 1.9.0
var clone, ui_inventory, ui_log, ui_room;

ui_log = function(message, message_type) {
  var date, message_color, n, new_content, old_content, time;
  if (message_type == null) {
    message_type = '';
  }
  message_color = "notif-" + message_type;
  date = new Date;
  n = date.toDateString();
  time = date.toLocaleTimeString();
  old_content = document.getElementById('ui_notification').innerHTML;
  new_content = '<div class=\'notification ' + message_color + '\'><span class=\'ui_time\'>' + time + '</span><br />' + message + '</div>';
  return document.getElementById('ui_notification').innerHTML = new_content + old_content;
};

ui_inventory = function(message) {
  if (message == null) {
    message = "Your inventory is empty.";
  }
  return document.getElementById('ui_inventory').innerHTML = "Inventory:<br /><b>" + message + "</b>";
};

ui_room = function(message) {
  if (message == null) {
    message = "Room";
  }
  return document.getElementById('ui_room').innerHTML = message;
};

clone = function(obj) {
  var flags, key, newInstance;
  if ((obj == null) || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    flags = '';
    if (obj.global != null) {
      flags += 'g';
    }
    if (obj.ignoreCase != null) {
      flags += 'i';
    }
    if (obj.multiline != null) {
      flags += 'm';
    }
    if (obj.sticky != null) {
      flags += 'y';
    }
    return new RegExp(obj.source, flags);
  }
  newInstance = new obj.constructor();
  for (key in obj) {
    newInstance[key] = clone(obj[key]);
  }
  return newInstance;
};

//# sourceMappingURL=awsm-lib.js.map
