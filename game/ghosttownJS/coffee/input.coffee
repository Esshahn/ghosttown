###
  
  KeyboardController 
  Keyboard input with customisable repeat (set to 0 for no key repeat)

###


class KeyboardController 

  constructor : ->

    # Lookup of key codes to timer ID, or null for no repeat
    @timers = {}

  destroy : ->
    # destroys all intervals setup earlier
    # so that new keyboard controls can be assigned
    for key of @timers
      if @timers[key] != null
        clearInterval @timers[key]
    @timers = {}
    return

  init : (@keyset, @repeat) ->
  # When key is pressed and we don't already think it's pressed, call the
  # key action callback and set a timer to generate another one after a delay

    @destroy()

    if @keyset is "game"
      @keys = 
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
      32: ->
        room.check_spacebar_event()
        return

    if @keyset is "codenumber"
      @keys =
      37: ->
        room.check_codenumber_keys(37)
        return
      39: ->
        room.check_codenumber_keys(39)
        return
      32: ->
        room.check_codenumber_keys(32)
        return

    if @keyset is "title"
      @keys =
      32: ->
        room.check_title_keys()
        return
      49: ->
        room.check_title_keys()
        return

    if @keyset is "win"
      @keys =
      32: ->
        room.check_win_keys()
        return

    if @keyset is "kingsoft"
      @keys =
      65: ->
        # A
        # load german game
        init_lang("de")
        return
      66: ->
        # B
        # load english game
        init_lang("en")
        return
      67: ->
        # C
        # load credits
        load_menu.step12()
        return

    if @keyset is "credits"
      @keys =
      32: ->
        # SPACE
        # load kingsoft menu
        load_menu.step11()
        return

    document.onkeydown = (event) =>
      key = (event or window.event).keyCode   
      if !(key of @keys)
        return true
      if !(key of @timers)
        @timers[key] = null
        @keys[key]()
        if @repeat != 0
          @timers[key] = setInterval(@keys[key], @repeat)
      false

    # Cancel timeout and mark key as released on keyup

    document.onkeyup = (event) =>
      key = (event or window.event).keyCode
      if key of @timers
        if @timers[key] != null
          clearInterval @timers[key]        
        delete @timers[key]
      return

    # When window is unfocused we may not get key events. To prevent this
    # causing a key to 'get stuck down', cancel all held keys

    window.onblur = ->
      for key of @timers
        if @timers[key] != null
          clearInterval @timers[key]
      @timers = {}
      return









 
