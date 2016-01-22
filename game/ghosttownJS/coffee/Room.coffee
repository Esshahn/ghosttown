###
  
  Room class
  contains all information about the room currently displayed

###

class Room

  constructor : ->

    @init()

#-------------------------------------------------------------------

  init : ->

    # init data for the game
    # we store everything that is related to one play round
    # here, so we can call it again later to reset the game

    @screen_data = []
    @room_number = 1
    @room_info
    
    # here we define the random game data for each round of the game
    # this is information specific to one play round e.g. the coffin number
    
    @playround_data = []

    # create copies of all data
    # so we can always start a new game by copying the original data into the playround
    @playround_data.all_lvl   = clone (all_lvl)
    @playround_data.all_msg   = clone (all_msg)
    @playround_data.all_other = clone (all_other)

    # choose random coffin number for room 5
    @playround_data.coffin_all = ["A","B","C","D","E","F","G","H"]
    @playround_data.coffin = @playround_data.coffin_all[ Math.floor( Math.random() * @playround_data.coffin_all.length )]
    @playround_data.coffin_hex = @playround_data.coffin.charCodeAt(0)-24 # turns ascii code into petscii code

    # belegro should be alive
    @playround_data.belegro_is_alive = true

#-------------------------------------------------------------------

  reset : (@room_number) ->
    # resets the screen data of the room
    @playround_data.all_lvl.screen_data[@room_number] = clone(all_lvl[@room_number])

#-------------------------------------------------------------------

  update : (position = player.get_position()) ->

    @screen_data = clone(@playround_data.all_lvl.screen_data[@room_number])

    @insert_player(position)
    @playround_data.gamestate = "game"
    display.show_data()

    # this makes sure animations are played
    # again when a message was shown before 
    # and animations stopped
    @playround_data.pauseInterval = false

    msg = 'Room ' + @room_number + ' "' + @room_info.name + '"'
    ui_room msg

#-------------------------------------------------------------------

  get : (room_number) ->
    # returns the current room data after it is processed
    @screen_data

#-------------------------------------------------------------------

  insert_player : (position = @room_info.playerpos1) ->
    @screen_data[position + 0*40 + 0] = "93"
    @screen_data[position + 0*40 + 1] = "94"
    @screen_data[position + 0*40 + 2] = "95"
    @screen_data[position + 1*40 + 0] = "96"
    @screen_data[position + 1*40 + 1] = "97"
    @screen_data[position + 1*40 + 2] = "98"
    @screen_data[position + 2*40 + 0] = "99"
    @screen_data[position + 2*40 + 1] = "9a"
    @screen_data[position + 2*40 + 2] = "9b"

#-------------------------------------------------------------------

  die : (deathID,msgID = 1) ->
    ui_log("You would have died by the <b>"+deathID+"</b>", "red")
    clearInterval @animation_interval
    @playround_data.gamestate = "die"
    display.show_death(msgID)

#-------------------------------------------------------------------

  msg : (msgID = 1, charset) ->
    @playround_data.pauseInterval = true
    @playround_data.gamestate = "msg"
    display.show_msg(msgID, charset)

#-------------------------------------------------------------------

  other : (msgID = 1, charset, color) ->
    display.show_other(msgID, charset, color)

#-------------------------------------------------------------------

  replace : (tile,tile_code) ->
    # replaces a tile by another
    # tile can be a position on screen (number, e.g. 297) or a tile code (string, e.g. "a9")
    # tile_code is the tile code that replaces the original tile

    tile = @find tile if typeof tile is "string"
    @playround_data.all_lvl.screen_data[@room_number][tile] = tile_code
    @update(player.get_position())

#-------------------------------------------------------------------

  find : (tile) ->
    # returns the first position (e.g. 294) of a give tile_code (e.g. "a9" on the screen)
    if tile in @screen_data
      @screen_data.indexOf(tile)

#-------------------------------------------------------------------

  get_tile_at : (tile) ->
    # returns the tile code at a given index position in the array
    @screen_data[tile]

#-------------------------------------------------------------------

  check_spacebar_event : ->
    # checks what the spacebar key should actually do
    # game states can be "die", "msg" and "game"
    # another dirty hack

    if @playround_data.gamestate is "msg"
      @update(player.get_position())

