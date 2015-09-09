
function init(){
  status("Welcome to Ghost Town JS.");
  load_assets();
}

function ready(){
  init_game();
  draw_stuff();

  renderloop();
}


init_game = function() { 

  // the main stage is including all borders and set to double size
  renderer = new PIXI.autoDetectRenderer(768, 576, {backgroundColor : 0x792e1d});
  document.body.appendChild(renderer.view);

  stage = new PIXI.Container();

  // the main screen where the game displays in (320x200)
  screen            = new PIXI.Container();
  screen.position.x = LEFT_BORDER;
  screen.position.y = TOP_BORDER;
  screen.scale.set (SCALE_FACTOR,SCALE_FACTOR);

  // generate a mask that limits the screen to 320x200
  var myMask = new PIXI.Graphics();
  myMask.beginFill();
  myMask.drawRect(LEFT_BORDER, TOP_BORDER, SCREEN_WIDTH * SCALE_FACTOR, SCREEN_HEIGHT * SCALE_FACTOR);
  myMask.endFill();
  //screen.mask = myMask; 

  stage.addChild(screen);

  // load in the charmap
  chars_tx = new PIXI.Texture.fromImage('img/chars.png');
  chars    = new PIXI.Sprite(chars_tx);

  // generate the charset
  charset  = new Generate_charset(chars_tx,8,8,16,16);
};


draw_stuff = function () {

  // draw a test background
  bg_tx = PIXI.Texture.fromImage('img/screen-bg.png');
  bg    = new PIXI.Sprite(bg_tx);
  screen.addChild(bg);

  current_level = new Level("14");
  
 
};



renderloop = function() {
    //display_level(current_level.screen);

    renderer.render(stage);
    requestAnimationFrame(renderloop);
};
