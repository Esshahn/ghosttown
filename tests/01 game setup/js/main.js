

function init(){
  game = new Game();
  renderloop();
}


Game = function() { 
  
    renderer = PIXI.autoDetectRenderer(760, 530);
    document.body.appendChild(renderer.view);
    stage = new PIXI.Stage(0x880000);
    
    screen = new PIXI.RenderTexture(320,200);
  

  // Create a renderTexture of some size and draw a scene to it, 
  // then draw that to your main scene using the render texture as the texture of a sprite.
 
    bg_texture = PIXI.Texture.fromImage('img/bg.png');
    bg = new PIXI.Sprite(bg_texture);

    screen.addChild(bg);

    screenspr.PIXI.Texture.fromSprite


    screenspr = new PIXI.Sprite();
    screenspr.addChild(screen);
    screenspr.position.x = 50;
    screenspr.position.y = 50;

    stage.addChild(screenspr);
   

}




renderloop = function() {
    renderer.render(stage);
    requestAnimationFrame(renderloop);
}