#-------------------------------------------------------------------

  check_codenumber_keys : (direction) ->

    if direction is KEY.LEFT
      # cursor left
      if @alphabet_pos > 441
        @playround_data.all_msg.screen_data[30][@alphabet_pos] = @screen_data_clone[@alphabet_pos]
        @alphabet_pos -= 1
        @trigger_alphabet = 1
      return

    if direction is KEY.RIGHT
      # cursor right
      if @alphabet_pos < 478
        @playround_data.all_msg.screen_data[30][@alphabet_pos] = @screen_data_clone[@alphabet_pos]
        @alphabet_pos += 1
        @trigger_alphabet = 1
      return

    if direction is KEY.SPACE
      # spacebar
      if @codenumber_pos < 397 and @alphabet_pos < 478
        @playround_data.all_msg.screen_data[30][@codenumber_pos] = @screen_data_clone[@alphabet_pos]   
        @codenumber_pos += 1
        @trigger_code = 1

        # if 5 characters are entered
        # check for the code number
        if @codenumber_pos is 397
          
          # store the numbers entered in the codenumber
          @codenumber = []
          i = 0
          while i<5            
            @codenumber[i] = @playround_data.all_msg.screen_data[30][392+i]
            i++

          # check if the code number 06138 is entered (hex 30 36 31 33 38)
          if @codenumber[0] is "30" and
          @codenumber[1] is "36" and
          @codenumber[2] is "31" and
          @codenumber[3] is "33" and
          @codenumber[4] is "38"

            # codenumber is correct
            clearInterval @animation_interval              
            # Arrow key movement
            controls.destroy()
            controls.init "game", 60
            @set(18)
            return            
          else
            # codenumber is wrong
            clearInterval @animation_interval           
            
            # the code number entered is put pack onto the error message
            i = 0
            while i<5            
              @playround_data.all_msg.screen_data[29][392+i] = @codenumber[i] 
              i++

            @msg(29)
            @playround_data.gamestate = "die"

      # go back one position if the back symbol "<" was selected
      if @alphabet_pos is 478 and @codenumber_pos > 392
        # going back one position with the cursor, restore the non-inverse char
        if @trigger_code isnt 1
          @playround_data.all_msg.screen_data[30][@codenumber_pos] = (parseInt("0x"+@playround_data.all_msg.screen_data[30][@codenumber_pos])-128).toString(16)
          @trigger_code = 1 
        @codenumber_pos -= 1
        return

#-------------------------------------------------------------------

  check_title_keys : ->
    if not @intro?
      @intro = true
      @other(2, charset_commodore_orange, COLOR_BLACK)
    else
      @intro = false
      controls.destroy()
      controls.init "game", 60
      @set(1)

#-------------------------------------------------------------------


  set : (@room_number,player_entry_pos = "forward") ->
    # changes the room
    # read in the given level from the all levels data
    # level_data is now the current worksheet to work with

    # stops all intervals when entering a room
    clearInterval @animation_interval

    # INIT FOR ROOMS
    # Some rooms need to be reset when entering (nails room, laser room)
    if @room_number in [10,11,14,15,16]
      @reset(@room_number)

    @screen_data = clone(@playround_data.all_lvl.screen_data[@room_number])

    @room_info = levels_config[@room_number]
    player.position = @room_info.playerpos1 if player_entry_pos == "forward"
    player.position = @room_info.playerpos2 if player_entry_pos == "back"

    @update(player.position)

#-------------------------------------------------------------------
#   INIT ROOM 10 - BORIS THE SPIDER
#-------------------------------------------------------------------
    
    if @room_number is 10
      @trigger = 0
      @animation_interval = setInterval((=>
        if @playround_data.pauseInterval isnt true
          @trigger++
          
          if @trigger < 6
            # spider should go down
            @replace_y = @trigger - 0

            # is the spider (left bottom or right bottom) hitting anything else than "df" (nothing)?
            if @screen_data[15+40*(@replace_y+2)] isnt "df" or
            @screen_data[17+40*(@replace_y+2)] isnt "df"
              clearInterval @animation_interval
              @die('boris the spider',26)
              return

          else
            # spider should go up
            @replace_y = 12 - @trigger

            # is the spider (left top or right top) hitting anything else than "df" (nothing)?
            if @screen_data[15+40*(@replace_y)] isnt "df" and
            @screen_data[15+40*(@replace_y)] isnt "e4" or
            @screen_data[17+40*(@replace_y)] isnt "df" and
            @screen_data[17+40*(@replace_y)] isnt "e6"
              clearInterval @animation_interval
              @die('boris the spider',26)
              return

          if @trigger < 7
            # the spider is going down?
            # then add the spider net on top
            @replace(15+40*(@replace_y+0),"df")
            @replace(16+40*(@replace_y+0),"ea")
            @replace(17+40*(@replace_y+0),"df")  
         
          @replace(15+40*(@replace_y+1),"e4")
          @replace(16+40*(@replace_y+1),"e5")
          @replace(17+40*(@replace_y+1),"e6")
          @replace(15+40*(@replace_y+2),"e7")
          @replace(16+40*(@replace_y+2),"e8")
          @replace(17+40*(@replace_y+2),"e9")
         
          if @trigger > 6
            # the spider is going up?
            # then clear the spider image at the bottom
            @replace(15+40*(@replace_y+3),"df")
            @replace(16+40*(@replace_y+3),"df")
            @replace(17+40*(@replace_y+3),"df")
           
          # is the spider animated completely? then restart 
          if @trigger is 11 then @trigger = 1
          
        ), 120)

