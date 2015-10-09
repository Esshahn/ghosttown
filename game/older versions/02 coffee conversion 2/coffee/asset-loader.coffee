

load_assets = -> 
  loader = PIXI.loader
  loader.add 'bg_texture', 'img/start.png'
  loader.add 'chars', 'img/chars1.png'
  loader.once 'complete', asset_loader_ready
  loader.load()
  return