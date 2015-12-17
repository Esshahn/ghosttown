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

#-------------------------------------------------------------------

  set : (@room_number,player_entry_pos = "forward") ->
  	# changes the room
  	# read in the given level from the all levels data
    # level_data is now the current worksheet to work with

    @screen_data = clone(all_levels.screen_data[@room_number])
    @room_info = all_levels.level_data[@room_number]
    player.position = @room_info.playerpos1 if player_entry_pos == "forward"
    player.position = @room_info.playerpos2 if player_entry_pos == "back"
    @update(player.position)

#-------------------------------------------------------------------

  update : (position = player.get_position()) ->
  	@screen_data = clone(all_levels.screen_data[@room_number])

  	@insert_player(position)
  	display.show_level()

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

  die : (deathID) ->
    ui_log("You would be dead.","red")

#-------------------------------------------------------------------

  replace : (tile,tile_code) ->
    # replaces a tile by another
    # tile can be a position on screen (number, e.g. 297) or a tile code (string, e.g. "a9")
    # tile_code is the tile code that replaces the original tile

    tile = @find tile if typeof tile is "string"
    all_levels.screen_data[@room_number][tile] = tile_code
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
#   DOORS
#-------------------------------------------------------------------
   
    # DOOR to previous room
    if "05" and "08" and "0b" in new_position
      new_room = @room_number - 1
      @set(new_room,"back")

    # DOOR to next room
    if "03" and "06" and "09" in new_position
      new_room = @room_number + 1
      @set(new_room,"forward")

#-------------------------------------------------------------------
#   ROOM 1 LOGIC
#-------------------------------------------------------------------

    if @room_number is 1
      
      # GLOVES
      if "a9" in new_position 
        if "ladder" in player.inventory
          player.add("gloves")
          player.remove("ladder")
          @replace("a9","6b")
        else
          @die("gloves")


#-------------------------------------------------------------------
#   ROOM 2 LOGIC
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
      if (("ac" and "ad" in new_position) or ("ad" and "af" in new_position)) and "gloves" in player.inventory
        player.add("wirecutter")
        player.remove("gloves")
        @replace("ad","29")
        @replace("af","2c")
        @replace("ac","28")
        @replace("ae","2b")

#-------------------------------------------------------------------
#   ROOM 3 LOGIC
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
      if "b0" and "b1" in new_position
        player.add("ladder")        
        @replace(804,"df")
        @replace(805,"df")
        @replace(804+40,"df")
        @replace(805+40,"df")
        @replace(804+80,"df")
        @replace(805+80,"df")

      # FENCE
      if "f5" in new_position and "wirecutter" in player.inventory
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