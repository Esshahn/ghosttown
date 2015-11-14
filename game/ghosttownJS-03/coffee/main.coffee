###

  Ghost Town JS - a JavaScript remake of the Commodore C16, C116, Plus/4 game
  Original version written by Udo Gertz, copyright Kingsoft 1985
  Remake written by Ingo Hinterding 2015,2016

###


init = ->
  log '<b>Welcome to Ghost Town JS.</b>','green'
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
  


