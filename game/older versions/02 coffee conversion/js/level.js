// Generated by CoffeeScript 1.9.0

/*

  GHOST TOWN JS
  LEVEL GENERATOR
 */
var Levels, display_level, import_screen_data;

Levels = function() {
  var i;
  log('loading all levels into memory');
  this.screen = [];
  i = 1;
  while (i <= 20) {
    this.screen[i] = import_screen_data(levels_config[i].filename);
    i++;
  }
};

display_level = function(level) {
  var i, level_data, level_sprites, xpos, ypos;
  level_sprites = [];
  xpos = 0;
  ypos = 0;
  level_data = all_levels.screen[level];
  i = screen.children.length - 1;
  while (i >= 0) {
    screen.removeChild(screen.children[i]);
    i--;
  }
  screen.addChild(bg);
  i = 0;
  while (i < level_data.length) {
    level_sprites[i] = new PIXI.Sprite(charset[level_data[i]]);
    if (xpos >= SCREEN_WIDTH) {
      xpos = 0;
      ypos += 8;
    }
    level_sprites[i].position.x = xpos;
    level_sprites[i].position.y = ypos;
    screen.addChild(level_sprites[i]);
    xpos += 8;
    i++;
  }
};

import_screen_data = function(filename) {
  var file_fullpath, level_data, oReq;
  file_fullpath = 'data/screen-lvl-' + filename + '.bin';
  level_data = [];
  oReq = new XMLHttpRequest;
  oReq.open('GET', file_fullpath, true);
  oReq.responseType = 'arraybuffer';
  oReq.onload = function(oEvent) {
    var arrayBuffer, byteArray, char, i;
    arrayBuffer = oReq.response;
    if (arrayBuffer) {
      byteArray = new Uint8Array(arrayBuffer);
      i = 2;
      while (i < byteArray.byteLength) {
        char = ('0' + byteArray[i].toString(16)).slice(-2);
        if (char >= '93' && char <= '9b') {
          char = 'df';
        }
        level_data.push(char);
        i++;
      }
    }
  };
  oReq.send(null);
  return level_data;
};