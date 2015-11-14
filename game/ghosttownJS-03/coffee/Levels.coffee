
class Levels

  ###

    GHOST TOWN JS
    LEVEL GENERATOR

  ###

  screens : []

  constructor: -> 
    # load in the levels
    i = 0
    while i < 20
      i++
      @screens[i] = @import_screen_data(levels_config[i].filename) 
    log 'loaded ' + i + ' levels into memory'


  import_screen_data: (filename) ->
    # loads in a level binary file
    file_fullpath = 'data/screen-lvl-' + filename + '.bin'
    leveldat = []
    oReq = new XMLHttpRequest
    oReq.open 'GET', file_fullpath, true
    oReq.responseType = 'arraybuffer'

    oReq.onload = (oEvent) ->
      arrayBuffer = oReq.response
      # Note: not oReq.responseText
      if arrayBuffer
        byteArray = new Uint8Array(arrayBuffer)
        # start i=2 -> skip the first two values, they are not needed
        i = 2
        while i < byteArray.byteLength
          # convert the number to 2 digit hex
          char = ('0' + byteArray[i].toString(16)).slice(-2)
          # erase the player character from the level data
          #if char >= '93' and char <= '9b'
          #  char = 'df'
          # put all hex data in level_data
          leveldat.push char
          i++
      return

    oReq.send null
    leveldat


  