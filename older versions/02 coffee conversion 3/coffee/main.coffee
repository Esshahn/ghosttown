init = ->
  log '<b>Welcome to Ghost Town JS.</b>'
  load_assets()
  return      

asset_loader_ready = ->
  log 'assets loaded.'
  init_game()
  return


init_game = ->

  @display = new Display()

  # load in the charmap
  chars_tx = new (PIXI.Texture.fromImage)('img/chars1.png')
  @charset = new Generate_charset(chars_tx, 8, 8, 16, 16).all_chars


  # load in all levels
  @all_levels = new Levels()

  @display.renderloop()
  