#-------------------------------------------------------------------
#   INIT ROOM 11 - LASER FENCE
#-------------------------------------------------------------------
    
    if @room_number is 11

      # this room gets reset due to the fence animation
      # therefore we need to take track if the socket
      # has been picket up already and delete it
      if "socket" in player.inventory 
        @replace("cc","df")
        @replace("cd","df")
        @replace("ce","df")
        @replace("cf","df")

      @trigger = -1
      @animation_interval = setInterval((=>
        if @playround_data.pauseInterval isnt true
          @trigger = @trigger * -1
          
          if @trigger is 1
            # Shut the laser fence down
            @replace(379+0*40,"df") 
            @replace(379+1*40,"df")
            @replace(379+2*40,"df")
            @replace(379+3*40,"df")
            @replace(379+4*40,"df")
            @replace(379+5*40,"df")
            @playround_data.laser = off
          else
            # Activate the laser fence
            @replace(379+0*40,"d8")
            @replace(379+1*40,"d8")
            @replace(379+2*40,"d8")
            @replace(379+3*40,"d8")
            @replace(379+4*40,"d8")
            @replace(379+5*40,"d8")
            @playround_data.laser = on
          
          # checks if the laser is "on" and if the player is standing in the danger zone
          if @playround_data.laser is on and player.position in [377,378,379,417,418,419,457,458,459,497,498,499]
            clearInterval @animation_interval
            @die('laser',24)

        ), 482)

#-------------------------------------------------------------------
#   INIT ROOM 15 - TARPS
#-------------------------------------------------------------------
  
    if @room_number is 15
      if "bulb holder" not in player.inventory or
      "light bulb" not in player.inventory or
      "socket" not in player.inventory
        # make all traps invisible
        @replace("d7","ff") for [0...24]

#-------------------------------------------------------------------
#   INIT ROOM 16 - THE MONSTER
#-------------------------------------------------------------------
    
    if @room_number is 16
      @trigger = 0
      @animation_interval = setInterval((=>
        if @playround_data.pauseInterval isnt true
          if @trigger < 8
            # monster should go right
            @replace_x = @trigger 
          else
            # monster should go left
            @replace_x = 14 - @trigger

          # clear left side of monster
          @replace(484+@replace_x+40*0,"df")
          @replace(484+@replace_x+40*1,"df")
          @replace(484+@replace_x+40*2,"df")

          # monster
          @replace(485+@replace_x+40*0,"eb")
          @replace(485+1+@replace_x+40*0,"ec")
          @replace(485+2+@replace_x+40*0,"ed")

          @replace(485+@replace_x+40*1,"ee")
          @replace(485+1+@replace_x+40*1,"ef")
          @replace(485+2+@replace_x+40*1,"f0")

          @replace(485+@replace_x+40*2,"f1")
          @replace(485+1+@replace_x+40*2,"f2")
          @replace(485+2+@replace_x+40*2,"f3")

          # clear right side of monster
          if @screen_data[488+@replace_x] is "ed"
            @replace(488+@replace_x+40*0,"df")
            @replace(488+@replace_x+40*1,"df")
            @replace(488+@replace_x+40*2,"df")

          @trigger++ 

          # is the monster animated completely? then restart 
          if @trigger is 14 then @trigger = 0

          # collision check
          # first check for the right side of the monster
          # and compare with the left side of the player
          
          if @screen_data[488+@replace_x] is "93" or
          @screen_data[488+@replace_x] is "96" or
          @screen_data[488+@replace_x] is "99" or
          @screen_data[488+@replace_x+40*2] is "93" or
          @screen_data[488+@replace_x+40*2] is "96" or
          @screen_data[488+@replace_x+40*2] is "99" or
          
          # now for the left side of the monster
          # and compare with the right side of the player 
          
          @screen_data[485+@replace_x] is "95" or
          @screen_data[485+@replace_x] is "98" or
          @screen_data[485+@replace_x] is "9b" or
          @screen_data[485+@replace_x+40*2] is "95" or
          @screen_data[485+@replace_x+40*2] is "98" or
          @screen_data[485+@replace_x+40*2] is "9b"
            clearInterval @animation_interval
            @die("monster",25)
          
        ), 60)

