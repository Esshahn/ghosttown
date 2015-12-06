###

 Asset loader
 loads in the assets! maybe I should give it a proper name to reflect its function better...

###


load_assets = -> 
  loader = PIXI.loader
  loader.add 'bg_texture', 'img/start.png'
  loader.add 'chars', 'img/chars1.png'
  loader.once 'complete', asset_loader_ready
  loader.load()
  return