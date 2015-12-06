###
  
  Player

###

class Player

  constructor : ->

  	@position
  	@inventory = []

  
  get_position : ->

  	@position


  set_position : (direction) ->
    if direction is KEY.LEFT && room.check_room(KEY.LEFT)
      @position -= 1
      room.update(@position)
      
    if direction is KEY.RIGHT && room.check_room(KEY.RIGHT)
      @position += 1
      room.update(@position)
      
    if direction is KEY.UP && room.check_room(KEY.UP)
      @position -= 40
      room.update(@position)
      
    if direction is KEY.DOWN && room.check_room(KEY.DOWN)
      @position += 40
      room.update(@position)

    # display the top left, top right, bottom left, bottom right position of the player
    console.log("---------")
    console.log(@position + " : " + (@position+3))
    console.log((@position+(3*40)) + " : " + (@position+(3*40)+3))
      
