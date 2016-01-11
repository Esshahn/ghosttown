// Generated by CoffeeScript 1.9.0

/*
  
  display manager
 */
var Display,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Display = (function() {
  function Display() {
    this.renderloop = __bind(this.renderloop, this);
    this.renderer = new PIXI.autoDetectRenderer(768, 576, {
      backgroundColor: COLOR_RED
    });
    codefCRTemulator.setup(this.renderer.view, "game");
    this.crt_emulation = false;
    if (this.crt_emulation === true) {
      codefCRTemulator.set.scanlines(true);
      codefCRTemulator.set.gaussian(0.6);
      codefCRTemulator.set.light(8);
      codefCRTemulator.set.curvature(true);
      codefCRTemulator.set.gamma(1);
      codefCRTemulator.set.contrast(0.9);
      codefCRTemulator.set.saturation(0.8);
      codefCRTemulator.set.brightness(1.4);
    } else {
      codefCRTemulator.set.scanlines(false);
      codefCRTemulator.set.gaussian(0);
      codefCRTemulator.set.light(0);
      codefCRTemulator.set.curvature(false);
      codefCRTemulator.set.gamma(1);
      codefCRTemulator.set.contrast(1);
      codefCRTemulator.set.saturation(1);
      codefCRTemulator.set.brightness(1);
    }
    this.stage = new PIXI.Container;
    this.screen = new PIXI.Container;
    this.screen.position.x = LEFT_BORDER;
    this.screen.position.y = TOP_BORDER;
    this.screen.scale.set(SCALE_FACTOR, SCALE_FACTOR);
    this.maskGame = new PIXI.Graphics;
    this.maskGame.beginFill();
    this.maskGame.drawRect(LEFT_BORDER, TOP_BORDER, (SCREEN_WIDTH - 8) * SCALE_FACTOR, (SCREEN_HEIGHT - 8) * SCALE_FACTOR);
    this.maskGame.endFill();
    this.screen.mask = this.maskGame;
    this.stage.addChild(this.screen);
    this.maskFull = new PIXI.Graphics;
    this.maskFull.beginFill();
    this.maskFull.drawRect(LEFT_BORDER, TOP_BORDER, SCREEN_WIDTH * SCALE_FACTOR, SCREEN_HEIGHT * SCALE_FACTOR);
    this.maskFull.endFill();
    this.bg_black = new PIXI.Graphics;
    this.bg_black.beginFill(COLOR_BLACK);
    this.bg_black.drawRect(0, 0, (SCREEN_WIDTH - 8) * SCALE_FACTOR, (SCREEN_HEIGHT - 8) * SCALE_FACTOR);
    this.bg_black.endFill();
    this.bg_blue = new PIXI.Graphics;
    this.bg_blue.beginFill(COLOR_BLUE);
    this.bg_blue.drawRect(0, 0, (SCREEN_WIDTH - 8) * SCALE_FACTOR, (SCREEN_HEIGHT - 8) * SCALE_FACTOR);
    this.bg_blue.endFill();
    this.bg_yellow = new PIXI.Graphics;
    this.bg_yellow.beginFill(COLOR_YELLOW);
    this.bg_yellow.drawRect(0, 0, (SCREEN_WIDTH - 8) * SCALE_FACTOR, (SCREEN_HEIGHT - 8) * SCALE_FACTOR);
    this.bg_yellow.endFill();
  }

  Display.prototype.show_data = function(charset) {
    if (charset == null) {
      charset = charset_game;
    }
    this.renderer.backgroundColor = COLOR_RED;
    this.screen.mask = this.maskGame;
    this.level_data = room.get();
    this.clear();
    this.screen.addChild(this.bg_black);
    return this.create_level_data(this.level_data, charset);
  };

  Display.prototype.show_death = function(msg_number, charset) {
    if (charset == null) {
      charset = charset_commodore;
    }
    this.renderer.backgroundColor = COLOR_BLUE;
    this.screen.mask = this.maskFull;
    this.level_data = all_msg.screen_data[msg_number];
    this.clear();
    this.screen.addChild(this.bg_blue);
    return this.create_level_data(this.level_data, charset);
  };

  Display.prototype.show_msg = function(msg_number, charset) {
    if (charset == null) {
      charset = charset_hint;
    }
    this.renderer.backgroundColor = COLOR_RED;
    this.screen.mask = this.maskFull;
    this.level_data = all_msg.screen_data[msg_number];
    this.clear();
    this.screen.addChild(this.bg_black);
    return this.create_level_data(this.level_data, charset);
  };

  Display.prototype.show_other = function(msg_number, charset) {
    if (charset == null) {
      charset = charset_other;
    }
    this.renderer.backgroundColor = COLOR_YELLOW;
    this.screen.mask = this.maskFull;
    this.level_data = all_other.screen_data[msg_number];
    this.clear();
    this.screen.addChild(this.bg_yellow);
    return this.create_level_data(this.level_data, charset);
  };

  Display.prototype.create_level_data = function(_at_level_data, charset) {
    var i, level_sprites, xpos, ypos, _results;
    this.level_data = _at_level_data;
    level_sprites = [];
    xpos = 0;
    ypos = 0;
    i = 0;
    _results = [];
    while (i < this.level_data.length) {
      level_sprites[i] = new PIXI.Sprite(charset[this.level_data[i]]);
      if (xpos >= SCREEN_WIDTH) {
        xpos = 0;
        ypos += 8;
      }
      level_sprites[i].position.x = xpos;
      level_sprites[i].position.y = ypos;
      this.screen.addChild(level_sprites[i]);
      xpos += 8;
      _results.push(i++);
    }
    return _results;
  };

  Display.prototype.clear = function() {
    var i, _results;
    i = this.screen.children.length - 1;
    _results = [];
    while (i >= 0) {
      this.screen.removeChild(this.screen.children[i]);
      _results.push(i--);
    }
    return _results;
  };

  Display.prototype.renderloop = function() {
    this.renderer.render(this.stage);
    codefCRTemulator.draw();
    requestAnimationFrame(this.renderloop);
  };

  return Display;

})();

//# sourceMappingURL=Display.js.map
