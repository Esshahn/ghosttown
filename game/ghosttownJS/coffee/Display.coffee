#-------------------------------------------------------------------
# 
# Display Class
# 
# Creates the game screen, set borders, displays messages
#   
#-------------------------------------------------------------------

class Display

  constructor : ->
    # the main stage is including all borders and set to double size
    
    # if the crt shader is used, we need to force canvas over webgl
    @use_crt_shader = true

    if not @use_crt_shader
      # call this for no crt shader support
      @renderer = new (PIXI.autoDetectRenderer)(CANVAS_WIDTH, CANVAS_HEIGHT, backgroundColor: COLOR_BLACK)
      document.getElementById("game").appendChild @renderer.view
    else
      # call this for crt shader
      @renderer = new (PIXI.CanvasRenderer)(CANVAS_WIDTH, CANVAS_HEIGHT, backgroundColor: COLOR_BLACK)
      crtEmulator.init(@renderer.view,"game");

      # set this to on or off for the crt emulation
      @crt_emulation = on

      if @crt_emulation is on       
        crtEmulator.scanlines = true
        crtEmulator.gaussian = 0.6
        crtEmulator.light = 8
        crtEmulator.curvature = true
        crtEmulator.gamma = 0.8
        crtEmulator.contrast = 0.9
        crtEmulator.saturation = 0.8
        crtEmulator.brightness = 1.6
      else 
        crtEmulator.scanlines = crtEmulator.curvature = false
        crtEmulator.gaussian = crtEmulator.light = 0
        crtEmulator.gamma = crtEmulator.contrast = crtEmulator.saturation = crtEmulator.brightness = 1


    # set the stage
    @stage = new (PIXI.Container)

    # the main screen where the game displays in (320x200)
    @screen            = new (PIXI.Container)
    @screen.position.x = LEFT_BORDER
    @screen.position.y = TOP_BORDER
    @screen.scale.set SCALE_FACTOR, SCALE_FACTOR
    @stage.addChild @screen

#-------------------------------------------------------------------

  # masktype = "game" (smaller size) or anything else
  # bordercolor = the color of the border
  # screencolor = the color of the game screen
  
  change_screen_colors : (masktype = "game", bordercolor, screencolor) ->

    @clear()

    # generate a mask that limits the screen to 320x200
    size_limit = if masktype is "game" then 8 else 0

    @mask = new (PIXI.Graphics)
    @mask.beginFill()
    @mask.drawRect LEFT_BORDER, TOP_BORDER, (SCREEN_WIDTH - size_limit) * SCALE_FACTOR , (SCREEN_HEIGHT - size_limit) * SCALE_FACTOR 
    @mask.endFill()

    @screen.mask = @mask

    @renderer.backgroundColor = bordercolor

    @screen_color = new (PIXI.Graphics)
    @screen_color.beginFill(screencolor)
    @screen_color.drawRect 0, 0, (SCREEN_WIDTH - size_limit) * SCALE_FACTOR , (SCREEN_HEIGHT - size_limit) * SCALE_FACTOR 
    @screen_color.endFill()

    @screen.addChild @screen_color

#-------------------------------------------------------------------

  show_data : (charset = charset_game) ->

    @level_data = room.get()
    @change_screen_colors "game", COLOR_RED, COLOR_BLACK
    @create_level_data(@level_data,charset)

#-------------------------------------------------------------------

  show_death : (msg_number, charset = charset_commodore) ->
    
    @level_data = room.playround_data.all_msg.screen_data[msg_number]
    @change_screen_colors "full", COLOR_BLUE, COLOR_BLUE
    @create_level_data(@level_data,charset)

#-------------------------------------------------------------------

  show_msg : (msg_number, charset = charset_hint) ->

    @level_data = room.playround_data.all_msg.screen_data[msg_number]
    @change_screen_colors "full", COLOR_RED, COLOR_BLACK
    @create_level_data(@level_data,charset)

#-------------------------------------------------------------------

  show_other : (msg_number, charset = charset_commodore, color = COLOR_YELLOW) ->

    @level_data = room.playround_data.all_other.screen_data[msg_number]

    screencolor = color

    # for the intro screen set the screen color to black
    screencolor = COLOR_BLACK if msg_number is 2
      
    @change_screen_colors "full", color, screencolor

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

  # remove all elements on screen

  clear : ->

    i = @screen.children.length - 1
    while i >= 0
      @screen.removeChild @screen.children[i]
      i--

#-------------------------------------------------------------------

  addElement : (element) ->
    @screen.addChild element

#-------------------------------------------------------------------

  toggleCRT : ->

    if @use_crt_shader
      if @crt_emulation is off
        @crt_emulation = on
        crtEmulator.scanlines = true
        crtEmulator.gaussian = 0.6
        crtEmulator.light = 8
        crtEmulator.curvature = true
        crtEmulator.gamma = 0.8
        crtEmulator.contrast = 0.9
        crtEmulator.saturation = 0.8
        crtEmulator.brightness = 1.6
      else 
        @crt_emulation = off
        crtEmulator.scanlines = crtEmulator.curvature = false
        crtEmulator.gaussian = crtEmulator.light = 0
        crtEmulator.gamma = crtEmulator.contrast = crtEmulator.saturation = crtEmulator.brightness = 1

#-------------------------------------------------------------------

  renderloop : =>

    @renderer.render @stage
    crtEmulator.updateFrame() if @use_crt_shader
    requestAnimationFrame @renderloop
    return
