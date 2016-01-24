###

 Asset loader
 loads in the assets! maybe I should give it a proper name to reflect its function better...

###

load_assets = (cb) -> 
  loader = PIXI.loader

  loader.add 'chars',                   'img/chars.png'
  loader.add 'chars_commodore',         'img/chars-commodore.png'
  loader.add 'chars_commodore_green',   'img/chars-commodore-green.png'
  loader.add 'chars_commodore_orange',   'img/chars-commodore-orange.png'
  loader.add 'chars_hint',              'img/chars-hint.png'
  loader.add 'music',              'sound/ghost-town-loop.ogg'
  
  loader.once 'complete', ->
    cb()
  loader.load()
  return