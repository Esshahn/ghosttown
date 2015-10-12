// Generated by CoffeeScript 1.8.0
var asset_loader_ready, init, init_game;

init = function() {
  log('<b>Welcome to Ghost Town JS.</b>');
  load_assets();
};

asset_loader_ready = function() {
  log('assets loaded.');
  init_game();
};

init_game = function() {
  var chars_tx;
  this.display = new Display();
  chars_tx = new PIXI.Texture.fromImage('img/chars1.png');
  this.charset = new Generate_charset(chars_tx, 8, 8, 16, 16).all_chars;
  this.all_levels = new Levels();
  return this.display.renderloop();
};

//# sourceMappingURL=main.js.map
