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
  chars_game_tx      = new (PIXI.Texture.fromImage)('img/chars.png')
  @charset_game      = new Generate_charset(chars_game_tx, 8, 8, 16, 16)
  chars_commodore_tx = new (PIXI.Texture.fromImage)('img/chars-commodore.png')
  @charset_commodore = new Generate_charset(chars_commodore_tx, 8, 8, 16, 16)
  

  # load in all levels, messages and other stuff
  @all_lvl   = new BinaryImport("lvl")
  @all_msg   = new BinaryImport("msg")
  @all_other = new BinaryImport("other")

  # setup the main classes
  @room    = new Room()
  @player  = new Player()
  @display = new Display()
  @display.renderloop()

  # some UI status to kick notifications off
  ui_log("Ghost Town JS. Current build: 15.12.17","green")
  ui_log("User cursor keys to move the player.","green")

  # hacky ugly timeout to make the first level being loaded
  # a bit more likely. still needs proper asset loading
  setTimeout( =>
    @room.set(1)
  ,1)