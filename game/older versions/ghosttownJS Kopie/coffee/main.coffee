###

  Ghost Town JS - a JavaScript remake of the Commodore C16, C116, Plus/4 game
  Original version written by Udo Gertz, copyright Kingsoft 1985
  Remake written by Ingo Hinterding 2015,2016

###


init = ->
  load_assets ->
    init_game()
  return


init_game = ->

  document.addEventListener('keydown', event_keydown, false)
  # implement better keydown tracking
  # http://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
  

  # load in the charmap
  chars_tx = new (PIXI.Texture.fromImage)('img/chars1.png')
  @charset = new Generate_charset(chars_tx, 8, 8, 16, 16)
  
  # load in all levels
  @all_levels = new Levels()
  @room = new Room()
  @player = new Player()
  @display = new Display()

  @display.renderloop()