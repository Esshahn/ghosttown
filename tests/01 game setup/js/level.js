/*

  GHOST TOWN JS
  LEVEL GENERATOR

*/


Level = function(filename){
  console.log("creating level");
  this.filename = filename;
  this.screen = import_screen_data(this.filename);

};


display_level = function (level_data){
  var level_sprites = [];
  var xpos          = 0;
  var ypos          = 0;

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

  var level_data = [];

  var oReq = new XMLHttpRequest();
  oReq.open("GET", filename, true);
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