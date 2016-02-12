
#-------------------------------------------------------------------
# C16 Loader Class
# 
# Shows animations before the game starts:
#   1. basic screen
#   2. load sequence
#   3. kingsoft menu
#   4. credits screen
#-------------------------------------------------------------------


class C16Loader

  constructor : ->

    @image_kingsoft = new PIXI.Sprite.fromImage('img/kingsoft.png')
    @image_credits  = new PIXI.Sprite.fromImage('img/credits.png')
    @image_boot     = new PIXI.Sprite.fromImage('img/boot.png')
    
    @display_boot()
    @cover_screen 5, 25
    @reveal_line 5, 8, 100, true, =>
      @display_kingsoft()
 
    @cursor = new Cursor()
    
  cover_screen : (@start, @end, @color = COLOR_BOOT_GREY) ->
    # covers the screen 
    @empty_line = []

    i = @start
    while i < @end
      @empty_line[i] = new (PIXI.Graphics)
      @empty_line[i].beginFill(@color)
      @empty_line[i].drawRect 0, 0, 320 , 8
      @empty_line[i].endFill()
      @empty_line[i].position.y = i*8
      display.addElement(@empty_line[i])      
      i++

  reveal_line : (@line, @amountOfCharacters = 40, @speed = 100, @showCursor = true, callback) ->
    # reveals a line
    # line = the line to reveal (that was covered before)
    # amountOfCharacters = how many characters to show (nothing = whole line)
    # speed = milliseconds
    # showCursor = showCursor or not
    

    @line_interval = setInterval((=>
      if @empty_line[@line].position.x / 8 < @amountOfCharacters
        console.log @empty_line[@line].position.x
        @empty_line[@line].position.x+=8
        @cursor.set_position((@empty_line[@line].position.x)/8 , @line) if @showCursor
      else
        clearInterval @line_interval
        console.log callback
        callback()
      ), 100)


  display_kingsoft : ->
    console.log @
    display.change_screen_colors "full", COLOR_BLUE, COLOR_BLUE
    display.clear()
    display.addElement(@image_kingsoft)

  display_credits : ->

    display.change_screen_colors "full", COLOR_BLACK, COLOR_BLACK
    display.clear()
    display.addElement(@image_credits)

  display_boot : ->

    display.change_screen_colors "full", COLOR_BOOT_PURPLE, COLOR_BOOT_GREY
    display.clear()
    display.addElement(@image_boot)


#-------------------------------------------------------------------

class Cursor

  #-------------------------------------------------------------------
  #   generates and moves the cursor on screen
  #-------------------------------------------------------------------

  constructor : ->

    @position_x = 0
    @position_y = 5

    @cursor = new (PIXI.Graphics)
    @cursor.beginFill(COLOR_BLACK)
    @cursor.drawRect 0, 0, 8 , 8
    @cursor.endFill()

    @cursor.position.x = @position_x * 8
    @cursor.position.y = @position_y * 8
    @cursor_interval = setInterval((=>
      @cursor.visible = 1 - @cursor.visible
      ), 322)
    display.addElement(@cursor)

  set_position : (x,y) ->

    @cursor.position.x = x * 8
    @cursor.position.y = y * 8

  destroy_cursor : ->

    clearInterval @cursor_interval 
    display.removeElement(@cursor) 

    


