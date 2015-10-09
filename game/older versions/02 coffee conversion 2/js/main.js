// Generated by CoffeeScript 1.9.0
var asset_loader_ready, init, init_game, renderloop;

init = function() {
  log('<b>Welcome to Ghost Town JS.</b>');
  load_assets();
};

asset_loader_ready = function() {
  log('assets loaded.');
  init_game();
  renderloop();
};

init_game = function() {
  var bg_tx, chars_tx;
  this.renderer = new PIXI.autoDetectRenderer(768, 576, {
    backgroundColor: 0x792e1d
  });
  document.body.appendChild(renderer.view);
  this.stage = new PIXI.Container;
  this.screen = new PIXI.Container;
  screen.position.x = LEFT_BORDER;
  screen.position.y = TOP_BORDER;
  screen.scale.set(SCALE_FACTOR, SCALE_FACTOR);
  this.myMask = new PIXI.Graphics;
  myMask.beginFill();
  myMask.drawRect(LEFT_BORDER, TOP_BORDER, SCREEN_WIDTH * SCALE_FACTOR, SCREEN_HEIGHT * SCALE_FACTOR);
  myMask.endFill();
  stage.addChild(screen);
  log('stage created');
  chars_tx = new PIXI.Texture.fromImage('img/chars1.png');
  this.chars = new PIXI.Sprite(chars_tx);
  this.charset = new Generate_charset(chars_tx, 8, 8, 16, 16).all_chars;
  this.all_levels = new Levels;
  bg_tx = PIXI.Texture.fromImage('img/screen-bg.png');
  this.bg = new PIXI.Sprite(bg_tx);
};

renderloop = function() {
  renderer.render(stage);
  requestAnimationFrame(renderloop);
};

//# sourceMappingURL=main.js.map
