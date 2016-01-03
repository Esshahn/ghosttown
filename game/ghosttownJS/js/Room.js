// Generated by CoffeeScript 1.10.0

/*
  
  Room class
  contains all information about the room currently displayed
 */
var Room,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Room = (function() {
  function Room() {
    this.screen_data = [];
    this.room_number = 1;
    this.room_info;
    this.room_updated_tiles = [];
    this.playround_data = [];
    this.playround_data.coffin_all = ["A", "B", "C", "D", "E", "F", "G", "H"];
    this.playround_data.coffin = this.playround_data.coffin_all[Math.floor(Math.random() * this.playround_data.coffin_all.length)];
    this.playround_data.coffin_hex = this.playround_data.coffin.charCodeAt(0) - 24;
  }

  Room.prototype.reset = function(room_number1) {
    this.room_number = room_number1;
    return all_lvl.screen_data[this.room_number] = clone(all_lvl.screen_data_copy[this.room_number]);
  };

  Room.prototype.set = function(room_number1, player_entry_pos) {
    var i, ref, results;
    this.room_number = room_number1;
    if (player_entry_pos == null) {
      player_entry_pos = "forward";
    }
    clearInterval(this.animation_interval);
    if ((ref = this.room_number) === 11 || ref === 14 || ref === 15) {
      this.reset(this.room_number);
    }
    this.screen_data = clone(all_lvl.screen_data[this.room_number]);
    this.room_info = levels_config[this.room_number];
    if (player_entry_pos === "forward") {
      player.position = this.room_info.playerpos1;
    }
    if (player_entry_pos === "back") {
      player.position = this.room_info.playerpos2;
    }
    this.update(player.position);
    if (this.room_number === 11) {
      this.trigger = -1;
      this.animation_interval = setInterval(((function(_this) {
        return function() {
          var ref1;
          _this.trigger = _this.trigger * -1;
          if (_this.trigger === 1) {
            _this.replace(379 + 0 * 40, "df");
            _this.replace(379 + 1 * 40, "df");
            _this.replace(379 + 2 * 40, "df");
            _this.replace(379 + 3 * 40, "df");
            _this.replace(379 + 4 * 40, "df");
            _this.replace(379 + 5 * 40, "df");
            _this.playround_data.laser = false;
          } else {
            _this.replace(379 + 0 * 40, "d8");
            _this.replace(379 + 1 * 40, "d8");
            _this.replace(379 + 2 * 40, "d8");
            _this.replace(379 + 3 * 40, "d8");
            _this.replace(379 + 4 * 40, "d8");
            _this.replace(379 + 5 * 40, "d8");
            _this.playround_data.laser = true;
          }
          if (_this.playround_data.laser === true && ((ref1 = player.position) === 377 || ref1 === 378 || ref1 === 379 || ref1 === 417 || ref1 === 418 || ref1 === 419 || ref1 === 457 || ref1 === 458 || ref1 === 459 || ref1 === 497 || ref1 === 498 || ref1 === 499)) {
            clearInterval(_this.animation_interval);
            return _this.die('laser', 24);
          }
        };
      })(this)), 1482);
    }
    if (this.room_number === 15) {
      if (indexOf.call(player.inventory, "bulb holder") < 0 || indexOf.call(player.inventory, "light bulb") < 0 || indexOf.call(player.inventory, "socket") < 0) {
        results = [];
        for (i = 0; i < 24; i++) {
          results.push(this.replace("d7", "ff"));
        }
        return results;
      }
    }
  };

  Room.prototype.update = function(position) {
    var msg;
    if (position == null) {
      position = player.get_position();
    }
    this.screen_data = clone(all_lvl.screen_data[this.room_number]);
    this.insert_player(position);
    display.show_data();
    msg = 'Room ' + this.room_number + ' "' + this.room_info.name + '"';
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

  Room.prototype.die = function(deathID, msgID) {
    if (msgID == null) {
      msgID = 1;
    }
    ui_log("You would have died by the <b>" + deathID + "</b>", "red");
    return display.show_death(msgID);
  };

  Room.prototype.msg = function(msgID) {
    if (msgID == null) {
      msgID = 1;
    }
    return display.show_msg(msgID);
  };

  Room.prototype.other = function(msgID) {
    if (msgID == null) {
      msgID = 1;
    }
    return display.show_other(msgID);
  };

  Room.prototype.replace = function(tile, tile_code) {
    if (typeof tile === "string") {
      tile = this.find(tile);
    }
    all_lvl.screen_data[this.room_number][tile] = tile_code;
    return this.update(player.get_position());
  };

  Room.prototype.find = function(tile) {
    if (indexOf.call(this.screen_data, tile) >= 0) {
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
    if (this.room_number === 1) {
      if (indexOf.call(new_position, "a9") >= 0) {
        if (indexOf.call(player.inventory, "ladder") >= 0) {
          player.remove("ladder");
          player.add("gloves");
          this.replace("a9", "6b");
        }
      }
    }
    if (this.room_number === 2) {
      if (indexOf.call(new_position, "e0") >= 0 || indexOf.call(new_position, "e1") >= 0) {
        player.add("key");
        this.replace("e0", "aa");
        this.replace("e1", "ab");
        setTimeout((function(_this) {
          return function() {
            _this.replace("aa", "df");
            return _this.replace("ab", "df");
          };
        })(this), 200);
      }
      if (("ac" && indexOf.call(new_position, "ad") >= 0) || ("ad" && indexOf.call(new_position, "af") >= 0)) {
        if (indexOf.call(player.inventory, "gloves") >= 0) {
          player.remove("gloves");
          player.add("wirecutter");
          this.replace("ad", "29");
          this.replace("af", "2c");
          this.replace("ac", "28");
          this.replace("ae", "2b");
        } else {
          this.die("wirecutter", 1);
        }
      }
      if (indexOf.call(new_position, "1e") >= 0 || indexOf.call(new_position, "1f") >= 0 || indexOf.call(new_position, "20") >= 0 || indexOf.call(new_position, "21") >= 0 || indexOf.call(new_position, "24") >= 0 || indexOf.call(new_position, "25") >= 0 || indexOf.call(new_position, "26") >= 0) {
        this.msg(2);
      }
    }
    if (this.room_number === 3) {
      if (indexOf.call(new_position, "a6") >= 0 && indexOf.call(player.inventory, "key") >= 0) {
        player.remove("key");
        this.replace(723, "df");
        this.replace(724, "df");
        this.replace(725, "df");
        this.replace(726, "df");
      }
      if (indexOf.call(new_position, "b0") >= 0 && indexOf.call(new_position, "b1") >= 0) {
        player.add("ladder");
        this.replace(804, "df");
        this.replace(805, "df");
        this.replace(804 + 40, "df");
        this.replace(805 + 40, "df");
        this.replace(804 + 80, "df");
        this.replace(805 + 80, "df");
      }
      if (indexOf.call(new_position, "f5") >= 0) {
        if (indexOf.call(player.inventory, "wirecutter") >= 0) {
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
        } else {
          this.die("fence", 3);
        }
      }
      if (indexOf.call(new_position, "b9") >= 0 && indexOf.call(new_position, "bb") >= 0) {
        if (indexOf.call(player.inventory, "hammer") >= 0) {
          player.add("treasure key");
          this.msg(9);
        } else {
          this.die("poison", 4);
        }
      }
    }
    if (this.room_number === 4) {
      if (indexOf.call(new_position, "1e") >= 0 || indexOf.call(new_position, "1f") >= 0 || indexOf.call(new_position, "20") >= 0 || indexOf.call(new_position, "21") >= 0 || indexOf.call(new_position, "24") >= 0 || indexOf.call(new_position, "25") >= 0 || indexOf.call(new_position, "26") >= 0) {
        all_msg.screen_data[5][470] = this.playround_data.coffin_hex;
        this.msg(5);
      }
    }
    if (this.room_number === 5) {
      if (indexOf.call(new_position, "3b") >= 0 || indexOf.call(new_position, "42") >= 0) {
        if ((player.position === 123 && this.playround_data.coffin === "A") || (player.position === 363 && this.playround_data.coffin === "B") || (player.position === 603 && this.playround_data.coffin === "C") || (player.position === 843 && this.playround_data.coffin === "D") || (player.position === 153 && this.playround_data.coffin === "E") || (player.position === 393 && this.playround_data.coffin === "F") || (player.position === 633 && this.playround_data.coffin === "G") || (player.position === 873 && this.playround_data.coffin === "H")) {
          this.msg(12);
          player.add("coffin key");
        } else {
          this.die("zombie", 13);
        }
      }
      if (indexOf.call(new_position, "f6") >= 0 && indexOf.call(new_position, "06") >= 0 && indexOf.call(new_position, "09") >= 0) {
        if (indexOf.call(player.inventory, "coffin key") >= 0) {
          new_room = this.room_number + 1;
          this.set(new_room, "forward");
        }
      }
    }
    if (this.room_number === 6) {
      if (indexOf.call(new_position, "fd") >= 0) {
        if (indexOf.call(player.inventory, "spade") >= 0) {
          player.remove("spade");
          player.add("breathing tube");
          this.msg(10);
        }
      }
      if (indexOf.call(new_position, "1e") >= 0 || indexOf.call(new_position, "1f") >= 0 || indexOf.call(new_position, "20") >= 0 || indexOf.call(new_position, "21") >= 0 || indexOf.call(new_position, "22") >= 0 || indexOf.call(new_position, "23") >= 0 || indexOf.call(new_position, "24") >= 0 || indexOf.call(new_position, "25") >= 0 || indexOf.call(new_position, "26") >= 0) {
        this.msg(11);
      }
    }
    if (this.room_number === 7) {
      if (indexOf.call(new_position, "f6") >= 0 && indexOf.call(new_position, "06") >= 0 && indexOf.call(new_position, "09") >= 0) {
        this.die("snake pit", 6);
      }
    }
    if (this.room_number === 8) {
      if (indexOf.call(new_position, "e3") >= 0) {
        this.die("sacred column", 7);
      }
      if (indexOf.call(new_position, "e0") >= 0) {
        player.add("bulb holder");
        this.replace(721, "bc");
        this.replace(722, "bd");
        this.replace(721 + 40, "be");
        this.replace(722 + 40, "bf");
        setTimeout((function(_this) {
          return function() {
            _this.replace("bc", "df");
            _this.replace("bd", "df");
            _this.replace("be", "df");
            return _this.replace("bf", "df");
          };
        })(this), 1000);
      }
    }
    if (this.room_number === 9) {
      if (indexOf.call(new_position, "c1") >= 0 || indexOf.call(new_position, "c5") >= 0) {
        player.add("spade");
        this.replace("c0", "df");
        this.replace("c1", "df");
        this.replace("c2", "df");
        this.replace("c3", "df");
        this.replace("c4", "df");
        this.replace("c5", "df");
      }
      if (indexOf.call(new_position, "4b") >= 0) {
        if (indexOf.call(player.inventory, "breathing tube") >= 0) {
          player.position = 505;
          this.update(player.get_position());
        } else {
          this.die("water", 8);
        }
      }
      if (indexOf.call(new_position, "59") >= 0) {
        if (indexOf.call(player.inventory, "breathing pipe") >= 0) {
          player.position = 492;
          this.update(player.get_position());
        } else {
          this.die("water", 8);
        }
      }
      if (indexOf.call(new_position, "c6") >= 0 || indexOf.call(new_position, "c7") >= 0 || indexOf.call(new_position, "c8") >= 0 || indexOf.call(new_position, "c9") >= 0 || indexOf.call(new_position, "ca") >= 0 || indexOf.call(new_position, "cb") >= 0) {
        if (indexOf.call(player.inventory, "hammer") >= 0) {
          player.add("boots");
          this.replace("c6", "df");
          this.replace("c7", "df");
          this.replace("c8", "df");
          this.replace("c9", "df");
          this.replace("ca", "df");
          this.replace("cb", "df");
        }
      }
    }
    if (this.room_number === 10) {
      if (indexOf.call(new_position, "1e") >= 0 || indexOf.call(new_position, "1f") >= 0 || indexOf.call(new_position, "20") >= 0 || indexOf.call(new_position, "21") >= 0 || indexOf.call(new_position, "22") >= 0 || indexOf.call(new_position, "23") >= 0 || indexOf.call(new_position, "24") >= 0 || indexOf.call(new_position, "25") >= 0 || indexOf.call(new_position, "26") >= 0) {
        this.msg(14);
      }
    }
    if (this.room_number === 11) {
      if (indexOf.call(new_position, "1e") >= 0 || indexOf.call(new_position, "1f") >= 0 || indexOf.call(new_position, "20") >= 0 || indexOf.call(new_position, "21") >= 0 || indexOf.call(new_position, "22") >= 0 || indexOf.call(new_position, "23") >= 0 || indexOf.call(new_position, "24") >= 0 || indexOf.call(new_position, "25") >= 0 || indexOf.call(new_position, "26") >= 0) {
        this.msg(15);
      }
      if (indexOf.call(new_position, "d8") >= 0) {
        clearInterval(this.animation_interval);
        this.die('laser', 24);
      }
      if (indexOf.call(new_position, "cc") >= 0 || indexOf.call(new_position, "cd") >= 0 || indexOf.call(new_position, "ce") >= 0 || indexOf.call(new_position, "cf") >= 0) {
        if (indexOf.call(player.inventory, "light bulb") >= 0 && indexOf.call(player.inventory, "bulb holder") >= 0) {
          player.add("socket");
          this.replace("cc", "df");
          this.replace("cd", "df");
          this.replace("ce", "df");
          this.replace("cf", "df");
        } else {
          this.die("220 volts", 22);
        }
      }
    }
    if (this.room_number === 12) {
      if (indexOf.call(new_position, "d0") >= 0 && indexOf.call(new_position, "d1") >= 0) {
        this.replace("d0", "df");
        this.replace("d1", "df");
        player.add("hammer");
      }
    }
    if (this.room_number === 13) {
      if (indexOf.call(new_position, "1e") >= 0 || indexOf.call(new_position, "1f") >= 0 || indexOf.call(new_position, "20") >= 0 || indexOf.call(new_position, "21") >= 0 || indexOf.call(new_position, "22") >= 0 || indexOf.call(new_position, "23") >= 0 || indexOf.call(new_position, "24") >= 0 || indexOf.call(new_position, "25") >= 0 || indexOf.call(new_position, "26") >= 0) {
        this.msg(16);
      }
      if (indexOf.call(new_position, "d2") >= 0 || indexOf.call(new_position, "d3") >= 0 || indexOf.call(new_position, "d5") >= 0) {
        player.add("light bulb");
        this.replace("d2", "df");
        this.replace("d3", "df");
        this.replace("d4", "df");
        this.replace("d5", "df");
      }
    }
    if (this.room_number === 14) {
      if (indexOf.call(new_position, "d6") >= 0) {
        if (indexOf.call(player.inventory, "boots") >= 0) {
          if (direction === KEY.DOWN) {
            this.replace(player.position + 120, "df");
            this.replace(player.position + 121, "df");
            this.replace(player.position + 122, "df");
            player.set_position(KEY.DOWN);
          }
          if (direction === KEY.LEFT) {
            this.replace(player.position - 1, "df");
            this.replace(player.position - 1 + 40, "df");
            this.replace(player.position - 1 + 80, "df");
            player.set_position(KEY.LEFT);
          }
          if (direction === KEY.RIGHT) {
            this.replace(player.position + 3, "df");
            this.replace(player.position + 3 + 40, "df");
            this.replace(player.position + 3 + 80, "df");
            player.set_position(KEY.RIGHT);
          }
          if (direction === KEY.UP) {
            this.replace(player.position - 40, "df");
            this.replace(player.position + 1 - 40, "df");
            this.replace(player.position + 2 - 40, "df");
            player.set_position(KEY.UP);
          }
        } else {
          this.die("nails", 23);
        }
      }
      if (indexOf.call(new_position, "1e") >= 0 || indexOf.call(new_position, "1f") >= 0 || indexOf.call(new_position, "20") >= 0 || indexOf.call(new_position, "21") >= 0 || indexOf.call(new_position, "22") >= 0 || indexOf.call(new_position, "23") >= 0 || indexOf.call(new_position, "24") >= 0 || indexOf.call(new_position, "25") >= 0 || indexOf.call(new_position, "26") >= 0) {
        this.msg(17);
      }
    }
    if (this.room_number === 15) {
      if (indexOf.call(new_position, "d7") >= 0 || indexOf.call(new_position, "ff") >= 0) {
        this.die('foot trap', 18);
      }
    }
    if (this.room_number === 16) {
      if (indexOf.call(new_position, "1e") >= 0 || indexOf.call(new_position, "1f") >= 0 || indexOf.call(new_position, "20") >= 0 || indexOf.call(new_position, "21") >= 0 || indexOf.call(new_position, "22") >= 0 || indexOf.call(new_position, "23") >= 0 || indexOf.call(new_position, "24") >= 0 || indexOf.call(new_position, "25") >= 0 || indexOf.call(new_position, "26") >= 0) {
        this.msg(19);
      }
    }
    if (this.room_number === 17) {
      if (indexOf.call(new_position, "f4") >= 0) {
        this.die('starving', 21);
      }
      if (indexOf.call(new_position, "d9") >= 0 || indexOf.call(new_position, "da") >= 0 || indexOf.call(new_position, "db") >= 0 || indexOf.call(new_position, "dc") >= 0) {
        this.die('wizard', 20);
      }
    }
    if (this.room_number === 18) {
      if (indexOf.call(new_position, "dd") >= 0 || indexOf.call(new_position, "de") >= 0) {
        this.replace("dd", "df");
        this.replace("de", "df");
        player.add("sword");
      }
    }
    if (this.room_number === 19) {
      if (indexOf.call(player.inventory, "treasure key") >= 0) {
        if (indexOf.call(new_position, "81") >= 0 || indexOf.call(new_position, "84") >= 0 || indexOf.call(new_position, "87") >= 0 || indexOf.call(new_position, "82") >= 0 || indexOf.call(new_position, "83") >= 0 || indexOf.call(new_position, "8a") >= 0 || indexOf.call(new_position, "8b") >= 0 || indexOf.call(new_position, "8c") >= 0 || indexOf.call(new_position, "8f") >= 0 || indexOf.call(new_position, "92") >= 0) {
          this.other(3);
        }
      }
    }
    if (indexOf.call(new_position, "05") >= 0 && indexOf.call(new_position, "08") >= 0 && indexOf.call(new_position, "0b") >= 0 && this.room_number !== 1) {
      new_room = this.room_number - 1;
      this.set(new_room, "back");
    }
    if (indexOf.call(new_position, "03") >= 0 && indexOf.call(new_position, "06") >= 0 && indexOf.call(new_position, "09") >= 0) {
      new_room = this.room_number + 1;
      this.set(new_room, "forward");
    }
    if (new_position[0] === "df" && new_position[1] === "df" && new_position[2] === "df") {
      return true;
    }
    ui_room("Tiles: " + new_position[0] + " | " + new_position[1] + " | " + new_position[2]);
    return false;
  };

  return Room;

})();

//# sourceMappingURL=Room.js.map
