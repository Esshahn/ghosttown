###
  
  Player

###

class Player

  constructor : ->

  	@position
  	@inventory = ["A dead frog"]

  
  get_position : ->

  	@position


  set_position : (direction) ->
  	if direction is KEY.LEFT && room.can_player_go(KEY.LEFT)
  		room.update(@position - 1)
  		@position -= 1
  	if direction is KEY.RIGHT && room.can_player_go(KEY.RIGHT)
  		room.update(@position + 1)
  		@position += 1
  	if direction is KEY.UP && room.can_player_go(KEY.UP)
  		room.update(@position - 40)
  		@position -= 40
  	if direction is KEY.DOWN && room.can_player_go(KEY.DOWN)
  		room.update(@position + 40)
  		@position += 40

