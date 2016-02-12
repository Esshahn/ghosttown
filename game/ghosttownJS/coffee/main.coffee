###

  Ghost Town JS - a JavaScript remake of the Commodore C16, C116, Plus/4 game
  Original version created by Udo Gertz, copyright Kingsoft 1985
  Written by Ingo Hinterding 2015,2016

###

#-------------------------------------------------------------------

# gets called from html body -> onload 

init = ->
  loader = PIXI.loader

  loader.add 'chars',                   'img/chars.png'
  loader.add 'chars_commodore',         'img/chars-commodore.png'
  loader.add 'chars_commodore_green',   'img/chars-commodore-green.png'
  loader.add 'chars_commodore_orange',  'img/chars-commodore-orange.png'
  loader.add 'chars_hint',              'img/chars-hint.png'
  loader.add 'kingsoft',                'img/kingsoft.png'
  loader.add 'credits',                 'img/credits.png'
  loader.add 'boot',                    'img/boot.png'
  loader.add 'music',                   'sound/ghost-town-loop.ogg'
  
  loader.once 'complete', -> init_game()
  loader.load()
  return

#-------------------------------------------------------------------

init_loader = ->
  @load_menu = new C16Loader()
  #start_game()

#-------------------------------------------------------------------

# gets called when all images are loaded
# loads in all levels
# and if all levels are loaded, the init_loader method is called

init_game = ->

  @display = new Display()
  @display.renderloop()

  # load in the charmap
  @charset_game             = new Generate_charset(new (PIXI.Texture.fromImage)('img/chars.png'), 8, 8, 16, 16)
  @charset_commodore        = new Generate_charset(new (PIXI.Texture.fromImage)('img/chars-commodore.png'), 8, 8, 16, 16)
  @charset_commodore_green  = new Generate_charset(new (PIXI.Texture.fromImage)('img/chars-commodore-green.png'), 8, 8, 16, 16)
  @charset_commodore_orange = new Generate_charset(new (PIXI.Texture.fromImage)('img/chars-commodore-orange.png'), 8, 8, 16, 16)
  @charset_hint             = new Generate_charset(new (PIXI.Texture.fromImage)('img/chars-hint.png'), 8, 8, 16, 16)
  
  # set the game language
  @locale = "de"

  # load in all levels, messages and other stuff
  @all_levels_counter = 0
  @all_lvl   = new BinaryImport("lvl")
  @all_msg   = new BinaryImport("msg",@locale)
  @all_other = new BinaryImport("other",@locale)



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
  @controls = new KeyboardController "title", 300

#-------------------------------------------------------------------

