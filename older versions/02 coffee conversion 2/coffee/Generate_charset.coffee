
class Generate_charset

  ###
      Generates a texture charset
      The texture name will be a hex value to parse the level data easily later
      e.g. charset["a9"] returns the texture value of "a9" in the screen rom of the binary
      texture = the texture to use as a base
      char_width,char_height = the width and height of the character (duh!)
      xstep,ystep = jump x,y pixels to the next character
      @return: the char texture
  ###

  all_chars : []

  constructor: (@texture, @char_width = 8, @char_height = 8, @xstep = 16, @ystep = 16) ->

    @counter = 0
    j = 0
    while j < @texture.height
      i = 0
      while i < @texture.width
        # first we convert the hexcounter into its 2 digit char value
        # by adding "0" to all digits and then only taking the last two
        char_name = ('0' + @counter.toString(16)).slice(-2)
        @all_chars[char_name] = new (PIXI.Texture)(@texture, new (PIXI.Rectangle)(i, j, @char_width, @char_height))
        @counter++
        i = i + @xstep
      j = j + @ystep

