// Generated by CoffeeScript 1.9.0
var Generate_charset;

Generate_charset = (function() {

  /*
      Generates a texture charset
      The texture name will be a hex value to parse the level data easily later
      e.g. charset["a9"] returns the texture value of "a9" in the screen rom of the binary
      texture = the texture to use as a base
      char_width,char_height = the width and height of the character (duh!)
      xstep,ystep = jump x,y pixels to the next character
      @return: the char texture
   */
  Generate_charset.prototype.all_chars = [];

  function Generate_charset(_at_texture, _at_char_width, _at_char_height, _at_xstep, _at_ystep) {
    var char_name, i, j;
    this.texture = _at_texture;
    this.char_width = _at_char_width != null ? _at_char_width : 8;
    this.char_height = _at_char_height != null ? _at_char_height : 8;
    this.xstep = _at_xstep != null ? _at_xstep : 16;
    this.ystep = _at_ystep != null ? _at_ystep : 16;
    this.counter = 0;
    j = 0;
    while (j < this.texture.height) {
      i = 0;
      while (i < this.texture.width) {
        char_name = ('0' + this.counter.toString(16)).slice(-2);
        this.all_chars[char_name] = new PIXI.Texture(this.texture, new PIXI.Rectangle(i, j, this.char_width, this.char_height));
        this.counter++;
        i = i + this.xstep;
      }
      j = j + this.ystep;
    }
  }

  return Generate_charset;

})();

//# sourceMappingURL=Generate_charset.js.map