#-------------------------------------------------------------------
#   INIT ROOM 18 - BELEGRO
#-------------------------------------------------------------------

    if @room_number is 18 and @playround_data.belegro_is_alive

      @playround_data.belegro_position = 615

      # clear belegro data if there is any
      # after reentering the room and belegro
      # wasnt killed
      @replace("9c","df")
      @replace("9d","df")
      @replace("9e","df")
      @replace("9f","df")
      @replace("a0","df")
      @replace("a1","df")
      @replace("a2","df")
      @replace("a3","df")
      @replace("a4","df")

      @animation_interval = setInterval((=>
        if @playround_data.pauseInterval isnt true

          # movement logic
          
          # get the x and y position of the player in the matrix
          @playround_data.player_x = player.get_position() % 40
          @playround_data.player_y = Math.round(player.get_position() / 40)
          
          # get the x and y position of belegro in the matrix
          @playround_data.belegro_x = @playround_data.belegro_position % 40
          @playround_data.belegro_y = Math.round(@playround_data.belegro_position / 40)

          @playround_data.belegro_temp_position = 0
          @playround_data.belegro_can_move = false

          # compare positions of player and belegro and make belegro move
          if @playround_data.belegro_x > @playround_data.player_x
              @playround_data.belegro_temp_position--

          if @playround_data.belegro_x < @playround_data.player_x 
              @playround_data.belegro_temp_position++

          if @playround_data.belegro_y > @playround_data.player_y
              @playround_data.belegro_temp_position-= 40

          if @playround_data.belegro_y < @playround_data.player_y 
              @playround_data.belegro_temp_position+= 40

          # belegro position up
          if @playround_data.belegro_temp_position is -40
            if @get_tile_at(@playround_data.belegro_position - 1*40 + 0) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1*40 + 1) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1*40 + 2) is "df" 
              @playround_data.belegro_can_move = true

          # belegro postion up right
          if @playround_data.belegro_temp_position is -39
            if @get_tile_at(@playround_data.belegro_position - 1*40 + 1) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1*40 + 2) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1*40 + 3) is "df" and
            @get_tile_at(@playround_data.belegro_position + 0*40 + 3) is "df" and 
            @get_tile_at(@playround_data.belegro_position + 1*40 + 3) is "df" 
              @playround_data.belegro_can_move = true

          # belegro position right
          if @playround_data.belegro_temp_position is 1
            if @get_tile_at(@playround_data.belegro_position + 3) is "df" and
            @get_tile_at(@playround_data.belegro_position + 3 + 1*40) is "df" and
            @get_tile_at(@playround_data.belegro_position + 3 + 2*40) is "df"
              @playround_data.belegro_can_move = true

          # belegro position right down todo
          if @playround_data.belegro_temp_position is 41
            if @get_tile_at(@playround_data.belegro_position + 3 + 1*40) is "df" and
            @get_tile_at(@playround_data.belegro_position + 3 + 2*40) is "df" and
            @get_tile_at(@playround_data.belegro_position + 3*40 + 1) is "df" and
            @get_tile_at(@playround_data.belegro_position + 3*40 + 2) is "df" 
              @playround_data.belegro_can_move = true

          # belegro position down
          if @playround_data.belegro_temp_position is 40
            if @get_tile_at(@playround_data.belegro_position + 3*40 + 0) is "df" and
            @get_tile_at(@playround_data.belegro_position + 3*40 + 1) is "df" and
            @get_tile_at(@playround_data.belegro_position + 3*40 + 2) is "df" 
              @playround_data.belegro_can_move = true

          # belegro postion down left
          if @playround_data.belegro_temp_position is 39
            if @get_tile_at(@playround_data.belegro_position + 3*40 + 0) is "df" and
            @get_tile_at(@playround_data.belegro_position + 3*40 + 1) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1 + 1*40) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1 + 2*40) is "df"
              @playround_data.belegro_can_move = true

          # belegro position left
          if @playround_data.belegro_temp_position is -1
            if @get_tile_at(@playround_data.belegro_position - 1 + 0*40) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1 + 1*40) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1 + 2*40) is "df"
              @playround_data.belegro_can_move = true

          # belegro position left up
          if @playround_data.belegro_temp_position is -41
            if @get_tile_at(@playround_data.belegro_position - 1 + 0*40) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1 + 1*40) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1*40 + 0) is "df" and
            @get_tile_at(@playround_data.belegro_position - 1*40 + 1) is "df"
              @playround_data.belegro_can_move = true

          if @playround_data.belegro_can_move
            @playround_data.belegro_new_position = @playround_data.belegro_position + @playround_data.belegro_temp_position
          
            # has belegro moved? then first clear his old position
            @replace(@playround_data.belegro_position + 0 + 0*40,"df")
            @replace(@playround_data.belegro_position + 1 + 0*40,"df")
            @replace(@playround_data.belegro_position + 2 + 0*40,"df")
            @replace(@playround_data.belegro_position + 0 + 1*40,"df")
            @replace(@playround_data.belegro_position + 1 + 1*40,"df")
            @replace(@playround_data.belegro_position + 2 + 1*40,"df")
            @replace(@playround_data.belegro_position + 0 + 2*40,"df")
            @replace(@playround_data.belegro_position + 1 + 2*40,"df")
            @replace(@playround_data.belegro_position + 2 + 2*40,"df")
            
            # place Belegro
            # 9c 9d 9e
            # 9f a0 a1
            # a2 a3 a4
            @replace(@playround_data.belegro_new_position + 0 + 0*40,"9c")
            @replace(@playround_data.belegro_new_position + 1 + 0*40,"9d")
            @replace(@playround_data.belegro_new_position + 2 + 0*40,"9e")
            @replace(@playround_data.belegro_new_position + 0 + 1*40,"9f")
            @replace(@playround_data.belegro_new_position + 1 + 1*40,"a0")
            @replace(@playround_data.belegro_new_position + 2 + 1*40,"a1")
            @replace(@playround_data.belegro_new_position + 0 + 2*40,"a2")
            @replace(@playround_data.belegro_new_position + 1 + 2*40,"a3")
            @replace(@playround_data.belegro_new_position + 2 + 2*40,"a4")
    
            @playround_data.belegro_position = @playround_data.belegro_new_position

          # collision check
          if Math.abs(@playround_data.belegro_x - @playround_data.player_x) in [0,1,2,3] and
          Math.abs(@playround_data.belegro_y - @playround_data.player_y) in [0,1,2,3]
            if "sword" in player.inventory
              clearInterval @animation_interval
              @playround_data.belegro_is_alive = false
              ui_log("You killed Belegro!","green")
            else
              @die("belegro",27)
          
        ), 110)



