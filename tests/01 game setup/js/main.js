/*
// this contains the objects you normally draw to the small canvas
var containerOfThings = new PIXI.Container();

// this represents your small canvas, it is a texture you can render a scene to then use as if it was a normal texture
var smallTexture = new PIXI.RenderTexture(renderer, 320, 200);

// instead of rendering your containerOfThings to the reeal scene, render it to the texture
smallTexture.render(containerOfThings);

// now you also have a sprite that uses that texture, rendered in the normal scene
var sprite = new PIXI.Sprite(smallTexture);

sceneContainer.addChild(sprite);

renderer.render(sceneContainer);

*/


function init(){

  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

  var loader = PIXI.loader;
  loader.add('bg_texture',"img/start.png");
  loader.once('complete', ready);
  loader.load();
}

function ready(){
  game = new Game();
  renderloop();
}


Game = function() { 
  
  renderer = new PIXI.autoDetectRenderer(768, 576, {backgroundColor : 0xbba3ff});
  document.body.appendChild(renderer.view);

  stage = new PIXI.Container();
  // this contains the objects you normally draw to the small canvas
  screen = new PIXI.Container();
  // this represents your small canvas, it is a texture you can render a scene to then use as if it was a normal texture
  screen_texture = new PIXI.RenderTexture(renderer, 320, 200);

  bg_texture = PIXI.Texture.fromImage('img/start.png');
  bg = new PIXI.Sprite(bg_texture);

  screen.addChild(bg);

  // instead of rendering your containerOfThings to the reeal scene, render it to the texture
  screen_texture.render(screen);

  // now you also have a sprite that uses that texture, rendered in the normal scene
  screen_sprite = new PIXI.Sprite(screen_texture);

  stage.addChild(screen_sprite);
  screen_sprite.position.x = 64;
  screen_sprite.position.y = 80;
  screen_sprite.scale.set (2,2);

  renderer.render(stage);
 
}




renderloop = function() {
    renderer.render(stage);
    requestAnimationFrame(renderloop);
}
