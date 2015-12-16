// Generated by CoffeeScript 1.8.0

/*

 Asset loader
 loads in the assets! maybe I should give it a proper name to reflect its function better...
 */
var load_assets;

load_assets = function(cb) {
  var loader;
  loader = PIXI.loader;
  loader.add('bg_texture', 'img/start.png');
  loader.add('chars', 'img/chars1.png');
  loader.add('chars_commodore', 'img/chars-commodore.png');
  loader.once('complete', function() {
    return cb();
  });
  loader.load();
};

//# sourceMappingURL=asset-loader.js.map