#-------------------------------------------------------------------

  check_room : (direction) ->
    # we take a look at the position the player wants to go to and return true or the tile code

    new_position = []

    # step 1: read in the 4 tiles that the player wants to move to
    if direction == KEY.LEFT
      new_position = [ @screen_data[player.position + 0*40 -1] , @screen_data[player.position + 1*40 -1] , @screen_data[player.position + 2*40 -1] ]
    if direction == KEY.RIGHT
      new_position = [ @screen_data[player.position + 0*40 +3] , @screen_data[player.position + 1*40 +3] , @screen_data[player.position + 2*40 +3] ]
    if direction == KEY.UP
      new_position = [ @screen_data[player.position - 1*40 +0] , @screen_data[player.position - 1*40 +1] , @screen_data[player.position - 1*40 +2] ]
    if direction == KEY.DOWN
      new_position = [ @screen_data[player.position + 3*40 +0] , @screen_data[player.position + 3*40 +1] , @screen_data[player.position + 3*40 +2] ]


#-------------------------------------------------------------------
#   ROOM 1 - START
#-------------------------------------------------------------------

    if @room_number is 1
      
      # GLOVES
      if "a9" in new_position 
        if "ladder" in player.inventory
          player.remove("ladder")
          player.add("gloves")          
          @replace("a9","6b")
        
#-------------------------------------------------------------------
#   ROOM 2 - WIRECUTTER
#-------------------------------------------------------------------

    if @room_number is 2

      # KEY
      if "e0" in new_position or "e1" in new_position
        player.add("key")
        @replace("e0","aa")
        @replace("e1","ab")
        # remove the key after 0.2 seconds again
        setTimeout( =>
          @replace("aa","df")
          @replace("ab","df")
        ,200)


      # WIRECUTTER
      if (("ac" and "ad" in new_position) or ("ad" and "af" in new_position))
        if "gloves" in player.inventory
          player.remove("gloves")
          player.add("wirecutter")          
          @replace("ad","29")
          @replace("af","2c")
          @replace("ac","28")
          @replace("ae","2b")
        else
          @die("wirecutter",1)

      # QUESTION MARK
      if "1e" in new_position or "1f" in new_position or "20" in new_position or "21" in new_position or "24" in new_position or "25" in new_position or "26" in new_position
        @msg(2)


#-------------------------------------------------------------------
#   ROOM 3 - THE LADDER
#-------------------------------------------------------------------

    if @room_number is 3
      
      # LOCK TO THE LADDER
      if "a6" in new_position and "key" in player.inventory
        player.remove("key")
        @replace(723,"df")
        @replace(724,"df")
        @replace(725,"df")
        @replace(726,"df")

      # LADDER
      if "b0" in new_position and "b1" in new_position
        player.add("ladder")        
        @replace(804,"df")
        @replace(805,"df")
        @replace(804+40,"df")
        @replace(805+40,"df")
        @replace(804+80,"df")
        @replace(805+80,"df")

      # FENCE
      if "f5" in new_position 
        if "wirecutter" in player.inventory
          player.remove("wirecutter")
          @replace(493,"df")
          @replace(493+1*40,"df")
          @replace(493+2*40,"df")
          @replace(493+3*40,"df")
          @replace(493+4*40,"df")
          @replace(493+5*40,"df")
          @replace(493+6*40,"df")
          @replace(493+7*40,"df")
          @replace(493+8*40,"df")
          @replace(493+9*40,"df")
          @replace(493+10*40,"df")
          @replace(493+11*40,"df")
        else
          @die("fence",3)


      # POISON BOTTLE
      if "b9" in new_position and "bb" in new_position 
        if "hammer" in player.inventory
          player.add("treasure key")
          @msg(9)
        else
          @die("poison",4)

