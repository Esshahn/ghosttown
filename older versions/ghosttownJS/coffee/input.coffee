###
  
  input manager

###

# Keyboard input with customisable repeat (set to 0 for no key repeat)
#

KeyboardController = (keys, repeat) ->
  # Lookup of key codes to timer ID, or null for no repeat
  #
  timers = {}
  # When key is pressed and we don't already think it's pressed, call the
  # key action callback and set a timer to generate another one after a delay
  #

  document.onkeydown = (event) ->
    key = (event or window.event).keyCode
    if !(key of keys)
      return true
    if !(key of timers)
      timers[key] = null
      keys[key]()
      if repeat != 0
        timers[key] = setInterval(keys[key], repeat)
    false

  # Cancel timeout and mark key as released on keyup
  #

  document.onkeyup = (event) ->
    key = (event or window.event).keyCode
    if key of timers
      if timers[key] != null
        clearInterval timers[key]
      delete timers[key]
    return

  # When window is unfocused we may not get key events. To prevent this
  # causing a key to 'get stuck down', cancel all held keys
  #

  window.onblur = ->
    for key of timers
      if timers[key] != null
        clearInterval timers[key]
    timers = {}
    return

  return


KEY = 
    BACKSPACE: 8
    TAB:       9
    RETURN:   13
    ESC:      27
    SPACE:    32
    PAGEUP:   33
    PAGEDOWN: 34
    END:      35
    HOME:     36
    LEFT:     37
    UP:       38
    RIGHT:    39
    DOWN:     40
    INSERT:   45
    DELETE:   46
    ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57
    A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90
    TILDA:    192
 
