// Generated by CoffeeScript 1.9.0

/*

 Asset loader
 loads in the assets! maybe I should give it a proper name to reflect its function better...
 */
var load_assets;

load_assets = function(cb) {
  var loader;
  loader = PIXI.loader;
  loader.add('chars', 'img/chars.png');
  loader.add('chars_commodore', 'img/chars-commodore.png');
  loader.add('chars_hint', 'img/chars-hint.png');
  loader.add('chars_other', 'img/chars-other.png');
  loader.once('complete', function() {
    return cb();
  });
  loader.load();
};

//# sourceMappingURL=asset-loader.js.map
