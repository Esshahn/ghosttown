// Generated by CoffeeScript 1.8.0

/*
  
  Room class
  contains all information about the room currently displayed
 */
var Room;

Room = (function() {
  function Room() {
    this.screen_data = [];
    this.room_number;
    this.room_info;
  }

  Room.prototype.set = function(room_number) {
    this.room_number = room_number;
    this.screen_data = clone(world.screen_data[this.room_number]);
    this.room_info = world.level_data[this.room_number];
    player.position = this.room_info.playerpos1;
    return this.update(this.room_info.playerpos1);
  };

  Room.prototype.update = function(position) {
    var msg;
    this.screen_data = clone(world.screen_data[this.room_number]);
    this.insert_player(position);
    display.show_level();
    msg = 'Room ' + this.room_number + ' "' + this.room_info.name + '"';
    msg += '<br>Inventory: ' + this.room_info.inventory;
    return ui_room(msg);
  };

  Room.prototype.get = function(room_number) {
    return this.screen_data;
  };

  Room.prototype.insert_player = function(position) {
    if (position == null) {
      position = this.room_info.playerpos1;
    }
    this.screen_data[position + 0 * 40 + 0] = "93";
    this.screen_data[position + 0 * 40 + 1] = "94";
    this.screen_data[position + 0 * 40 + 2] = "95";
    this.screen_data[position + 1 * 40 + 0] = "96";
    this.screen_data[position + 1 * 40 + 1] = "97";
    this.screen_data[position + 1 * 40 + 2] = "98";
    this.screen_data[position + 2 * 40 + 0] = "99";
    this.screen_data[position + 2 * 40 + 1] = "9a";
    return this.screen_data[position + 2 * 40 + 2] = "9b";
  };

  Room.prototype.can_player_go = function(direction) {
    if (direction === KEY.LEFT) {
      if (this.screen_data[player.position + 0 * 40 - 1] === "df" && this.screen_data[player.position + 1 * 40 - 1] === "df" && this.screen_data[player.position + 2 * 40 - 1] === "df") {
        return true;
      }
    }
    if (direction === KEY.RIGHT) {
      if (this.screen_data[player.position + 0 * 40 + 3] === "df" && this.screen_data[player.position + 1 * 40 + 3] === "df" && this.screen_data[player.position + 2 * 40 + 3] === "df") {
        return true;
      }
    }
    if (direction === KEY.UP) {
      if (this.screen_data[player.position - 1 * 40 + 0] === "df" && this.screen_data[player.position - 1 * 40 + 1] === "df" && this.screen_data[player.position - 1 * 40 + 2] === "df") {
        return true;
      }
    }
    if (direction === KEY.DOWN) {
      if (this.screen_data[player.position + 3 * 40 + 0] === "df" && this.screen_data[player.position + 3 * 40 + 1] === "df" && this.screen_data[player.position + 3 * 40 + 2] === "df") {
        return true;
      }
    }
  };

  return Room;

})();

//# sourceMappingURL=Room.js.map