#-------------------------------------------------------------------
#   ROOM 4 - SPIRAL
#-------------------------------------------------------------------

    if @room_number is 4
   
      # QUESTION MARK
      if "1e" in new_position or "1f" in new_position or "20" in new_position or "21" in new_position or "24" in new_position or "25" in new_position or "26" in new_position
        # we replace the code char in the message binary with the
        # random new char (A to H) we generated in the constructor
        # it's a bit ugly as it happens every time, but we shouldn't give a fuck
        @playround_data.all_msg.screen_data[5][470] = @playround_data.coffin_hex
        @msg(5)
        

#-------------------------------------------------------------------
#   ROOM 5 - CEMETRY
#-------------------------------------------------------------------

    if @room_number is 5

      # COFFINS
      if "3b" in new_position or "42" in new_position
        # check if the player stands in front of the right coffin
        if (player.position is 123 and @playround_data.coffin is "A") or
        (player.position is 363 and @playround_data.coffin is "B") or
        (player.position is 603 and @playround_data.coffin is "C") or
        (player.position is 843 and @playround_data.coffin is "D") or
        (player.position is 153 and @playround_data.coffin is "E") or
        (player.position is 393 and @playround_data.coffin is "F") or
        (player.position is 633 and @playround_data.coffin is "G") or
        (player.position is 873 and @playround_data.coffin is "H")
          @msg(12)
          player.add("coffin key")
        else
          @die("zombie",13)

      # DOOR to next room
      if "f6" in new_position and "06" in new_position and "09" in new_position
        if "coffin key" in player.inventory
          @set(@room_number + 1,"forward")


#-------------------------------------------------------------------
#   ROOM 6 
#-------------------------------------------------------------------

    if @room_number is 6

      # BREATHING TUBE
      if "fd" in new_position
        if "spade" in player.inventory
          player.remove("spade")
          player.add("breathing tube")
          @msg(10)

      # QUESTION MARK
      if "1e" in new_position or "1f" in new_position or "20" in new_position or "21" in new_position or "22" in new_position or "23" in new_position or "24" in new_position or "25" in new_position or "26" in new_position
        @msg(11)

#-------------------------------------------------------------------
#   ROOM 7 - FOUR DOORS
#-------------------------------------------------------------------

    if @room_number is 7
        
      # DEADLY DOORS    
      if "f6" in new_position and "06" in new_position and "09" in new_position
        @die("snake pit",6)

#-------------------------------------------------------------------
#   ROOM 8 - SACRED COLUMN
#-------------------------------------------------------------------

    if @room_number is 8
        
      # DEADLY DOORS    
      if "e3" in new_position  
        @die("sacred column",7)

      # BULB HOLDER
      if "e0" in new_position
        player.add("bulb holder")
        @replace(721,"bc")
        @replace(722,"bd")
        @replace(721+40,"be")
        @replace(722+40,"bf")
        # remove the bulb holder after 1 second again
        setTimeout( =>
          @replace("bc","df")
          @replace("bd","df")
          @replace("be","df")
          @replace("bf","df")
        ,1000)

#-------------------------------------------------------------------
#   ROOM 9 - SPADE
#-------------------------------------------------------------------

    if @room_number is 9
       
      # SPADE 
      if "c1" in new_position or "c5" in new_position
        player.add("spade")          
        @replace("c0","df")
        @replace("c1","df")
        @replace("c2","df")
        @replace("c3","df")
        @replace("c4","df")
        @replace("c5","df")

      # WATER LEFT
      if "4b" in new_position
        if "breathing tube" in player.inventory
          # TODO
          # SMALL BUG IN ORIGINAL GAME
          # if the player enters and crosses the river for the first time
          # his position is 504 and not 505
          player.position = 505
          @update(player.get_position())
        else
          @die("water",8)

      # WATER RIGHT
      if "59" in new_position
        if "breathing tube" in player.inventory
          player.position = 492
          @update(player.get_position())
        else
          @die("water",8)

      # VASE WITH BOOTS 
      if "c6" in new_position or "c7" in new_position or "c8" in new_position or "c9" in new_position or "ca" in new_position or "cb" in new_position
        if "hammer" in player.inventory
          player.add("boots")          
          @replace("c6","df")
          @replace("c7","df")
          @replace("c8","df")
          @replace("c9","df")
          @replace("ca","df")
          @replace("cb","df")

#-------------------------------------------------------------------
#   ROOM 10 
#-------------------------------------------------------------------

    if @room_number is 10

      # BORIS THE SPIDER
      # The script for the spider is an interval script
      # defined in the "set" method above
      if "e4" in new_position or
      "e5" in new_position or
      "e6" in new_position or
      "e7" in new_position or
      "e8" in new_position or
      "e9" in new_position or
      "ea" in new_position
        clearInterval @animation_interval
        @die('boris the spider',26)

      # QUESTION MARK
      if "1e" in new_position or 
      "1f" in new_position or 
      "20" in new_position or 
      "21" in new_position or 
      "22" in new_position or 
      "23" in new_position or 
      "24" in new_position or 
      "25" in new_position or 
      "26" in new_position
        @msg(14)
      
