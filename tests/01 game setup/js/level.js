/*

  GHOST TOWN JS
  LEVEL GENERATOR

*/

Levels = function(){
  status("loading all levels into memory");

  this.screen = [];

  for (var i=1;i<=20;i++){
    this.screen[i] = import_screen_data(levels_config[i].filename);
  }
};

display_level = function (level){
  // will need to get more sophisticated, especially when parsing level data like object to show

  var level_sprites = [];
  var xpos          = 0;
  var ypos          = 0;
  var level_data = all_levels.screen[level];


  // first remove all elements on screen
  // todo: might be better to have each level as a different container
  // and just switch containers to show
  for (var i = screen.children.length - 1; i >= 0; i--) {
    screen.removeChild(screen.children[i]);
  }

  // then draw the background
  screen.addChild(bg);

  // and finally the level data
  for(i=0; i<level_data.length;i++){
    level_sprites[i] = new PIXI.Sprite(charset[level_data[i]]);
    if (xpos >= SCREEN_WIDTH){
      xpos = 0;
      ypos += 8;
    }
    level_sprites[i].position.x = xpos;
    level_sprites[i].position.y = ypos;
    screen.addChild(level_sprites[i]);

    xpos += 8;
  }
};

import_screen_data = function (filename){

  // loads in a level binary file
  file_fullpath = "data/screen-lvl-"+filename+".bin";
  var level_data = [];

  var oReq = new XMLHttpRequest();
  oReq.open("GET", file_fullpath, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function (oEvent) {
    var arrayBuffer = oReq.response; // Note: not oReq.responseText
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      // start i=2 -> skip the first two values, they are not needed
      for (var i = 2; i < byteArray.byteLength; i++) {
        
        // convert the number to 2 digit hex
        char = ("0"+byteArray[i].toString(16)).slice(-2);
        
        // erase the player character from the level data
        if (char >= "93" && char <= "9b") char = "df";
        
        // put all hex data in level_data
        level_data.push(char);
      }
      
    }   
    
  };

  oReq.send(null); 
  return level_data;
  
};