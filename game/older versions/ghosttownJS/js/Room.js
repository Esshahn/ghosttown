// Generated by CoffeeScript 1.9.0

/*
  
  Room class
  contains all information about the room currently displayed
 */
var Room,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Room = (function() {
  function Room() {
    this.screen_data = [];
    this.room_number = 1;
    this.room_info;
    this.room_updated_tiles = [];
  }

  Room.prototype.set = function(_at_room_number, player_entry_pos) {
    this.room_number = _at_room_number;
    if (player_entry_pos == null) {
      player_entry_pos = "forward";
    }
    this.screen_data = clone(all_levels.screen_data[this.room_number]);
    this.room_info = all_levels.level_data[this.room_number];
    if (player_entry_pos === "forward") {
      player.position = this.room_info.playerpos1;
    }
    if (player_entry_pos === "back") {
      player.position = this.room_info.playerpos2;
    }
    return this.update(player.position);
  };

  Room.prototype.update = function(position) {
    var msg;
    if (position == null) {
      position = player.get_position();
    }
    this.screen_data = clone(all_levels.screen_data[this.room_number]);
    this.insert_player(position);
    display.show_level();
    msg = 'Room ' + this.room_number + ' "' + this.room_info.name + '"';
    msg += '<br>Inventory: ' + this.room_info.objects;
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

  Room.prototype.replace = function(tile, tile_code) {
    if (typeof tile === "string") {
      tile = this.find(tile);
    }
    all_levels.screen_data[this.room_number][tile] = tile_code;
    return this.update(player.get_position());
  };

  Room.prototype.find = function(tile) {
    if (__indexOf.call(this.screen_data, tile) >= 0) {
      return this.screen_data.indexOf(tile);
    }
  };

  Room.prototype.check_room = function(direction) {
    var new_position, new_room;
    new_position = [];
    if (direction === KEY.LEFT) {
      new_position = [this.screen_data[player.position + 0 * 40 - 1], this.screen_data[player.position + 1 * 40 - 1], this.screen_data[player.position + 2 * 40 - 1]];
    }
    if (direction === KEY.RIGHT) {
      new_position = [this.screen_data[player.position + 0 * 40 + 3], this.screen_data[player.position + 1 * 40 + 3], this.screen_data[player.position + 2 * 40 + 3]];
    }
    if (direction === KEY.UP) {
      new_position = [this.screen_data[player.position - 1 * 40 + 0], this.screen_data[player.position - 1 * 40 + 1], this.screen_data[player.position - 1 * 40 + 2]];
    }
    if (direction === KEY.DOWN) {
      new_position = [this.screen_data[player.position + 3 * 40 + 0], this.screen_data[player.position + 3 * 40 + 1], this.screen_data[player.position + 3 * 40 + 2]];
    }
    if (new_position[0] === "df" && new_position[1] === "df" && new_position[2] === "df") {
      return true;
    }
    if ("05" && "08" && __indexOf.call(new_position, "0b") >= 0) {
      new_room = this.room_number - 1;
      this.set(new_room, "back");
    }
    if ("03" && "06" && __indexOf.call(new_position, "09") >= 0) {
      new_room = this.room_number + 1;
      this.set(new_room, "forward");
    }
    if (this.room_number === 1) {
      if (__indexOf.call(new_position, "a9") >= 0 && __indexOf.call(player.inventory, "ladder") >= 0) {
        player.add("gloves");
        player.remove("ladder");
        this.replace("a9", "6b");
      }
    }
    if (this.room_number === 2) {
      if (__indexOf.call(new_position, "e0") >= 0 || __indexOf.call(new_position, "e1") >= 0) {
        player.add("key");
        this.replace("e0", "aa");
        this.replace("e1", "ab");
      }
      if ((("ac" && __indexOf.call(new_position, "ad") >= 0) || ("ad" && __indexOf.call(new_position, "af") >= 0)) && __indexOf.call(player.inventory, "gloves") >= 0) {
        player.add("wirecutter");
        player.remove("gloves");
        this.replace("ad", "29");
        this.replace("af", "2c");
        this.replace("ac", "28");
        this.replace("ae", "2b");
      }
    }
    if (this.room_number === 3) {
      if (__indexOf.call(new_position, "a6") >= 0 && __indexOf.call(player.inventory, "key") >= 0) {
        player.remove("key");
        this.replace(723, "df");
        this.replace(724, "df");
        this.replace(725, "df");
        this.replace(726, "df");
      }
      if ("b0" && __indexOf.call(new_position, "b1") >= 0) {
        player.add("ladder");
        this.replace(804, "df");
        this.replace(805, "df");
        this.replace(804 + 40, "df");
        this.replace(805 + 40, "df");
        this.replace(804 + 80, "df");
        this.replace(805 + 80, "df");
      }
      if (__indexOf.call(new_position, "f5") >= 0 && __indexOf.call(player.inventory, "wirecutter") >= 0) {
        player.remove("wirecutter");
        this.replace(493, "df");
        this.replace(493 + 1 * 40, "df");
        this.replace(493 + 2 * 40, "df");
        this.replace(493 + 3 * 40, "df");
        this.replace(493 + 4 * 40, "df");
        this.replace(493 + 5 * 40, "df");
        this.replace(493 + 6 * 40, "df");
        this.replace(493 + 7 * 40, "df");
        this.replace(493 + 8 * 40, "df");
        this.replace(493 + 9 * 40, "df");
        this.replace(493 + 10 * 40, "df");
        this.replace(493 + 11 * 40, "df");
      }
    }
    ui_room("Tiles: " + new_position[0] + " | " + new_position[1] + " | " + new_position[2]);
    return false;
  };

  return Room;

})();

//# sourceMappingURL=Room.js.map