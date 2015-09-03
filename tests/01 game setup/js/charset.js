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
      var char_name = ("0"+this.counter.toString(16)).slice(-2);
      this.all_chars[char_name] = Generate_character(i,j,this.char_width,this.char_height,this.texture);
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