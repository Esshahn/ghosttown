###
  
  Room class
  contains all information about the room currently displayed

###

class Room

  constructor : ->

  	@screen_data = []
  	@room_number
  	@room_info

  set : (@room_number) ->
  	# changes the room
  	# read in the given level from the all levels data
    # level_data is now the current worksheet to work with

    @screen_data = clone(world.screen_data[@room_number])
    @room_info = world.level_data[@room_number]
    player.position = @room_info.playerpos1
    @update(@room_info.playerpos1)

  update : (position) ->
  	@screen_data = clone(world.screen_data[@room_number])
  	@insert_player(position)
  	display.show_level()

  	msg = 'Room ' + @room_number + ' "' + @room_info.name + '"'
  	#msg += '<br>Player Start: '+@room_info.playerpos1
  	msg += '<br>Inventory: '+@room_info.inventory
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

  can_player_go : (direction) ->
  	if direction == KEY.LEFT
  		return true if @screen_data[player.position + 0*40 -1] == "df" && @screen_data[player.position + 1*40 -1] == "df" && @screen_data[player.position + 2*40 -1] == "df" 
  	if direction == KEY.RIGHT
  		return true if @screen_data[player.position + 0*40 +3] == "df" && @screen_data[player.position + 1*40 +3] == "df" && @screen_data[player.position + 2*40 +3] == "df"
  	if direction == KEY.UP
  		return true if @screen_data[player.position - 1*40 +0] == "df" && @screen_data[player.position - 1*40 +1] == "df" && @screen_data[player.position - 1*40 +2] == "df" 
  	if direction == KEY.DOWN
  		return true if @screen_data[player.position + 3*40 +0] == "df" && @screen_data[player.position + 3*40 +1] == "df" && @screen_data[player.position + 3*40 +2] == "df" 

