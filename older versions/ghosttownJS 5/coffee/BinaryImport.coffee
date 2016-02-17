
class BinaryImport

  ###

    GHOST TOWN JS
    LEVEL GENERATOR

  ###


  constructor: (@binary_type = "lvl") -> 

    @screen_data = []

#-------------------------------------------------------------------
#   first we need to setup the different possible binary types
#   which can be "lvl" for a level, "msg" for a message or
#   "other" for anything else.
#   might need some refinement
#-------------------------------------------------------------------

    if @binary_type is "lvl"
      @amount_of_files_to_load = 19
      @file_path = 'data/lvl/lvl-'

    if @binary_type is "msg"
      @amount_of_files_to_load = 25
      @file_path = 'data/msg/msg-'

    if @binary_type is "other"
      @amount_of_files_to_load = 3
      @file_path = 'data/other/other-'

    # load in the levels
    i = 0
    while i < @amount_of_files_to_load
      i++
      # enforce 2 digits, so 1 becomes 01, 2 becomes 02 etc
      filename = ('0' + i).slice(-2)
      @screen_data[i] = @import_screen_data(filename)



  import_screen_data: (filename) ->
    # loads in a level binary file
    file_fullpath = @file_path + filename + '.bin'
    screendat = []
    oReq = new XMLHttpRequest
    oReq.open 'GET', file_fullpath, true
    oReq.responseType = 'arraybuffer'

    oReq.onload = (oEvent) ->
      arrayBuffer = oReq.response
      # Note: not oReq.responseText
      if arrayBuffer
        byteArray = new Uint8Array(arrayBuffer)
        # start i=2 -> skip the first two values, they are not needed
        i = 2
        while i < byteArray.byteLength
          # convert the number to 2 digit hex
          char = ('0' + byteArray[i].toString(16)).slice(-2)
          # put all hex data in level_data
          screendat.push char
          i++
      return

    oReq.send null
    screendat


  