// Generated by CoffeeScript 1.8.0

/*
  
  display manager
 */
var Display,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Display = (function() {
  function Display() {
    this.renderloop = __bind(this.renderloop, this);
    var bg_tx;
    this.renderer = new PIXI.autoDetectRenderer(768, 576, {
      backgroundColor: 0x792e1d
    });
    document.body.appendChild(this.renderer.view);
    this.stage = new PIXI.Container;
    this.screen = new PIXI.Container;
    this.screen.position.x = LEFT_BORDER;
    this.screen.position.y = TOP_BORDER;
    this.screen.scale.set(SCALE_FACTOR, SCALE_FACTOR);
    this.myMask = new PIXI.Graphics;
    this.myMask.beginFill();
    this.myMask.drawRect(LEFT_BORDER, TOP_BORDER, (SCREEN_WIDTH - 8) * SCALE_FACTOR, (SCREEN_HEIGHT - 8) * SCALE_FACTOR);
    this.myMask.endFill();
    this.screen.mask = this.myMask;
    this.stage.addChild(this.screen);
    bg_tx = PIXI.Texture.fromImage('img/screen-bg.png');
    this.bg = new PIXI.Sprite(bg_tx);
  }

  Display.prototype.show_level = function() {
    var i, level_sprites, xpos, ypos, _results;
    level_sprites = [];
    xpos = 0;
    ypos = 0;
    this.level_data = room.get();
    this.clear();
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
    var i;
    i = this.screen.children.length - 1;
    while (i >= 0) {
      this.screen.removeChild(this.screen.children[i]);
      i--;
    }
    return this.screen.addChild(this.bg);
  };

  Display.prototype.renderloop = function() {
    this.renderer.render(this.stage);
    requestAnimationFrame(this.renderloop);
  };

  return Display;

})();

//# sourceMappingURL=Display.js.map
