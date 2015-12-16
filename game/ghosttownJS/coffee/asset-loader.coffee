###

 Asset loader
 loads in the assets! maybe I should give it a proper name to reflect its function better...

###

load_assets = (cb) -> 
  loader = PIXI.loader
  loader.add 'bg_texture', 'img/start.png'
  loader.add 'chars', 'img/chars1.png'
  loader.add 'chars_commodore', 'img/chars-commodore.png'
  loader.once 'complete', ->
    cb()
  loader.load()
  return