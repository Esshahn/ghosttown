

log = (message, message_type) ->
  # displays a message in the status window
  # 'green' = green
  # 'red' = red
  # 'blue' = blue
  # nothing = grey

  message_color = "notif-"+message_type
   
  if typeof message_type == 'undefined'
    message_color = ''

  date = new Date
  n = date.toDateString()
  time = date.toLocaleTimeString()
  old_content = document.getElementById('ui_container').innerHTML
  new_content = '<div class=\'notification ' + message_color + '\'><span class=\'ui_time\'>' + time + '</span><br />' + message + '</div>'
  document.getElementById('ui_container').innerHTML = new_content + old_content