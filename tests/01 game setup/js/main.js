
function init(){

  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

  var loader = PIXI.loader;
  loader.add('bg_texture',"img/start.png");
  loader.add('chars',"img/chars_black.png");
  loader.once('complete', ready);
  loader.load();
}

function ready(){
  init_game();
  draw_stuff();
  renderloop();
}


init_game = function() { 

  LEFT_BORDER  = 64;
  TOP_BORDER   = 80;
  SCALE_FACTOR = 2;
  
  // the main stage is including all borders and set to double size
  renderer = new PIXI.autoDetectRenderer(768, 576, {backgroundColor : 0xbba3ff});
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
  myMask.drawRect(LEFT_BORDER, TOP_BORDER, 640, 400);
  myMask.endFill();
  //screen.mask = myMask; 

  stage.addChild(screen);
};


draw_stuff = function () {

  // draw a test background
  bg_tx    = PIXI.Texture.fromImage('img/start.png');
  bg       = new PIXI.Sprite(bg_tx);
  screen.addChild(bg);
  
  // load in the charmap
  chars_tx = new PIXI.Texture.fromImage('img/chars_black.png');
  chars    = new PIXI.Sprite(chars_tx);
  //screen.addChild(chars);

  // generate the charset
  charset  = new Generate_charset(chars_tx,8,8,16,16);

  bibo = new PIXI.Sprite(charset["a9"]);
  bibo.position.x = 0;
  bibo.position.y = 0;
  screen.addChild(bibo);

  bibo1 = new PIXI.Sprite(charset["a9"]);
  bibo1.position.x = 20;
  bibo1.position.y = 20;
  screen.addChild(bibo1);

};

Generate_charset = function ( texture , char_width , char_height , xstep , ystep ){
  /*
      Generates a texture charset
      The texture name will be a hex value to parse the level data easily later
      e.g. charset["a9"] returns the texture value of "a9" in the screen rom of the binary
      texture = the texture to use as a base
      char_width,char_height = the width and height of the character (duh!)
      xstep,ystep = jump x,y pixels to the next character
      @return: the char texture
  */
 
  this.texture     = texture;
  this.char_width  = char_width;
  this.char_height = char_height;
  this.xstep       = xstep;
  this.ystep       = ystep;
  this.all_chars   = [];
  this.counter  = 0;

  for(var j=0; j<this.texture.height; j=j+this.ystep){
    for(var i=0; i<this.texture.width; i=i+this.xstep){
      // first we convert the hexcounter into its 2 digit char value
      // by adding "0" to all digits and then only taking the last two
      var charname = ("0"+this.counter.toString(16)).slice(-2);
      this.all_chars[charname] = Generate_character(i,j,this.char_width,this.char_height,this.texture);
      this.counter++;
    }
  }
  return this.all_chars;
};

Generate_character = function ( x , y , char_width , char_height , texture ){
  /*
      Generates a sprite character based on the x,y position of a texture
      x,y = x or y position of the character on the given texture
      char_width,char_height = the width and height of the character (duh!)
      texture = the texture to use as a base
      @return: the char texture
  */

  this.x           = x;
  this.y           = y;
  this.char_width  = char_width;
  this.char_height = char_height;
  this.texture     = texture;

  // generate a new texture at the specified x,y coordinates
  this.char_tx = new PIXI.Texture( this.texture, new PIXI.Rectangle( this.x , this.y , this.char_width , this.char_height ));
  return this.char_tx;
};



renderloop = function() {
    renderer.render(stage);
    requestAnimationFrame(renderloop);
};
