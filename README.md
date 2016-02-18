

```
			 _______  __                   __     _______                         
			|     __||  |--..-----..-----.|  |_  |_     _|.-----..--.--.--..-----.
			|    |  ||     ||  _  ||__ --||   _|   |   |  |  _  ||  |  |  ||     |
			|_______||__|__||_____||_____||____|   |___|  |_____||________||__|__|

			  *** A conversion of the Commodore C16/116/Plus4 game to HTML5 ***

```

## Current version

Version 16-02-18 - Release version

The game is fully completed and should work fine in most modern browsers.
You can play it here: http://www.awsm.de/ghosttown


## Game Controls

Press "A" for german version<br/>Press "B" for english version
Press "C" for credits info
When the game is loaded (grey Ghost Town title screen)
Press "Space" to start the game
Use cursor keys to move and space bar as fire button


## TV Controls

Click the volume slider or press "V" to mute/unmute the music
Click the scanlines knob or press "S" to show or hide the old TV scanlines
Click the fullscreen knob or press "F" (not always supported) to enter/leave fullscreen


## About the game

Ghost Town was written by Udo Gertz with design by Peter Hartmann in 1985. If it came out today, one would classify it as Survival Horror Adventure. No hints were given to the player and any mistake would lead into death. It was made for the Commodore 264 series C16, C116 and the Plus/4. The game was available for PAL regions only, had a german and english version and was able to run on 16k RAM.


## About this remake

Why am I doing this? Basically, I love creating small games and demos and Ghost Town was one of the earliest games I owned, played and still remember. Even after 25 years I get goose bumps when I see the drop dead ugly player character and listen to the fabulously annoying title music (pulled off by TED, the mutant one-eyed dead frog brother of SID, the golden-dolphin-blowhole equipped rainbow-squirting unicorn of soundchips). As a kid, Ghost Town was a very hard game to play, cruel even. We spend so many hours in front of the TV, afraid to make another step that could cause permanent death (and start over again).

If you want to learn something new, it's usually a good idea to set yourself a goal you are excited on. I always wanted to look at the hidden side of Ghost Town: the code that brings this small world to life. That's why I took this remake as an opportunity to dive into some technologies I wasn't familiar with (in this case pixi.js and CoffeeScript).

This remake is a pixel perfect rendition of the original. It reads in the binary data from the game and parses it to be displayed in the canvas. Only the game logic (like what happens when the player picks up an item) is added.

I had a great time visiting the Ghost Town again, I hope you like it, too.


## Technology

* HTML and canvas
* CoffeeScript 
* Pixi.js


## Installing the project & dependencies

No dependancies.
