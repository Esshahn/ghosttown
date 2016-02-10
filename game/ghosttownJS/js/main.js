// Generated by CoffeeScript 1.10.0

/*

  Ghost Town JS - a JavaScript remake of the Commodore C16, C116, Plus/4 game
  Original version created by Udo Gertz, copyright Kingsoft 1985
  Written by Ingo Hinterding 2015,2016
 */
var init, init_game, init_loader, start_game;

init = function() {
  var loader;
  loader = PIXI.loader;
  loader.add('chars', 'img/chars.png');
  loader.add('chars_commodore', 'img/chars-commodore.png');
  loader.add('chars_commodore_green', 'img/chars-commodore-green.png');
  loader.add('chars_commodore_orange', 'img/chars-commodore-orange.png');
  loader.add('chars_hint', 'img/chars-hint.png');
  loader.add('kingsoft', 'img/kingsoft.png');
  loader.add('credits', 'img/credits.png');
  loader.add('music', 'sound/ghost-town-loop.ogg');
  loader.once('complete', function() {
    return init_game();
  });
  loader.load();
};

init_loader = function() {
  return this.load_menu = new C16Loader();
};

init_game = function() {
  this.display = new Display();
  this.display.renderloop();
  this.charset_game = new Generate_charset(new PIXI.Texture.fromImage('img/chars.png'), 8, 8, 16, 16);
  this.charset_commodore = new Generate_charset(new PIXI.Texture.fromImage('img/chars-commodore.png'), 8, 8, 16, 16);
  this.charset_commodore_green = new Generate_charset(new PIXI.Texture.fromImage('img/chars-commodore-green.png'), 8, 8, 16, 16);
  this.charset_commodore_orange = new Generate_charset(new PIXI.Texture.fromImage('img/chars-commodore-orange.png'), 8, 8, 16, 16);
  this.charset_hint = new Generate_charset(new PIXI.Texture.fromImage('img/chars-hint.png'), 8, 8, 16, 16);
  this.locale = "de";
  this.all_levels_counter = 0;
  this.all_lvl = new BinaryImport("lvl");
  this.all_msg = new BinaryImport("msg", this.locale);
  return this.all_other = new BinaryImport("other", this.locale);
};

start_game = function() {
  this.player = new Player();
  this.sound = new Howl({
    urls: ['sound/ghost-town-loop.ogg'],
    autoplay: true,
    loop: true,
    volume: 1.0
  });
  ui_log("Ghost Town JS. Current build: 16.01.22", "green");
  ui_log("User cursor keys and space to move the player.", "green");
  this.room = new Room();
  this.room.other(1, charset_commodore, COLOR_GREY);
  return this.controls = new KeyboardController("title", 300);
};

//# sourceMappingURL=main.js.map
