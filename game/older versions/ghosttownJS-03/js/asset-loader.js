// Generated by CoffeeScript 1.9.0

/*

 Asset loader
 loads in the assets! maybe I should give it a proper name to reflect its function better...
 */
var load_assets;

load_assets = function() {
  var loader;
  loader = PIXI.loader;
  loader.add('bg_texture', 'img/start.png');
  loader.add('chars', 'img/chars1.png');
  loader.once('complete', asset_loader_ready);
  loader.load();
};

//# sourceMappingURL=asset-loader.js.map
