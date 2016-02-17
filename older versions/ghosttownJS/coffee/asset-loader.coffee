###

 Asset loader
 loads in the assets! maybe I should give it a proper name to reflect its function better...

###

load_assets = (cb) -> 
  loader = PIXI.loader
  loader.add 'chars', 'img/chars.png'
  loader.add 'chars_commodore', 'img/chars-commodore.png'
  loader.add 'chars_hint', 'img/chars-hint.png'
  loader.add 'chars_other', 'img/chars-other.png'
  loader.once 'complete', ->
    cb()
  loader.load()
  return