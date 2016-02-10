
#-------------------------------------------------------------------
# C16 Loader Class
# 
# Shows animations before the game starts:
#   1. basic screen
#   2. load sequence
#   3. kingsoft menu
#   4. credits screen
#-------------------------------------------------------------------


class C16Loader

  constructor : ->

    @kingsoft = new PIXI.Sprite.fromImage('img/kingsoft.png')
    @credits = new PIXI.Sprite.fromImage('img/credits.png')
    @display_credits()

  display_kingsoft : ->

    display.change_screen_colors "full", COLOR_BLUE, COLOR_BLUE
    display.addElement(@kingsoft)

  display_credits : ->

    display.change_screen_colors "full", COLOR_BLACK, COLOR_BLACK
    display.addElement(@credits)