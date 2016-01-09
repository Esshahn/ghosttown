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

  # Arrow key movement
  KeyboardController {
    37: ->
      player.set_position(37)
      return
    38: ->
      player.set_position(38)
      return
    39: ->
      player.set_position(39)
      return
    40: ->
      player.set_position(40)
      return
  }, 60

  # load in the charmap
  chars_game_tx      = new (PIXI.Texture.fromImage)('img/chars.png')
  @charset_game      = new Generate_charset(chars_game_tx, 8, 8, 16, 16)
  chars_commodore_tx = new (PIXI.Texture.fromImage)('img/chars-commodore.png')
  @charset_commodore = new Generate_charset(chars_commodore_tx, 8, 8, 16, 16)
  chars_hint_tx = new (PIXI.Texture.fromImage)('img/chars-hint.png')
  @charset_hint = new Generate_charset(chars_hint_tx, 8, 8, 16, 16)
  chars_other_tx = new (PIXI.Texture.fromImage)('img/chars-other.png')
  @charset_other = new Generate_charset(chars_other_tx, 8, 8, 16, 16)
  

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

    # create a copy of the screen data to use when a room needs to be reset
    # TODO: make sure the data for copying is actually there (race condition)
    @all_lvl.screen_data_copy = clone (@all_lvl.screen_data)

    # start with this room
    @room.set(1)
  ,300)
