init = ->
  log '<b>Welcome to Ghost Town JS.</b>'
  load_assets()
  return      

asset_loader_ready = ->
  log 'assets loaded.'
  init_game()
  renderloop()
  return


init_game = ->
  # the main stage is including all borders and set to double size
  @renderer = new (PIXI.autoDetectRenderer)(768, 576, backgroundColor: 0x792e1d)
  
  document.body.appendChild renderer.view
  @stage = new (PIXI.Container)

  # the main screen where the game displays in (320x200)
  @screen = new (PIXI.Container)
  screen.position.x = LEFT_BORDER
  screen.position.y = TOP_BORDER
  screen.scale.set SCALE_FACTOR, SCALE_FACTOR

  # generate a mask that limits the screen to 320x200
  @myMask = new (PIXI.Graphics)
  myMask.beginFill()
  myMask.drawRect LEFT_BORDER, TOP_BORDER, SCREEN_WIDTH * SCALE_FACTOR, SCREEN_HEIGHT * SCALE_FACTOR
  myMask.endFill()
  #screen.mask = myMask; 
  stage.addChild screen
  log 'stage created'

  # load in the charmap
  chars_tx = new (PIXI.Texture.fromImage)('img/chars1.png')
  @chars = new (PIXI.Sprite)(chars_tx)
  
  # generate the charset
  @charset = new Generate_charset(chars_tx, 8, 8, 16, 16).all_chars


  # load in all levels
  @all_levels = new Levels
  # background texture
  bg_tx = PIXI.Texture.fromImage('img/screen-bg.png')
  @bg = new (PIXI.Sprite)(bg_tx)

  @display = new Display

renderloop = ->
  #display_level(current_level.screen);

  renderer.render stage
  requestAnimationFrame renderloop
  return
