###
  
  Room class
  contains all information about the room currently displayed

###

class Room

  constructor : ->

    @screen_data = []
    @room_number = 1
    @room_info
    @room_updated_tiles = []
    
    # here we define the random game data for each round of the game
    # this is information specific to one play round e.g. the coffin number
    # it might not be the best place to define this, needs rethinking
    
    @playround_data = []

    # choose random coffin number for room 5
    @playround_data.coffin_all = ["A","B","C","D","E","F","G","H"]
    @playround_data.coffin = @playround_data.coffin_all[ Math.floor( Math.random() * @playround_data.coffin_all.length )]
    @playround_data.coffin_hex = @playround_data.coffin.charCodeAt(0)-24 # turns ascii code into petscii code

#-------------------------------------------------------------------

  reset : (@room_number) ->
    # resets the screen data of the room

    all_lvl.screen_data[@room_number] = clone(all_lvl.screen_data_copy[@room_number])

#-------------------------------------------------------------------

  set : (@room_number,player_entry_pos = "forward") ->
  	# changes the room
  	# read in the given level from the all levels data
    # level_data is now the current worksheet to work with

    # stops all intervals when entering a room
    clearInterval @animation_interval

    # INIT FOR ROOMS
    # Some rooms need to be reset when entering (nails room, laser room)
    if @room_number in [11,14,15]
      @reset(@room_number)


    @screen_data = clone(all_lvl.screen_data[@room_number])

    @room_info = levels_config[@room_number]
    player.position = @room_info.playerpos1 if player_entry_pos == "forward"
    player.position = @room_info.playerpos2 if player_entry_pos == "back"
    @update(player.position)

    # INIT FOR ROOM 11 - LASER FENCE
    if @room_number is 11
      @trigger = -1
      @animation_interval = setInterval((=>
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

      ), 1482)
      # TODO: when the player movement script is improved
      # the interval of the laser has to be set to 482
      # which is the original speed
    
    # INIT FOR ROOM 15 - TRAPS
    if @room_number is 15
      if "bulb holder" not in player.inventory or
      "light bulb" not in player.inventory or
      "socket" not in player.inventory
        # make all traps invisible
        @replace("d7","ff") for [0...24]

#-------------------------------------------------------------------

  update : (position = player.get_position()) ->

    @screen_data = clone(all_lvl.screen_data[@room_number])

    @insert_player(position)
    display.show_data()

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
    display.show_death(msgID)

#-------------------------------------------------------------------

  msg : (msgID = 1) ->
    display.show_msg(msgID)

#-------------------------------------------------------------------

  other : (msgID = 1) ->
    display.show_other(msgID)

#-------------------------------------------------------------------

  replace : (tile,tile_code) ->
    # replaces a tile by another
    # tile can be a position on screen (number, e.g. 297) or a tile code (string, e.g. "a9")
    # tile_code is the tile code that replaces the original tile

    tile = @find tile if typeof tile is "string"
    all_lvl.screen_data[@room_number][tile] = tile_code
    @update(player.get_position())

#-------------------------------------------------------------------

  find : (tile) ->
    # returns the first position (e.g. 294) of a give tile_code (e.g. "a9" on the screen)
    if tile in @screen_data
      return @screen_data.indexOf(tile)

#-------------------------------------------------------------------

  check_room : (direction) ->
    # we take a look at the position hte player wants to go to and return true or the tile code

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
        all_msg.screen_data[5][470] = @playround_data.coffin_hex
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
          new_room = @room_number + 1
          @set(new_room,"forward")


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
        if "breathing pipe" in player.inventory
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
#   ROOM 11 
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
      # msg(25)

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