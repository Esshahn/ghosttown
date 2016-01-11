// Generated by CoffeeScript 1.9.0
var BinaryImport;

BinaryImport = (function() {

  /*
  
    GHOST TOWN JS
    LEVEL GENERATOR
   */
  function BinaryImport(_at_binary_type) {
    var filename, i;
    this.binary_type = _at_binary_type != null ? _at_binary_type : "lvl";
    this.screen_data = [];
    this.screen_data_copy = [];
    if (this.binary_type === "lvl") {
      this.amount_of_files_to_load = 19;
      this.file_path = 'data/lvl/lvl-';
    }
    if (this.binary_type === "msg") {
      this.amount_of_files_to_load = 30;
      this.file_path = 'data/msg/msg-';
    }
    if (this.binary_type === "other") {
      this.amount_of_files_to_load = 3;
      this.file_path = 'data/other/other-';
    }
    i = 0;
    while (i < this.amount_of_files_to_load) {
      i++;
      filename = ('0' + i).slice(-2);
      this.screen_data[i] = this.import_screen_data(filename);
    }
  }

  BinaryImport.prototype.import_screen_data = function(filename) {
    var file_fullpath, oReq, screendat;
    file_fullpath = this.file_path + filename + '.bin';
    screendat = [];
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
          screendat.push(char);
          i++;
        }
      }
    };
    oReq.send(null);
    return screendat;
  };

  return BinaryImport;

})();

//# sourceMappingURL=BinaryImport.js.map