#-------------------------------------------------------------------
#   ROOM 11 - LASER FENCE
#-------------------------------------------------------------------

    if @room_number is 11

      # QUESTION MARK
      if "1e" in new_position or 
      "1f" in new_position or 
      "20" in new_position or 
      "21" in new_position or 
      "22" in new_position or 
      "23" in new_position or 
      "24" in new_position or 
      "25" in new_position or 
      "26" in new_position
        @msg(15)


      # LASER
      # The script for the laser is an interval script
      # defined in the "set" method above
      if "d8" in new_position
          clearInterval @animation_interval
          @die('laser',24)

        
      # SOCKET
      if "cc" in new_position or 
      "cd" in new_position or 
      "ce" in new_position or
      "cf" in new_position
        if "light bulb" in player.inventory and "bulb holder" in player.inventory
          player.add("socket")
          @replace("cc","df")
          @replace("cd","df")
          @replace("ce","df")
          @replace("cf","df")
        else
          @die("220 volts",22)
  
#-------------------------------------------------------------------
#   ROOM 12 
#-------------------------------------------------------------------

    if @room_number is 12

      # HAMMER
      if "d0" in new_position and "d1" in new_position
        @replace("d0","df")
        @replace("d1","df")
        player.add("hammer")
    
#-------------------------------------------------------------------
#   ROOM 13 
#-------------------------------------------------------------------

    if @room_number is 13

      # QUESTION MARK
      if "1e" in new_position or 
      "1f" in new_position or 
      "20" in new_position or 
      "21" in new_position or 
      "22" in new_position or 
      "23" in new_position or 
      "24" in new_position or 
      "25" in new_position or 
      "26" in new_position
        @msg(16)


      # LIGHT BULB
      if "d2" in new_position or 
      "d3" in new_position or 
      "d5" in new_position 
        player.add("light bulb")
        @replace("d2","df")
        @replace("d3","df")
        @replace("d4","df")
        @replace("d5","df")
    
#-------------------------------------------------------------------
#   ROOM 14 
#-------------------------------------------------------------------

    if @room_number is 14

      # NAILS
      if "d6" in new_position
        if "boots" in player.inventory
          if direction is KEY.DOWN
            @replace(player.position+120,"df")
            @replace(player.position+121,"df")
            @replace(player.position+122,"df")
            player.set_position(KEY.DOWN)

          if direction is KEY.LEFT
            @replace(player.position-1,"df")
            @replace(player.position-1+40,"df")
            @replace(player.position-1+80,"df")
            player.set_position(KEY.LEFT)

          if direction is KEY.RIGHT
            @replace(player.position+3,"df")
            @replace(player.position+3+40,"df")
            @replace(player.position+3+80,"df")
            player.set_position(KEY.RIGHT)

          if direction is KEY.UP
            @replace(player.position-40,"df")
            @replace(player.position+1-40,"df")
            @replace(player.position+2-40,"df")
            player.set_position(KEY.UP)

        else
          @die("nails",23)
        

      # QUESTION MARK
      if "1e" in new_position or 
      "1f" in new_position or 
      "20" in new_position or 
      "21" in new_position or 
      "22" in new_position or 
      "23" in new_position or 
      "24" in new_position or 
      "25" in new_position or 
      "26" in new_position
        @msg(17)
    
#-------------------------------------------------------------------
#   ROOM 15 
#-------------------------------------------------------------------

    if @room_number is 15

      # FOOT TRAP
      if "d7" in new_position or "ff" in new_position
        @die('foot trap',18)
    
#-------------------------------------------------------------------
#   ROOM 16 
#-------------------------------------------------------------------

    if @room_number is 16

      # MONSTER
      # The script for the monster is an interval script
      # defined in the "set" method above
      if "eb" in new_position or
      "ec" in new_position or
      "ed" in new_position or
      "ee" in new_position or
      "ef" in new_position or
      "f0" in new_position or
      "f1" in new_position or
      "f2" in new_position or
      "f3" in new_position 
        clearInterval @animation_interval
        @die('monster',25)

      # QUESTION MARK
      if "1e" in new_position or 
      "1f" in new_position or 
      "20" in new_position or 
      "21" in new_position or 
      "22" in new_position or 
      "23" in new_position or 
      "24" in new_position or 
      "25" in new_position or 
      "26" in new_position
        @msg(19)
    
