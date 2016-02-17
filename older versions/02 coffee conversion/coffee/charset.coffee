Generate_charset = (texture, char_width, char_height, xstep, ystep) ->

  ###
      Generates a texture charset
      The texture name will be a hex value to parse the level data easily later
      e.g. charset["a9"] returns the texture value of "a9" in the screen rom of the binary
      texture = the texture to use as a base
      char_width,char_height = the width and height of the character (duh!)
      xstep,ystep = jump x,y pixels to the next character
      @return: the char texture
  ###


  @texture = texture
  @char_width = char_width
  @char_height = char_height
  @xstep = xstep
  @ystep = ystep
  @all_chars = []
  @counter = 0
  j = 0
  while j < @texture.height
    i = 0
    while i < @texture.width
      # first we convert the hexcounter into its 2 digit char value
      # by adding "0" to all digits and then only taking the last two
      char_name = ('0' + @counter.toString(16)).slice(-2)
      @all_chars[char_name] = Generate_character(i, j, @char_width, @char_height, @texture)
      @counter++
      i = i + @xstep
    j = j + @ystep
  @all_chars

Generate_character = (x, y, char_width, char_height, texture) ->

  ###
      Generates a sprite character based on the x,y position of a texture
      x,y = x or y position of the character on the given texture
      char_width,char_height = the width and height of the character (duh!)
      texture = the texture to use as a base
      @return: the char texture
  ###

  @x = x
  @y = y
  @char_width = char_width
  @char_height = char_height
  @texture = texture
  # generate a new texture at the specified x,y coordinates
  @char_tx = new (PIXI.Texture)(@texture, new (PIXI.Rectangle)(@x, @y, @char_width, @char_height))
  @char_tx