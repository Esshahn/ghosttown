/*

    C64 load routine

    version 1.0  //  2014 Ingo Hinterding
    for use with the codef framework

      INIT
      c64 = new C64Load();
      c64.init(filename,canvas,x,y,scanline,func);

      filename = filename to display
      canvas = target canvas
      x = x position on target canvas
      y = y position on target canvas
      skip = play full loading routine (0) or skip the loading routine (0)
      scanline = (0) no scanlines, (1) scanlines enabled, (2) flickering scanlines
      func = function to call when done

      EXAMPLE
      c64 = new C64Load();
      c64.init("BUBBLE BOBBLE+",stage,60,60,render);

*/



function C64Load(){

  this.init = function(game,targetCanvas,xPos,yPos,scanlines,skip,callFunctionWhenDone){

      this.scanlines = scanlines;
      this.targetCanvas = targetCanvas;
      this.game = game;
      this.xPos = xPos;
      this.yPos = yPos;
      this.skip = skip;
      this.callFunctionWhenDone = callFunctionWhenDone;

      this.canvas = new canvas(320,200);

      // base64 encoded font image
      this.font = new image("data:image/gif;base64,R0lGODlh6AIJAIABAGxetf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc5M0RCOUZFQkMzNDExRTNBQzZFQkJFM0U3OUZFQTI0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc5M0RCOUZGQkMzNDExRTNBQzZFQkJFM0U3OUZFQTI0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzkzREI5RkNCQzM0MTFFM0FDNkVCQkUzRTc5RkVBMjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzkzREI5RkRCQzM0MTFFM0FDNkVCQkUzRTc5RkVBMjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAABACwAAAAA6AIJAAAC/4yPqcvtD6OctNqLs968+w+G4kiW5ommqgIASGvAgSzH7lHfc6u//e5bTXi/ms1IXNCIuuSRh4NGjRYpwzrtOaM+7Ha7czKb1mU2Ib6Z0WSgO0z2lsFfpu3uXgPXfPsTkjYmNEhYaDiIpKaIB7eY58gVxCaZWAKj9/aIRyVFpfnZx1jheaXlqFe3eeqS85OpChs5edfKcnnLuhobCmpKqft2u+taO6QoyEH6oMzmKmlbKjp1SF39rDkmHH12/SoLNytiNufsnbg011DMK/3K6fcdiTsc+9vuiQ/pHSxna4fMKyAwaPKArUvnzpexJ2AkpPLnrNW7ZpiqlKv0SI7Ec//oOB7rZBCSNoENNzAryC0eFnUXPyZBVqqkkjiZSL1rY85luD9Zyjk4uU3WvEY6763iGAQknYg0u+3Z46cPwo6mJqLsNYMfxZ37WDJcSYFqPIb1oh49t03bt2xY2wpsJ+rt045Xx6LIVgRnQZ9dkTpNphCjXVXw6K3VBxdQ3oZWjRrOV2+sXLgbndYayu6qzJqBQ5pt7HghUaAzQUYettTep8R0d7KVC5sp6NjwMApGdBZn5qCH4xLj283qbcg5Hys0bvm3Q+DBkGMtltywb63QheZyvpWW7uOr6+S6zvkv6V8wl2PX3JLiwL6LZrOCalxjRdedUzayX5v5BdKYkFh133zNeD/pFx5EPbkUB1P4rXRTVfrZdBJYCR1EVkpLpVHadgvWRxQjIyU4WBhlMbhYXs98GGB+/ClV2HIsOthFZX+1BQ5BqCAEHz/V2fgbWOTclmNFGwloTZEzGomkV0kuyWSTTqon4ZP37RflCRESaAiAHhQAADs=");
      this.font.initTile(8,9,33);

      // base64 encoded cursor image
      this.cursor = new image("data:image/gif;base64,R0lGODlhCAAIAIAAAGxetQAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjEgNjQuMTQwOTQ5LCAyMDEwLzEyLzA3LTEwOjU3OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFBMzBCMkRGQkMzMzExRTNBQzZFQkJFM0U3OUZFQTI0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFBMzBCMkUwQkMzMzExRTNBQzZFQkJFM0U3OUZFQTI0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUEzMEIyRERCQzMzMTFFM0FDNkVCQkUzRTc5RkVBMjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUEzMEIyREVCQzMzMTFFM0FDNkVCQkUzRTc5RkVBMjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAACAAIAAACB4SPqcvtXQAAOw==");

      // needs to be base64 encoded

      this.scanlines_gfx = new image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvgAAAJECAYAAABjKlDtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGNDg5QTQ1ODc3MUIxMUU0OTc1OUQ4NzYyODk5Njc3QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGNDg5QTQ1OTc3MUIxMUU0OTc1OUQ4NzYyODk5Njc3QiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY0ODlBNDU2NzcxQjExRTQ5NzU5RDg3NjI4OTk2NzdCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY0ODlBNDU3NzcxQjExRTQ5NzU5RDg3NjI4OTk2NzdCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+rgqTKwAAD9ZJREFUeNrs2EERwEAQw7AcwPKHs+XhkSDklfHb9g0AAEh4d2cFAACoHPwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAIQO/hR8AADoHHwFHwAAQgd/Cj4AAHQOvoIPAAChgz8FHwAAOgdfwQcAgNDBn4IPAACdg6/gAwBA6OBPwQcAgM7BV/ABACB08KfgAwBA5+Ar+AAAEDr4U/ABAKBz8BV8AAAIHfwp+AAA0Dn4Cj4AAHT8AgwAlqe8RnuBE1QAAAAASUVORK5CYII=");


     this.run();

  };

  this.colors = {
    black:"#000000",  white:"#ffffff",  red:"#68372b",  cyan:"#70A4B2",
    purple:"#6F3D86", green:"#588D43",  blue:"#352879", yellow:"#B8C76F",
    orange:"#6F4F25", brown:"#433900",  light_red:"#9A6759",  dark_grey:"#444444",
    grey:"#6C6C6C",   light_green:"#9AD284",light_blue:"#6C5EB5",light_grey:"#959595"
  };

  this.showScanlines = function(){
    if (typeof(toggle) == "undefined") toggle = 0;
    if (this.scanlines == 2) toggle ++;     // only toggle y pos when flickering
    if (toggle < 4) var ypos = 0;
    if (toggle >= 4) var ypos = 1;
    if (toggle >= 8) toggle = 0;

    this.scanlines_gfx.draw(this.targetCanvas,0,ypos);
  };


  this.run = function(){
    // base loop with c64 screen colors and bootup text

    if(typeof(this.currentAnimStage) == "undefined") this.currentAnimStage = 1;
      if (this.skip == 1) this.currentAnimStage = 6;

      this.targetCanvas.fill(this.colors["light_blue"]);
      this.canvas.quad(0,0,320,200,this.colors["blue"]);

      this.font.print(this.canvas,"**** COMMODORE 64 BASIC V2 ****",32,7);
      this.font.print(this.canvas,"64K RAM SYSTEM  38911 BASIC BYTES FREE",8,23);
      this.font.print(this.canvas,"READY.",0,39);

      switch (this.currentAnimStage){
        case 1:
          this.stage1();
          break;
        case 2:
          this.stage2();
          break;
        case 3:
          this.stage3();
          break;
        case 4:
          this.stage4();
          break;
        case 5:
          this.stage5();
          break;
        case 6:
          this.stage6();
          break;
      }

    this.canvas.draw(this.targetCanvas,this.xPos,this.yPos,1,0,2,2);
    if (this.scanlines != 0) this.showScanlines();
    if(this.currentAnimStage < 7) requestAnimFrame(this.run.bind(this));
  };

  this.stage1 = function(){
    // load command is "entered"

    if(typeof(this.typeText) == "undefined") this.typeText = 'LOAD"'+this.game+'",8,1';
    if(typeof(this.delay) == "undefined") this.delay = -30; // time before start typing
    if(typeof(this.typePosition) == "undefined") this.typePosition = 0;

    this.delay ++;
    if (this.delay >= 5){
      this.typePosition ++;
      this.delay = 0;
    }

    if (this.typePosition <= this.typeText.length){
      this.font.print(this.canvas,this.typeText.substring(0,this.typePosition),0,47);
      this.font.print(this.canvas,"^",this.typePosition*8,47);
    }else{
      this.currentAnimStage++;
    }

  };

  this.stage2 = function(){
    // searching for

    if(typeof(this.delay2) == "undefined") this.delay2 = 0;

    this.font.print(this.canvas,this.typeText,0,47);
    this.font.print(this.canvas,"SEARCHING FOR "+this.game,0,63);

    this.delay2++;
    if(this.delay2 > 60) this.currentAnimStage++;
  };


  this.stage3 = function(){
    // loading

    if(typeof(this.delay3) == "undefined") this.delay3 = 0;

    this.font.print(this.canvas,this.typeText,0,47);
    this.font.print(this.canvas,"SEARCHING FOR "+this.game,0,63);
    this.font.print(this.canvas,"LOADING",0,71);

    this.delay3++;
    if(this.delay3 > 140) this.currentAnimStage++;

  };

  this.stage4 = function(){
    // run typed in

    this.font.print(this.canvas,this.typeText,0,47);
    this.font.print(this.canvas,"SEARCHING FOR "+this.game,0,63);
    this.font.print(this.canvas,"LOADING",0,71);
    this.font.print(this.canvas,"READY.",0,79);


    if(typeof(this.delay4) == "undefined") this.delay4 = 0;
    if(typeof(this.typePosition2) == "undefined") this.typePosition2 = 0;

    this.delay4 ++;
    if (this.delay4 >= 10){
      this.typePosition2 ++;
      this.delay4 = 0;
    }

    if (this.typePosition2 <= "RUN".length){
      this.font.print(this.canvas,"RUN".substring(0,this.typePosition2),0,87);
      this.font.print(this.canvas,"^",this.typePosition2*8,87);
    }else{
      this.currentAnimStage++;
    }
  };


  this.stage5 = function(){
    // decrunch

    this.font.print(this.canvas,this.typeText,0,47);
    this.font.print(this.canvas,"SEARCHING FOR "+this.game,0,63);
    this.font.print(this.canvas,"LOADING",0,71);
    this.font.print(this.canvas,"READY.",0,79);
    this.font.print(this.canvas,"RUN",0,87);

    if(typeof(this.delay5) == "undefined") this.delay5 = 0;

    var keys = Object.keys(this.colors);

    for(var i = 0; i <= this.targetCanvas.height; i+=4){
      this.targetCanvas.quad(0,i,this.targetCanvas.width,4,this.colors[keys[Math.floor(keys.length * Math.random())]] );
    }

    this.delay5++;

    if(this.delay5 > 90){
      this.currentAnimStage++;
    }
  };


  this.stage6 = function(){
    // go to main loop
    this.currentAnimStage ++;
    requestAnimFrame(this.callFunctionWhenDone);
  };


}
