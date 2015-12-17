

```
			 _______  __                   __     _______                         
			|     __||  |--..-----..-----.|  |_  |_     _|.-----..--.--.--..-----.
			|    |  ||     ||  _  ||__ --||   _|   |   |  |  _  ||  |  |  ||     |
			|_______||__|__||_____||_____||____|   |___|  |_____||________||__|__|

			  *** A conversion of the Commodore C16/116/Plus4 game to HTML5 ***

```

## Current version

The game is in a very early version.

What's implemented:
* loading in the original binary data of the C16 game
* parsing the binary data into JS and display it with pixi.js
* all 19 rooms can be accessed
* move the player with the cursor keys
* entering and leaving rooms through the doors
* player inventory (normally not shown to the player in the original)
* basic logic for picking up and using items
* basic logic for dying
* multiple charset support
* first three rooms are playable

What's not implemented:
* display the original death messages
* display info messages (e.g. from the question marks)
* title screen
* intro/story screen
* final/win screen
* death
* gameplay logic for all rooms
* animations (Boris, Belegro, Boulder)
* music (I need help on this...)


# Playable build

It may or may not work currently, but you can give it a try:
http://www.awsm.de/gt/


# Ghost Town

I'm trying to convert the original Ghost Town game for the Commodore 264 series to HTML5 and JavaScript. Let's see how far I get, this is a video of a complete playthrough of the game (SP0IL0RZ AL3RTZ!!1): https://www.youtube.com/watch?v=eXM6h9Q3dDQ

Why am I doing this? Basically, I love creating small games and demos (see http://www.awsm.de for more) and Ghost Town was one of the earliest games I owned and played. Even after 25 years I get goose bumps when I see the drop dead ugly player character and listen to the fabulously annoying title music (pulled off by TED, the mutant one-eyed DEAD frog brother of SID, the twin dolphin blowhole equipped rainbow squirting unicorn of soundchips).

Part of the challenge is to blog about it, but that hasn't been setup yet. This place will be updated when there's a URL to pass along.

Anyway, feel free to drop me a comment or participate in whatever way you may fancy (that's four consecutive words with a "y" in it), I'm happy to get some motivation along the way, especially in those dark hours when I run out of fine quality liquers and ask myself who wrote that code I'm looking at since an hour or ten.


## Technology

Not sure which technology to use along the way, but it will probably be something like

* HTML
* CoffeeScript 
* Pixi.js


## Installing the project & dependencies

Don't install it. Don't even download it. Yet.
It's really nothing so far, but if you're into epic disappointments - by all means go ahead!
No dependencies.
