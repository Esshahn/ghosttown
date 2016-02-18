

ui_log = (message, message_type = '') ->
  if window.location.search is "?debug=true"
    # displays a message in the status window
    # 'green' = green
    # 'red' = red
    # 'blue' = blue
    # nothing = grey

    message_color = "notif-"+message_type
     
    date = new Date
    n = date.toDateString()
    time = date.toLocaleTimeString()
    old_content = document.getElementById('ui_notification').innerHTML
    new_content = '<div class=\'notification ' + message_color + '\'><span class=\'ui_time\'>' + time + '</span><br />' + message + '</div>'
    document.getElementById('ui_notification').innerHTML = new_content + old_content


ui_inventory = (message = "Your inventory is empty.") ->
  if window.location.search is "?debug=true"
    # updates the inventory field of the UI
    document.getElementById('ui_inventory').innerHTML = "Inventory:<br /><b>" + message + "</b>"


ui_room = (message = "Room") ->
  if window.location.search is "?debug=true"
    # updates the room field of the UI
    document.getElementById('ui_room').innerHTML = message


clone = (obj) ->
  if not obj? or typeof obj isnt 'object'
    return obj

  if obj instanceof Date
    return new Date(obj.getTime()) 

  if obj instanceof RegExp
    flags = ''
    flags += 'g' if obj.global?
    flags += 'i' if obj.ignoreCase?
    flags += 'm' if obj.multiline?
    flags += 'y' if obj.sticky?
    return new RegExp(obj.source, flags) 

  newInstance = new obj.constructor()

  for key of obj
    newInstance[key] = clone obj[key]

  return newInstance


changeImage = (id) ->
  the_img = document.getElementById(id)
  x = the_img.src.split('/')
  t = x.length - 1
  y = x[t]
  
  if y == 'knob-left.png'
    the_img.src = './img/knob-right.png'
    
  if y == 'knob-right.png'
    the_img.src = './img/knob-left.png'

  if id is "knob_scanlines"
    display.toggleCRT()

  return

changeVolume = (id) ->
  the_img = document.getElementById(id)
  x = the_img.src.split('/')
  t = x.length - 1
  y = x[t]
  
  if y == 'knob-volume-left.png'
    the_img.src = './img/knob-volume-middle.png'
    if sound?
      sound.isMute = false
      sound.unmute()
  if y == 'knob-volume-middle.png'
    the_img.src = './img/knob-volume-left.png'
    if sound?
      sound.isMute = true
      sound.mute()
  return