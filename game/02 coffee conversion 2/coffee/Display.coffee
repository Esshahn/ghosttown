###
  
  display manager

###

class Display

  constructor : ->

  show_level : (level) ->
        log "Level: "+level,1
        # will need to get more sophisticated, especially when parsing level data like object to show
        level_sprites = []
        xpos = 0
        ypos = 0
        level_data = all_levels.screens[level]

        # clear the screen
        @clear()

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

  clear : ->

    # first remove all elements on screen
    # todo: might be better to have each level as a different container
    # and just switch containers to show

    i = screen.children.length - 1
    while i >= 0
      screen.removeChild screen.children[i]
      i--
    # then draw the background
    screen.addChild bg