#-------------------------------------------------------------------
#   ROOM 17 
#-------------------------------------------------------------------

    if @room_number is 17 

      # BOTTLE 
      if "bb" in new_position or "b9" in new_position

        # init        
        
        # copy the screen data for restoring the alphabet when the cursor moves
        # and if @screen_data_clone is already set (meaning the player was on the code screen
        # before and entered the code right), reset the all_msg so no old code is visible
        if @screen_data_clone?
          console.log("reenter")
          @playround_data.all_msg.screen_data[30] = clone (@screen_data_clone)
        else
          @screen_data_clone = clone (@playround_data.all_msg.screen_data[30])

        @trigger_alphabet = 1
        @trigger_code = 1
        @alphabet_pos   = 441
        @codenumber_pos = 392
        
        # set the animation of the characters
        @animation_interval = setInterval((=>
          @trigger_alphabet = @trigger_alphabet * -1
          @trigger_code = @trigger_code * -1
          @current_alphabet = @playround_data.all_msg.screen_data[30][@alphabet_pos]
          @current_code     = @playround_data.all_msg.screen_data[30][@codenumber_pos]

          if @trigger_alphabet is 1
            @playround_data.all_msg.screen_data[30][@alphabet_pos]   = (parseInt("0x"+@current_alphabet)-128).toString(16)
          else
            @playround_data.all_msg.screen_data[30][@alphabet_pos]   = (parseInt("0x"+@current_alphabet)+128).toString(16)

          if @trigger_code is 1
            @playround_data.all_msg.screen_data[30][@codenumber_pos] = (parseInt("0x"+@current_code)-128).toString(16)
          else
            @playround_data.all_msg.screen_data[30][@codenumber_pos] = (parseInt("0x"+@current_code)+128).toString(16)


          @msg(30,charset_commodore_green)  

        ), 80) 

        # setup the key controls for the code number
        controls.destroy()
        controls.init "codenumber", 80

      # LEFT PRISON CELL
      if "f4" in new_position
        @die('starving',21)   

      # RIGHT PRISON CELL
      if "d9" in new_position or "da" in new_position or "db" in new_position or "dc" in new_position
        @die('wizard',20)  

#-------------------------------------------------------------------
#   ROOM 18 
#-------------------------------------------------------------------

    if @room_number is 18

      # BOULDER
      # has the player reached the criticial position 
      # when the boulder should start moving?
      if player.position is 264
        # and the boulder hasn't been moving before and belegro is dead
        if @screen_data[270] is "78" and not @playround_data.belegro_is_alive
          @trigger = 0
          @animation_interval = setInterval((=>
            
            if @playround_data.pauseInterval isnt true
              
              @trigger++
              
              # move the boulder
              # top row
              @replace(270+0*40-@trigger,"78") 
              @replace(271+0*40-@trigger,"79")
              @replace(272+0*40-@trigger,"7a")
              @replace(273+0*40-@trigger,"df")

              # middle row
              @replace(270+1*40-@trigger,"7b") 
              @replace(271+1*40-@trigger,"7c")
              @replace(272+1*40-@trigger,"7d")
              @replace(273+1*40-@trigger,"df")

              # bottom row
              @replace(270+2*40-@trigger,"7e") 
              @replace(271+2*40-@trigger,"7f")
              @replace(272+2*40-@trigger,"80")
              @replace(273+2*40-@trigger,"df")

              if @trigger > 26
                clearInterval @animation_interval  

              # get the x and y position of the player in the matrix
              @playround_data.player_x = player.get_position() % 40
              @playround_data.player_y = Math.round(player.get_position() / 40)
              
              # get the x and y position of the boulder in the matrix
              @playround_data.boulder_x = (270 - @trigger) % 40
              @playround_data.boulder_y = Math.round((270 - @trigger) / 40)

              # collision check
              if Math.abs(@playround_data.boulder_x - @playround_data.player_x) in [0,1,2] and
              Math.abs(@playround_data.boulder_y - @playround_data.player_y) in [0,1,2]
                @die("boulder",28)                          
          ), 60)


      # BELEGRO
      # The script for belegro is an interval script
      # defined in the "set" method above


      # SWORD
      if "dd" in new_position or "de" in new_position
        @replace("dd","df")
        @replace("de","df")
        player.add("sword")

#-------------------------------------------------------------------
#   ROOM 19 
#-------------------------------------------------------------------

    if @room_number is 19
      
      # TREASURE CHEST
      if "treasure key" in player.inventory
        if "81" in new_position or 
        "84" in new_position or 
        "87" in new_position or
        "82" in new_position or 
        "83" in new_position or
        "8a" in new_position or
        "8b" in new_position or
        "8c" in new_position or
        "8f" in new_position or
        "92" in new_position
          @other(3)

#-------------------------------------------------------------------
#   DOORS
#-------------------------------------------------------------------

    # DOOR to previous room
    if "05" in new_position and "08" in new_position and "0b" in new_position and @room_number isnt 1
      new_room = @room_number - 1
      @set(new_room,"back")

    # DOOR to next room
    if "03" in new_position and "06" in new_position and "09" in new_position
      new_room = @room_number + 1
      @set(new_room,"forward")

#-------------------------------------------------------------------
#   EMPTY WAY
#-------------------------------------------------------------------

    # are they all empty ("df" == empty)? then return true
    # player will move in that direction then
    return true if new_position[0] == "df" && new_position[1] == "df" && new_position[2] == "df"

#-------------------------------------------------------------------
#   FINISH
#-------------------------------------------------------------------
     
    ui_room("Tiles: " + new_position[0] + " | "+ new_position[1] + " | "+ new_position[2])
    false


    
