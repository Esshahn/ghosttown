


class Levels

  ###

    GHOST TOWN JS
    LEVEL GENERATOR

  ###

  screens : []

  constructor: ->
    log 'loading all levels into memory'
    
    i = 1
    while i <= 20
      @screens[i] = @import_screen_data(levels_config[i].filename)
      i++

  import_screen_data: (filename) ->
    # loads in a level binary file
    file_fullpath = 'data/screen-lvl-' + filename + '.bin'
    level_data = []
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
          if char >= '93' and char <= '9b'
            char = 'df'
          # put all hex data in level_data
          level_data.push char
          i++
      return

    oReq.send null
    level_data


  display_level : (level) ->
      log "Level: "+level,1
      # will need to get more sophisticated, especially when parsing level data like object to show
      level_sprites = []
      xpos = 0
      ypos = 0
      level_data = all_levels.screens[level]

      # first remove all elements on screen
      # todo: might be better to have each level as a different container
      # and just switch containers to show
      i = screen.children.length - 1
      while i >= 0
        screen.removeChild screen.children[i]
        i--
      # then draw the background
      screen.addChild bg
      # and finally the level data
      i = 0
      while i < level_data.length
        level_sprites[i] = new (PIXI.Sprite)(charset[level_data[i]])
        if xpos >= SCREEN_WIDTH
          xpos = 0
          ypos += 8
        level_sprites[i].position.x = xpos
        level_sprites[i].position.y = ypos
        screen.addChild level_sprites[i]
        xpos += 8
        i++