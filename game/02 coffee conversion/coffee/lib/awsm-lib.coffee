

log = (message, message_type) ->
  # displays a message in the status window

  message_color = 'ui_info'
   
  if typeof message_type != 'undefined'
    message_color = 'ui_system'

  date = new Date
  n = date.toDateString()
  time = date.toLocaleTimeString()
  old_content = document.getElementById('ui_container').innerHTML
  new_content = '<div class=' + message_color + '><span class=\'ui_time\'>' + time + '</span><br />' + message + '</div>'
  document.getElementById('ui_container').innerHTML = new_content + old_content