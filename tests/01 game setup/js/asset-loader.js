
function load_assets(){

  var loader = PIXI.loader;
  loader.add('bg_texture',"img/start.png");
  loader.add('chars',"img/chars_black.png");
  loader.once('complete', ready);
  loader.load();
  
}