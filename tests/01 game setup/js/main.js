
function init(){

  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

  var loader = PIXI.loader;
  loader.add('bg_texture',"img/start.png");
  loader.add('chars',"img/chars.png");
  loader.once('complete', ready);
  loader.load();
}


function ready(){
  init_game();
  draw_stuff();
  renderloop();
}


init_game = function() { 
  
  renderer = new PIXI.autoDetectRenderer(768, 576, {backgroundColor : 0xbba3ff});
  document.body.appendChild(renderer.view);

  stage = new PIXI.Container();
  screen = new PIXI.Container();
  screen.position.x = 64;
  screen.position.y = 80;
  screen.scale.set (2,2);
  stage.addChild(screen);

  var myMask = new PIXI.Graphics();
  myMask.beginFill();
  myMask.drawRect(64, 80, 640, 400);
  myMask.endFill();
  stage.addChild(myMask);
  screen.mask = myMask;

};


draw_stuff = function () {

  bg_tx = PIXI.Texture.fromImage('img/start.png');
  bg = new PIXI.Sprite(bg_tx);
  screen.addChild(bg);

  chars_tx = PIXI.Texture.fromImage('img/chars.png');
  chars = new PIXI.Sprite(chars_tx);
  screen.addChild(chars);
  
};


  

renderloop = function() {
    chars.position.x += 1;
    renderer.render(stage);
    requestAnimationFrame(renderloop);
};
