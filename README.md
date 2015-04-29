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
