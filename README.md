# idea-hunt

Initially (v0.0) just a set of colored areas in the browser window to implement responsiveness to orientation, window size and mobile device variations.

Next (v0.1) some simple renderings in the three "camera" areas. As a minimal world: one topic horizon, one square puck as a launcher base, one horizontal cylinder as a launcher and one sphere as a self. One overhead directional light.
Appearance: horizon = GrandCanyon.jpg, puck = green, cylinder = red, sphere = yellow.
Size: horizon = 1,600 wide x 900 high, puck = 200 wide/long, 50 high, cylinder = 25 radius, 150 length, sphere = 25 radius.

I find the set of names "SelfCam", "NavCam" and "VanityCam" a bit misleading - better to change it to "ViewCam", "NavCam" and "SelfCam".

Next (v0.2) let's firm up the global geometry of the scene including the geometry of the cameras.

OK, now (v0.3) to get some motion controls going. Using the Three OrbitControls allowed some inspection of what I'd built so far but now I need to get my own motion controls that operate the way I want it to. First off, the orbit controls respond to touch/mouse ANYWHERE in the browser window and I want to restrict it to the view rendering area. Also, in addition to the "drag to swivel, pinch to zoom" kind of motion control, I want to have explicit controls like buttons and sliders that can be used as needed.

Let's pick a subset of all possible gesture/mouse controls that can be reasonably implemented and used. Hmmmmmmmm..... if the explicit controls are good enough, we might not need ANY gesture stuff. OK, let's pick a set of explicit controls and make them easily reusable.
	Button
		Has a shape
		Has a color or image
		Has a label
		Triggers a response immediately when touched/clicked
	Slider
		Has a width and length
		Has a range of numeric values corresponding to position along the length
		Has a visible indicator showing the present value's position
		Is sampled by periodic foreground flow (animate or render routine)

Let's define the events we're looking for:
	"Click" = mouse down or one finger touch with release within a short time (say, 100 mS?)
	"Press" = mouse down or one finger touch which is held for longer than a "Click"
	"Drag" = mouse down or one finger touch with mouse move or touch move before release

Alright, I've now got a basic label, a basic button and a basic slider and they seem to be working fairly well. I also split the index.html file into two pieces - index.html and controls.js - because it was just getting uncomfortably large. So far it seems that using a separate JavaScript file as essentially an "include file", even though not officially spoken of that way in the online discussions, apparently works OK as a place to stow a set of functions to make editing more humane.

Let's call this v0.4, commit it and move on to refining the controls.

OK, I've now got a pretty much complete set of basic controls in a separate file ("controls.js") consisting of:
1) a label that displays a given image file
2) a horizontal slider and a vertical slider that make a "track slot" along which a given image slides to change the current value of the control
3) a button that has the appearance of a given image file

All of these are nicely responsive to the changing geometry of the browser window.
All of these can be made to disappear and reappear.
The sliders call a handler whenever there's a change of value.
The button calls a handler whenever it is "pressed" and maintains a pollable flag indicating whether or not the button is being "held down".
The "controls.js" file is fairly nicely commented and pretty much complete subject to future needs for additional or modified controls.

I'm going to call this v0.5 and move on to implementing a data base capability to allow players to store and retrieve information.

Ultimately I'm going to want database capabilities on both the client (browser) and server (astutekid.com) ends but for now, I'll work only with the client/browser end and leave the server side for future development.

IndexedDb appears to be the way to go for this.

So, let's implement a modest starter set of local data and call it good for now:
1) a list of players
2) the name of each player
3) the player's choice of self (from a small set of available, pre-packaged options)
4) the player's progress in each available topic and sub-topic
5) the player's cumulative score by topic, sub-topic and overall total

I'll need a set of pages to handle:
1) view the list of players - I'd like something like the spinners often used for dates and times
2) add a player - pretty much the "edit player" page with defaults to start and "add" in lieu of "change"
3) remove a player - only makes the player dormant allowing "recall" if desired later. Permanent removal, too, with strong confirmation.
4) edit a player - need a page for this
5) select a player with which to play - same as (1)...

Also, a way to track progress and scoring.... this should probably wait until we get the game into a playable stage.
Also a way for the player to see his/her present progress and scores.... nice if this is the same "place" as for editing a player.

Time to add another file: "players.js".

OK, a very primitive player gallery is there (in a separate html file just now) and we can launch and move although not much more than simply drop with some forward velocity....

However, tomorrow there's a chance to let the boys take a look at it and hopefully comment so we're wrapping it up as is to be v0.6 for now.

OK, Linda's comment "Is there some opponent player's must deal with?" was followed fairly quickly by Aaron's "Can you die?" and Will's "How does the game end?". Both boys appeared to enjoy the game in general even though it's in a very rudimentary level of development. They wanted to be able to put in their own pictures in place of my mug and Linda thought it best to leave the "self" appearance simply as cartoonish things a la Wii's Mii.

So, new goals...
1) Add some kind of enemy that must be fought
2) Bring the mug shot jpg self gallery into the game (presently a separate HTML)
3) Put cartoon selves on the list for future implementation
4) Put "live/die/score/screw-up/game-over" features on the future list
5) Add flying navigation via buttons, keys and orbiting
6) Attach the orbiting to just one view rather than the entire screen and drop the "on/off" button for it

Flying controls might be:
up/down (pitch control)
left/right (yaw control)
(roll control should likely be automatic based on yaw)
fast/slow (speed control)
keyboard usage in minecraft is "W" => forward, "S" => backward, "A" => move left, "D" => move right so lets start with:
up = A, down = S, left = A, right = D

Don't have the keys in there yet but the kids are coming soon.....
Crude click-arrows for 3 axis "kicks" of velocity change plus player mug selection is working in a crude way.
No speed control yet or actual flying sensation - need to re-do how the cameras track while moving.
Need to add a way to find yourself when you lose sight of the little green dot.
Let's call this V0.7 -


Seems to have taken forever but I think the while-flying navigation is now working right: left-right yaw controls,
up-down pitch controls, slow/fast-backward/frontward speed controls, ignoring roll.
I can fly around inside and outside the box with pretty pictures on the walls and essentially nothing inside.

To make the initial self/player a bit better, the six-sided box self is replaced with simple shapes generated in blender to be a head, hair, hat and shirt/body with assignable colors.
I'm calling this V0.8 and moving on to update the player selection and editing.

******************************** OK, I'm about to drop the navigation by rotation and physics and try a simpler approach where the player controls left/right and forward/backward motion and an underlying terrain is tracked for vertical position. A "terrain.js" module has been started. I've already chopped the code quite a bit in this direction but mostly by commenting out things and I'm about to REALLY chop it to seriously get rid of a lot of stuff so I'm making a commit here in case I ever want to get back to roughly where I'd gotten with the rotation/velocity approach.... thus, V0.9, "Ta da".

