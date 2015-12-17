// Generated by CoffeeScript 1.8.0

/*
  
  Player
 */
var Player;

Player = (function() {
  function Player() {
    this.position;
    this.inventory = ["A dead frog"];
  }

  Player.prototype.get_position = function() {
    return this.position;
  };

  Player.prototype.set_position = function(direction) {
    if (direction === KEY.LEFT && room.can_player_go(KEY.LEFT)) {
      room.update(this.position - 1);
      this.position -= 1;
    }
    if (direction === KEY.RIGHT && room.can_player_go(KEY.RIGHT)) {
      room.update(this.position + 1);
      this.position += 1;
    }
    if (direction === KEY.UP && room.can_player_go(KEY.UP)) {
      room.update(this.position - 40);
      this.position -= 40;
    }
    if (direction === KEY.DOWN && room.can_player_go(KEY.DOWN)) {
      room.update(this.position + 40);
      return this.position += 40;
    }
  };

  return Player;

})();

//# sourceMappingURL=Player.js.map