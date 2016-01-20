###
  
  display manager

###

class Display

  constructor : ->
    # the main stage is including all borders and set to double size
    @renderer = new (PIXI.autoDetectRenderer)(768, 576, backgroundColor: COLOR_RED)
    
    # the line below should be used when not using the CRT shader
    #document.getElementById("game").appendChild @renderer.view

    # this is used for the CRT shader effect
    codefCRTemulator.setup(@renderer.view,"game")

    # set this to on or off for the crt emulation
    @crt_emulation = on

    if @crt_emulation is on 
      codefCRTemulator.set.scanlines true
      codefCRTemulator.set.gaussian 0.6
      codefCRTemulator.set.light 8
      codefCRTemulator.set.curvature true
      codefCRTemulator.set.gamma 1
      codefCRTemulator.set.contrast 0.9
      codefCRTemulator.set.saturation 0.8
      codefCRTemulator.set.brightness 1.4
    else 
      codefCRTemulator.set.scanlines false
      codefCRTemulator.set.gaussian 0
      codefCRTemulator.set.light 0
      codefCRTemulator.set.curvature false
      codefCRTemulator.set.gamma 1
      codefCRTemulator.set.contrast 1
      codefCRTemulator.set.saturation 1
      codefCRTemulator.set.brightness 1
    
    @stage = new (PIXI.Container)

    # the main screen where the game displays in (320x200)
    @screen = new (PIXI.Container)
    @screen.position.x = LEFT_BORDER
    @screen.position.y = TOP_BORDER
    @screen.scale.set SCALE_FACTOR, SCALE_FACTOR

    # generate a mask that limits the screen to 312x192
    @maskGame = new (PIXI.Graphics)
    @maskGame.beginFill()
    @maskGame.drawRect LEFT_BORDER, TOP_BORDER, (SCREEN_WIDTH - 8) * SCALE_FACTOR , (SCREEN_HEIGHT - 8) * SCALE_FACTOR 
    @maskGame.endFill()
    @screen.mask = @maskGame
    @stage.addChild @screen

    # generate a mask that limits the screen to 320x200
    @maskFull = new (PIXI.Graphics)
    @maskFull.beginFill()
    @maskFull.drawRect LEFT_BORDER, TOP_BORDER, (SCREEN_WIDTH) * SCALE_FACTOR , (SCREEN_HEIGHT) * SCALE_FACTOR 
    @maskFull.endFill()

    # background textures
    @bg_black = new (PIXI.Graphics)
    @bg_black.beginFill(COLOR_BLACK)
    @bg_black.drawRect 0, 0, (SCREEN_WIDTH - 8) * SCALE_FACTOR , (SCREEN_HEIGHT - 8) * SCALE_FACTOR 
    @bg_black.endFill()

    @bg_blue = new (PIXI.Graphics)
    @bg_blue.beginFill(COLOR_BLUE)
    @bg_blue.drawRect 0, 0, (SCREEN_WIDTH - 8) * SCALE_FACTOR , (SCREEN_HEIGHT - 8) * SCALE_FACTOR 
    @bg_blue.endFill()

    @bg_yellow = new (PIXI.Graphics)
    @bg_yellow.beginFill(COLOR_YELLOW)
    @bg_yellow.drawRect 0, 0, (SCREEN_WIDTH - 8) * SCALE_FACTOR , (SCREEN_HEIGHT - 8) * SCALE_FACTOR 
    @bg_yellow.endFill()

#-------------------------------------------------------------------

  show_data : (charset = charset_game) ->

    @renderer.backgroundColor = COLOR_RED
    @screen.mask = @maskGame

    @level_data = room.get()

    # clear the screen
    @clear()
    # then draw the background
    @screen.addChild @bg_black
    @create_level_data(@level_data,charset)

#-------------------------------------------------------------------

  show_death : (msg_number, charset = charset_commodore) ->
    
    @renderer.backgroundColor = COLOR_BLUE
    @screen.mask = @maskFull

    @level_data = all_msg.screen_data[msg_number]

    # clear the screen
    @clear()
    # then draw the background
    @screen.addChild @bg_blue
    @create_level_data(@level_data,charset)

#-------------------------------------------------------------------

  show_msg : (msg_number, charset = charset_hint) ->

    @renderer.backgroundColor = COLOR_RED
    @screen.mask = @maskFull

    @level_data = all_msg.screen_data[msg_number]

    # clear the screen
    @clear()
    # then draw the background
    @screen.addChild @bg_black
    @create_level_data(@level_data,charset)

#-------------------------------------------------------------------

  show_other : (msg_number, charset = charset_commodore) ->
    
    @renderer.backgroundColor = COLOR_YELLOW
    @screen.mask = @maskFull

    @level_data = all_other.screen_data[msg_number]

    # clear the screen
    @clear()
    # then draw the background
    @screen.addChild @bg_yellow
    @create_level_data(@level_data,charset)

#-------------------------------------------------------------------

  create_level_data : (@level_data, charset)->

    level_sprites = []
    xpos = 0
    ypos = 0

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

#-------------------------------------------------------------------

  clear : ->

    # first remove all elements on screen
    # todo: might be better to have each level as a different container
    # and just switch containers to show

    i = @screen.children.length - 1
    while i >= 0
      @screen.removeChild @screen.children[i]
      i--

#-------------------------------------------------------------------

  renderloop : =>

    @renderer.render @stage
    codefCRTemulator.draw()
    requestAnimationFrame @renderloop
    return
