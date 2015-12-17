###
  
  display manager

###

class Display

  constructor : ->
    # the main stage is including all borders and set to double size
    @renderer = new (PIXI.autoDetectRenderer)(768, 576, backgroundColor: COLOR_RED)
    
    document.body.appendChild @renderer.view
    @stage = new (PIXI.Container)

    # the main screen where the game displays in (320x200)
    @screen = new (PIXI.Container)
    @screen.position.x = LEFT_BORDER
    @screen.position.y = TOP_BORDER
    @screen.scale.set SCALE_FACTOR, SCALE_FACTOR

    # generate a mask that limits the screen to 320x200
    @myMask = new (PIXI.Graphics)
    @myMask.beginFill()
    @myMask.drawRect LEFT_BORDER, TOP_BORDER, (SCREEN_WIDTH - 8) * SCALE_FACTOR , (SCREEN_HEIGHT - 8) * SCALE_FACTOR 
    @myMask.endFill()
    @screen.mask = @myMask; 
    @stage.addChild @screen

    # background textures
    @bg_black = new (PIXI.Graphics)
    @bg_black.beginFill(COLOR_BLACK)
    @bg_black.drawRect 0, 0, (SCREEN_WIDTH - 8) * SCALE_FACTOR , (SCREEN_HEIGHT - 8) * SCALE_FACTOR 
    @bg_black.endFill()

    @bg_blue = new (PIXI.Graphics)
    @bg_blue.beginFill(COLOR_BLUE)
    @bg_blue.drawRect 0, 0, (SCREEN_WIDTH - 8) * SCALE_FACTOR , (SCREEN_HEIGHT - 8) * SCALE_FACTOR 
    @bg_blue.endFill()



  show_data : (charset = charset_game) ->

    @renderer.backgroundColor = COLOR_RED

    # will need to get more sophisticated, especially when parsing level data like object to show
    level_sprites = []
    xpos = 0
    ypos = 0

    @level_data = room.get()

    # clear the screen
    @clear()
    # then draw the background
    @screen.addChild @bg_black

    # and finally the level data
    i = 0
    while i < @level_data.length
      level_sprites[i] = new (PIXI.Sprite)(charset[@level_data[i]])
      if xpos >= SCREEN_WIDTH
        xpos = 0
        ypos += 8
      level_sprites[i].position.x = xpos
      level_sprites[i].position.y = ypos
      @screen.addChild level_sprites[i]
      xpos += 8
      i++


  show_msg : (msg_number, charset = charset_commodore) ->
    @renderer.backgroundColor = COLOR_BLUE

    level_sprites = []
    xpos = 0
    ypos = 0

    @level_data = all_msg.screen_data[msg_number]

    # clear the screen
    @clear()
    # then draw the background
    @screen.addChild @bg_blue

    # and finally the level data
    i = 0
    while i < @level_data.length
      level_sprites[i] = new (PIXI.Sprite)(charset[@level_data[i]])
      if xpos >= SCREEN_WIDTH
        xpos = 0
        ypos += 8
      level_sprites[i].position.x = xpos
      level_sprites[i].position.y = ypos
      @screen.addChild level_sprites[i]
      xpos += 8
      i++


  clear : ->

    # first remove all elements on screen
    # todo: might be better to have each level as a different container
    # and just switch containers to show

    i = @screen.children.length - 1
    while i >= 0
      @screen.removeChild @screen.children[i]
      i--



  renderloop : =>

    @renderer.render @stage
    requestAnimationFrame @renderloop
    return