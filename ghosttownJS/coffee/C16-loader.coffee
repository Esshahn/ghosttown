



class C16Loader

#-------------------------------------------------------------------
# C16 Loader Class
# 
# Shows animations before the game starts:
#   1. basic screen
#   2. load sequence
#   3. kingsoft menu
#   4. credits screen
#-------------------------------------------------------------------

  constructor : ->

    @image_kingsoft = new PIXI.Sprite.fromImage('img/kingsoft.png')
    @image_credits  = new PIXI.Sprite.fromImage('img/credits.png')
    @image_boot     = new PIXI.Sprite.fromImage('img/boot.png')
    @image_loading  = new PIXI.Sprite.fromImage('img/loading.png')
    @image_presents = new PIXI.Sprite.fromImage('img/presents.png')
    
    @display_boot()
    @cover_screen 5, 25
    @cursor = new Cursor()
    @step0()

#-------------------------------------------------------------------

  step0 : ->
    @wait 1000 , => 
      @step1()

  step1 : ->
    # DLOAD"*""
    @reveal_line 5, 8, 240, true, =>
      @step2()

  step2 : ->
    @cursor.hide()
    @wait 500 , => 
      @step3()

  step3 : ->
    # SEARCHING FOR *:0
    @reveal_line 7, 40, 0, false, =>
      @step4()

  step4 : ->
    @wait 2000 , =>
      @step5()

  step5 : ->
    # LOADING
    @reveal_line 8, 40, 0, false, =>
      @step6()

  step6 : ->
    @wait 4000 , =>
      @step7()

  step7 : ->
    # READY
    @reveal_line 9, 40, 0, false, =>
      @step8()

  step8 : =>
    @cursor.show()
    @cursor.set_position(0,10)
    @wait 1000 , =>
      @step9()

  step9 : ->
    # RUN
    @reveal_line 10, 3, 500, true, =>
      @step10()

  step10 : ->
    @cursor.destroy()
    @wait 1000 , =>
      @step11()

  step11 : ->
    # display the kingsoft screen
    # the jump to the next step is handled in the input file
    @display_kingsoft()
    controls.init "kingsoft", 300

  step12 : ->
    # the jump to the next step is handled in the input file
    @display_credits()
    controls.init "credits", 300

  step13 : (@lang) ->
    @display_loading()
    @wait 1000 , =>
      @step14(@lang)

  step14 : (@lang) ->
    # the jump to the next step is handled in the input file
    @display_presents()
    @wait 3000 , =>
      init_lang(@lang)

#-------------------------------------------------------------------

  wait : (@milliseconds, callback) ->  
    setTimeout( =>      
      callback()     
    ,@milliseconds)

#------------------------------------------------------------------- 

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

#-------------------------------------------------------------------

  reveal_line : (@line, @amountOfCharacters = 40, @speed = 100, @showCursor = true, callback) ->
    # reveals a line
    # line = the line to reveal (that was covered before)
    # amountOfCharacters = how many characters to show (nothing = whole line)
    # speed = milliseconds
    # showCursor = showCursor or not
    
    if @speed > 0
      @line_interval = setInterval((=>
        if @empty_line[@line].position.x / 8 < @amountOfCharacters
          @empty_line[@line].position.x+=8
          @cursor.set_position((@empty_line[@line].position.x)/8 , @line) if @showCursor
        else
          clearInterval @line_interval
          callback()
        ), @speed)
    else
      @empty_line[@line].position.x=320
      callback()

#-------------------------------------------------------------------

  reveal_screen : (@speed) ->
    i=0
    @screen_interval = setInterval((=>
      if i < 25
        display.removeElement @empty_line[i]
        i++
      else
        clearInterval @screen_interval
      ), @speed)

#-------------------------------------------------------------------

  display_kingsoft : ->
    display.change_screen_colors "full", COLOR_BLUE, COLOR_BLUE
    display.clear()
    display.addElement(@image_kingsoft)
    @cover_screen 0, 25, COLOR_BLUE
    @reveal_screen 20

#-------------------------------------------------------------------

  display_credits : ->
    display.change_screen_colors "full", COLOR_BLACK, COLOR_BLACK
    display.clear()
    display.addElement(@image_credits)
    @cover_screen 0, 25, COLOR_BLACK
    @reveal_screen 60

#-------------------------------------------------------------------

  display_boot : ->
    display.change_screen_colors "full", COLOR_BOOT_PURPLE, COLOR_BOOT_GREY
    display.clear()
    display.addElement(@image_boot)


#-------------------------------------------------------------------

  display_loading : ->
    display.change_screen_colors "full", COLOR_BOOT_PURPLE, COLOR_BOOT_GREY
    display.clear()
    display.addElement(@image_loading)
    @cover_screen 0, 25, COLOR_BOOT_GREY
    @reveal_screen 30

#-------------------------------------------------------------------

  display_presents : ->
    display.change_screen_colors "full", COLOR_BLACK, COLOR_BLACK
    display.clear()
    display.addElement(@image_presents)
    @cover_screen 0, 25, COLOR_BLACK
    @reveal_screen 30


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

  #-------------------------------------------------------------------
  
  set_position : (x,y) ->

    @cursor.position.x = x * 8
    @cursor.position.y = y * 8

  #-------------------------------------------------------------------
  
  destroy : ->
    clearInterval @cursor_interval 
    display.removeElement(@cursor) 

  #-------------------------------------------------------------------
  
  hide : ->
    @cursor.visible = 0
    clearInterval @cursor_interval

  #-------------------------------------------------------------------
  
  show : ->
    @cursor.visible = 1
    @cursor_interval = setInterval((=>
      @cursor.visible = 1 - @cursor.visible
      ), 322)
    


