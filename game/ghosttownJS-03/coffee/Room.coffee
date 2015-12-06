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

  set : (@room_number,player_entry_pos = "forward") ->
  	# changes the room
  	# read in the given level from the all levels data
    # level_data is now the current worksheet to work with

    @screen_data = clone(all_levels.screen_data[@room_number])
    @room_info = all_levels.level_data[@room_number]
    player.position = @room_info.playerpos1 if player_entry_pos == "forward"
    player.position = @room_info.playerpos2 if player_entry_pos == "back"
    @update(player.position)

  update : (position = player.get_position()) ->
  	@screen_data = clone(all_levels.screen_data[@room_number])

  	@insert_player(position)
  	display.show_level()

  	msg = 'Room ' + @room_number + ' "' + @room_info.name + '"'
  	msg += '<br>Inventory: '+@room_info.objects
  	ui_room msg


  get : (room_number) ->
  	# returns the current room data after it is processed
  	@screen_data

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

  replace : (tile,tile_code) ->
    # replaces a tile by another
    # tile can be a position on screen (number, e.g. 297) or a tile code (string, e.g. "a9")
    # tile_code is the tile code that replaces the original tile

    tile = @find tile if typeof tile is "string"
    all_levels.screen_data[@room_number][tile] = tile_code
    @update(player.get_position())

  find : (tile) ->
    # returns the first position (e.g. 294) of a give tile_code (e.g. "a9" on the screen)
    if tile in @screen_data
      return @screen_data.indexOf(tile)

  check_room : (direction) ->
    # we take a look at the position hte player wants to go to and return true or the tile code

    new_position_tiles = []

    # step 1: read in the 4 tiles that the player wants to move to
    if direction == KEY.LEFT
      new_position_tiles = [ @screen_data[player.position + 0*40 -1] , @screen_data[player.position + 1*40 -1] , @screen_data[player.position + 2*40 -1] ]
    if direction == KEY.RIGHT
      new_position_tiles = [ @screen_data[player.position + 0*40 +3] , @screen_data[player.position + 1*40 +3] , @screen_data[player.position + 2*40 +3] ]
    if direction == KEY.UP
      new_position_tiles = [ @screen_data[player.position - 1*40 +0] , @screen_data[player.position - 1*40 +1] , @screen_data[player.position - 1*40 +2] ]
    if direction == KEY.DOWN
      new_position_tiles = [ @screen_data[player.position + 3*40 +0] , @screen_data[player.position + 3*40 +1] , @screen_data[player.position + 3*40 +2] ]

    # are they all empty ("df" == empty)? then return true
    # player will move in that direction then
    return true if new_position_tiles[0] == "df" && new_position_tiles[1] == "df" && new_position_tiles[2] == "df"
    
    # DOOR to previous room
    if "05" && "08" && "0b" in new_position_tiles
      new_room = @room_number - 1
      @set(new_room,"back")

    # DOOR to next room
    if "03" && "06" && "09" in new_position_tiles
      new_room = @room_number + 1
      @set(new_room,"forward")

    # check for the gloves
    # this is the right place to build a full objects check
    if "a9" in new_position_tiles
      player.inventory.push("gloves")
      ui_inventory(player.inventory)
      @replace("a9","6b")
     
    ui_room("Tiles: " + new_position_tiles[0] + " | "+ new_position_tiles[1] + " | "+ new_position_tiles[2])

    false