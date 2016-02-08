###

  Ghost Town JS - a JavaScript remake of the Commodore C16, C116, Plus/4 game
  Original version created by Udo Gertz, copyright Kingsoft 1985
  Written by Ingo Hinterding 2015,2016

###

#-------------------------------------------------------------------

# gets called from html body -> onload 

init = ->
  load_assets ->    
    init_game()
  return

#-------------------------------------------------------------------

# gets called when all images are loaded

init_game = ->

  # load in the charmap
  chars_game_tx             = new (PIXI.Texture.fromImage)('img/chars.png')
  @charset_game             = new Generate_charset(chars_game_tx, 8, 8, 16, 16)
  chars_commodore_tx        = new (PIXI.Texture.fromImage)('img/chars-commodore.png')
  @charset_commodore        = new Generate_charset(chars_commodore_tx, 8, 8, 16, 16)
  chars_commodore_green_tx  = new (PIXI.Texture.fromImage)('img/chars-commodore-green.png')
  @charset_commodore_green  = new Generate_charset(chars_commodore_green_tx, 8, 8, 16, 16)
  chars_commodore_orange_tx = new (PIXI.Texture.fromImage)('img/chars-commodore-orange.png')
  @charset_commodore_orange = new Generate_charset(chars_commodore_orange_tx, 8, 8, 16, 16)
  chars_hint_tx             = new (PIXI.Texture.fromImage)('img/chars-hint.png')
  @charset_hint             = new Generate_charset(chars_hint_tx, 8, 8, 16, 16)
  
  # set the game language
  @locale = "de"

  # load in all levels, messages and other stuff
  @all_levels_counter = 0
  @all_lvl   = new BinaryImport("lvl")
  @all_msg   = new BinaryImport("msg",@locale)
  @all_other = new BinaryImport("other",@locale)

  @display = new Display()

#-------------------------------------------------------------------

# start_game gets called from the Binary Import class 
# after all levels are loaded

start_game = ->

  # setup the main classes
  @player  = new Player()

  # init the sound
  @sound = new Howl({urls: ['sound/ghost-town-loop.ogg'],  autoplay: true, loop: true, volume: 1.0})
  #@sound.volume 0

  # some UI status to kick notifications off
  ui_log("Ghost Town JS. Current build: 16.01.22","green")
  ui_log("User cursor keys and space to move the player.","green")

  # start with this room
  @room    = new Room()

  # create a copy of the screen data to use when a room needs to be reset
  # TODO: make sure the data for copying is actually there (race condition)
  @room.other(1, charset_commodore, COLOR_GREY)
  #@room.msg(30)
  @controls = new KeyboardController "title", 300

  @display.renderloop()

#-------------------------------------------------------------------

