// Generated by CoffeeScript 1.8.0
var Levels;

Levels = (function() {

  /*
  
    GHOST TOWN JS
    LEVEL GENERATOR
   */
  Levels.prototype.screens = [];

  function Levels() {
    var i;
    i = 0;
    while (i < 20) {
      i++;
      this.screens[i] = this.import_screen_data(levels_config[i].filename);
    }
    log('loaded ' + i + ' levels into memory');
  }

  Levels.prototype.import_screen_data = function(filename) {
    var file_fullpath, leveldat, oReq;
    file_fullpath = 'data/screen-lvl-' + filename + '.bin';
    leveldat = [];
    oReq = new XMLHttpRequest;
    oReq.open('GET', file_fullpath, true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = function(oEvent) {
      var arrayBuffer, byteArray, char, i;
      arrayBuffer = oReq.response;
      if (arrayBuffer) {
        byteArray = new Uint8Array(arrayBuffer);
        i = 2;
        while (i < byteArray.byteLength) {
          char = ('0' + byteArray[i].toString(16)).slice(-2);
          leveldat.push(char);
          i++;
        }
      }
    };
    oReq.send(null);
    return leveldat;
  };

  return Levels;

})();

//# sourceMappingURL=Levels.js.map