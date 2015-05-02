/**
 * @author billgrace / http://billgrace.com
 */

/**
 * general purpose, responsive controls.
 * an image "control" that allows a graphic image file to be displayed anywhere and in any shape or size
 * a pair of slider controls (one vertical and one horizontal) allowing numerical values to be adjusted by touch or mouse
 * a button that can be clicked or touched
 */

// imageLabel places an image file into a named HTML element.
// The image is placed at a location and size/shape determined by percentage proportions of the dimensions of the host element.
// When the host element is resized, the image will distort as needed to retain the proportions.
function imageLabel ( imageFileName, hostElementId, leftPercent, topPercent, widthPercent, heightPercent ) {
	// make a persistent variable of this instance for later reference during event handling
	var self = this;
	// make a variable allowing the label to become dormant
	this.dormant = false;
	// preserve the arguments
	this.imageFileName = imageFileName;
	this.hostId = hostElementId;
	this.leftPercent = leftPercent;
	this.topPercent = topPercent;
	this.widthPercent = widthPercent;
	this.heightPercent = heightPercent;
	// create the label's positioning element
	this.visible = document.createElement( "div" );
	this.visible.style.cssText = "position:absolute";
	document.body.appendChild( this.visible );
	// create the image element
	this.image = document.createElement( "img" );
	this.visible.appendChild( this.image );
	this.image.src = imageFileName;

	// a routine to figure the geometry of this label according to the geometry of the label's host element
	this.resize = function( windowElementId, left, top, width, height ) {
		// find the label's host element
		var hostElement = document.getElementById( windowElementId );
		// get the geometry of the host element
		var hostLeft = hostElement.offsetLeft;
		var hostTop = hostElement.offsetTop;
		var hostWidth = hostElement.offsetWidth;
		var hostHeight = hostElement.offsetHeight;
		// set the label's geometry (both container div and image) to the specified proportions
		self.image.style.left = self.visible.style.left = "0" + ( ( hostLeft + ( left * hostWidth ) ) | 0 ) + "px";
		self.image.style.top = self.visible.style.top = "0" + ( ( hostTop + ( top * hostHeight ) ) | 0 ) + "px";
		self.image.style.width = self.visible.style.width = "0" + ( ( width * hostWidth ) | 0 ) + "px";
		self.image.style.height = self.visible.style.height = "0" + ( ( height * hostHeight ) | 0 ) + "px";
	}
	// an event handler to call the resizing routine whenever there's a change in browser geometry
	this.windowResizeHandler = function() {
		if( self.dormant ) return;
		self.resize( self.hostId, self.leftPercent, self.topPercent, self.widthPercent, self.heightPercent );
	}

	// a routine to make the label visible and responsive
	this.activate = function() {
		self.dormant = false;
		self.visible.style.display = "block";
		self.windowResizeHandler();
	}
	// a routine to make the label invisible and dormant
	this.deactivate = function() {
		self.dormant = true;
		self.visible.style.display = "none";
	}

	// an initial invocation of the resizing routine to work out the starting geometry of the label
	this.windowResizeHandler();
	// add an event listener to invoke the resize handler
	window.addEventListener( "resize", this.windowResizeHandler );
};

// horizontalSlider creates a left-right slide control within a named HTML element.
// The control is meant to visually resemble a slider-type level control on a typical sound board in appearance and use.
// The control's track location and size are determined by percentage proportions of the host element.
// The control's sliding "knob" is rendered from a graphic image file. The height of the slider is determined by a percentage of the
//   height of the host element and the width of the slider is determined by maintaining the original aspect ratio of the graphic image.
// An event handler routine is invoked whenever the slider position is changed.
function horizontalSlider( sliderImageFileName, trackColor, leftLimitValue, rightLimitValue, startingValue, hostElementId, sliderHeightPercent, trackHeightPercent, leftLimitPercent, verticalCenterPercent, limitToLimitPercent, changeHandler ) {
	// make a persistent variable of this instance for later reference during event handling
	var self = this;
	// make a variable allowing the label to become dormant
	this.dormant = false;
	// preserve the arguments
	this.sliderImageFileName = sliderImageFileName;
	this.trackColor = trackColor;
	this.leftLimitValue = leftLimitValue;
	this.rightLimitValue = rightLimitValue;
	this.currentValue = startingValue;
	this.hostId = hostElementId;
	this.sliderHeightPercent = sliderHeightPercent;
	this.trackHeightPercent = trackHeightPercent;
	this.leftLimitPercent = leftLimitPercent;
	this.verticalCenterPercent = verticalCenterPercent;
	this.limitToLimitPercent = limitToLimitPercent;
	// establish some other handy values
	this.valueRange = rightValue - leftValue;
	this.leftLimitPixel = 0;
	this.rightLimitPixel = 0;
	this.motionPixelRange = 0;
	this.nowTracking = false;
	// create the control's visible elements
	this.track = document.createElement( "div" );
	this.track.style.cssText = "position:absolute;background-color:" + this.trackColor;
	document.body.appendChild( this.track );
	this.slider = document.createElement( "div" );
	this.slider.style.cssText = "position:absolute";
	document.body.appendChild( this.slider );
	this.imageElement = new Image();
	this.imageElement.onload = function() { self.windowResizeHandler(); };
	this.imageElement.src = sliderImageFileName;
	this.slider.appendChild( this.imageElement );

	// a routine to figure the geometry of this control according to the geometry of the label's host element
	this.resize = function( windowElementId, leftLimitPercent, verticalCenterPercent, limitToLimitPercent, sliderRadiusPercent, trackRadiusPercent ) {
		// find the control's host element
		var hostElement = document.getElementById( windowElementId ); 
		// get the geometry of the host element
		var hostLeft = hostElement.offsetLeft;
		var hostTop = hostElement.offsetTop;
		var hostWidth = hostElement.offsetWidth;
		var hostHeight = hostElement.offsetHeight;
		// calculate the control's pixel geometry according to the specified proportions
		var trackLeft = ( hostLeft + ( ( leftLimitPercent - ( trackHeightPercent / 2 ) ) * hostWidth ) ) | 0;
		var trackTop = ( hostTop + ( ( verticalCenterPercent - ( trackHeightPercent / 2 ) ) * hostHeight ) ) | 0;
		var trackWidth = ( ( limitToLimitPercent + trackHeightPercent ) * hostWidth ) | 0;
		var trackHeight = ( trackHeightPercent * hostHeight ) | 0;
		// calculate the slider image's natural aspect ratio
		var imageAspectRatio = self.imageElement.naturalWidth / self.imageElement.naturalHeight;
		// calculate the pixel positions of the end points of the slider's motion
		self.leftLimitPixel = ( trackLeft + trackHeight / 2 ) | 0;
		self.rightLimitPixel = (trackLeft + trackWidth - trackHeight / 2 ) | 0;
		// calculate the slider range in terms of equivalent pixels
		self.motionPixelRange = self.rightLimitPixel - self.leftLimitPixel;
		// calculate the proportional height of the slider image and the necessary width to retain the image's aspect ratio
		var sliderHeight = ( sliderHeightPercent * hostHeight ) | 0;
		var sliderWidth = ( sliderHeight * imageAspectRatio ) | 0;
		// calculate the pixel location of the slider image according to present value
		var sliderLeft = ( self.leftLimitPixel + ( self.motionPixelRange * ( self.currentValue / ( self.rightLimitValue - self.leftLimitValue ) ) ) - ( sliderWidth / 2 ) ) | 0;
		var sliderTop = ( hostTop + ( ( verticalCenterPercent - ( sliderHeightPercent / 2 ) ) * hostHeight ) ) | 0;
		// set the calculated geometry into the control's elements
		self.track.style.left = "0" + trackLeft + "px";
		self.track.style.top = "0" + trackTop + "px";
		self.track.style.width = "0" + trackWidth + "px";
		self.track.style.height = "0" + trackHeight + "px";
		self.track.style.borderRadius = "0" + ( ( trackHeight / 2 ) | 0 ) + "px";
		self.imageElement.style.left = self.slider.style.left = "0" + sliderLeft + "px";
		self.imageElement.style.top = self.slider.style.top = "0" + sliderTop + "px";
		self.imageElement.style.width = self.slider.style.width = "0" + sliderWidth + "px";
		self.imageElement.style.height = self.slider.style.height = "0" + sliderHeight + "px";
	}
	// an event handler to call the resizing routine whenever there's a change in browser geometry
	this.windowResizeHandler = function() {
		if( self.dormant ) return;
		self.resize( self.hostId, self.leftLimitPercent, self.verticalCenterPercent, self.limitToLimitPercent, self.sliderHeightPercent, self.trackHeightPercent );
	}

	// a routine to make the control visible and responsive
	this.activate = function() {
		self.dormant = false;
		self.track.style.display = "block";
		self.slider.style.display = "block";
		self.windowResizeHandler();
	}
	// a routine to make the control invisible and dormant
	this.deactivate = function() {
		self.dormant = true;
		self.track.style.display = "none";
		self.slider.style.display = "none";
	}

	// a routine to convert click/touch screen geometry into the equivalent slider value
	this.updateControlValue = function( pixelX ) {
		if( pixelX < self.leftLimitPixel ) pixelX = self.leftLimitPixel;
		if( pixelX > self.rightLimitPixel ) pixelX = self.rightLimitPixel;
		self.currentValue = self.leftLimitValue + self.valueRange * ( pixelX - self.leftLimitPixel ) / self.motionPixelRange;
		self.windowResizeHandler();
		changeHandler( self.currentValue );
	}

	// handlers for mouse and touch events
	this.sliderMouseDownEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		// a click on the slider "grabs" the slider...
		self.nowTracking = true;
		// and sets the slider's horizontal position to that of the point clicked
		self.updateControlValue( e.clientX );
	}
	this.sliderMouseMoveEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		if( !self.nowTracking ) return;
		// dragging with the mouse varies the slider's horizontal position
		self.updateControlValue( e.clientX );
	}
	this.sliderMouseUpEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		// releasing the mouse button stops any further moving of the slider
		self.nowTracking = false;
	}
	this.touchStartEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		// touching the slider "grabs" it...
		self.nowTracking = true;
		// and sets the slider's horizontal position to that of the point touched
		self.updateControlValue( e.touches[ 0 ].clientX );
	}
	this.touchMoveEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		if( !self.nowTracking ) return;
		// dragging the slider varies its horizontal position
		self.updateControlValue( e.touches[ 0 ].clientX );
	}
	this.touchEndEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		// lifting the touch finger stops any further moving of the slider
		self.nowTracking = false;
	}

	// an initial invocation of the resizing routine to work out the starting geometry of the control
	this.windowResizeHandler();

	// add an event listener to invoke the resize handler
	window.addEventListener( "resize", this.windowResizeHandler, false );
	// add event listeners to invoke the mouse/touch handlers
	this.track.addEventListener( "mousedown", this.sliderMouseDownEventHandler, false );
	this.slider.addEventListener( "mousedown", this.sliderMouseDownEventHandler, false );
	this.track.addEventListener( "mousemove", this.sliderMouseMoveEventHandler, false );
	this.slider.addEventListener( "mousemove", this.sliderMouseMoveEventHandler, false );
	window.addEventListener( "mouseup", this.sliderMouseUpEventHandler, false );
	this.track.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.slider.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.track.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	this.slider.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	document.addEventListener( "touchend", this.touchEndEventHandler, false );
}

// Similar to horizontalSlider but oriented vertically
function verticalSlider( sliderImageFileName, trackColor, bottomLimitValue, topLimitValue, startingValue, hostElementId, sliderWidthPercent, trackWidthPercent, topLimitPercent, horizontalCenterPercent, limitToLimitPercent, changeHandler ) {
	// make a persistent variable of this instance for later reference during event handling
	var self = this;
	// make a variable allowing the label to become dormant
	this.dormant = false;
	// preserve the arguments
	this.sliderImageFileName = sliderImageFileName;
	this.trackColor = trackColor;
	this.bottomLimitValue = bottomLimitValue;
	this.topLimitValue = topLimitValue;
	this.currentValue = startingValue;
	this.hostId = hostElementId;
	this.sliderWidthPercent = sliderWidthPercent;
	this.trackWidthPercent = trackWidthPercent;
	this.topLimitPercent = topLimitPercent;
	this.horizontalCenterPercent = horizontalCenterPercent;
	this.limitToLimitPercent = limitToLimitPercent;
	// establish some other handy values
	this.valueRange = topLimitValue - bottomLimitValue;
	this.bottomLimitPixel = 0;
	this.topLimitPixel = 0;
	this.motionPixelRange = 0;
	this.nowTracking = false;
	// create the control's visible elements
	this.track = document.createElement( "div" );
	this.track.style.cssText = "position:absolute;background-color:" + this.trackColor;
	document.body.appendChild( this.track );
	this.slider = document.createElement( "div" );
	this.slider.style.cssText = "position:absolute";
	document.body.appendChild( this.slider );
	this.imageElement = new Image();
	this.imageElement.onload = function() { self.windowResizeHandler(); };
	this.imageElement.src = sliderImageFileName;
	this.slider.appendChild( this.imageElement );

	// a routine to figure the geometry of this control according to the geometry of the label's host element
	this.resize = function( windowElementId, bottomLimitPercent, horizontalCenterPercent, limitToLimitPercent, sliderWidthPercent, trackWidthPercent ) {
		// find the control's host element
		var hostElement = document.getElementById( windowElementId ); 
		// get the geometry of the host element
		var hostLeft = hostElement.offsetLeft;
		var hostTop = hostElement.offsetTop;
		var hostWidth = hostElement.offsetWidth;
		var hostHeight = hostElement.offsetHeight;
		// calculate the control's pixel geometry according to the specified proportions
		var trackLeft = ( hostLeft + ( ( horizontalCenterPercent - ( trackWidthPercent / 2 ) ) * hostWidth ) ) | 0;
		var trackTop = ( hostTop + ( ( topLimitPercent - ( trackWidthPercent / 2 ) ) * hostHeight ) ) | 0;
		var trackWidth = ( trackWidthPercent * hostWidth ) | 0;
		var trackHeight = ( ( limitToLimitPercent + trackWidthPercent ) * hostHeight ) | 0;
		// calculate the slider image's natural aspect ratio
		var imageAspectRatio = self.imageElement.naturalWidth / self.imageElement.naturalHeight;
		// calculate the pixel positions of the end points of the slider's motion
		self.topLimitPixel = ( trackTop + ( trackWidth / 2 ) ) | 0;
		self.bottomLimitPixel = (trackTop + trackHeight - ( trackWidth / 2 ) ) | 0;
		// calculate the slider range in terms of equivalent pixels
		self.motionPixelRange = self.bottomLimitPixel - self.topLimitPixel;
		// calculate the proportional width of the slider image and the necessary height to retain the image's aspect ratio
		var sliderWidth = ( sliderWidthPercent * hostWidth ) | 0;
		var sliderHeight = ( sliderWidth / imageAspectRatio ) | 0;
		// calculate the pixel location of the slider image according to present value
		var sliderLeft = ( hostLeft + ( ( horizontalCenterPercent - ( sliderWidthPercent / 2 ) ) * hostWidth ) ) | 0;
		var sliderTop = ( self.bottomLimitPixel - ( self.motionPixelRange * ( self.currentValue / ( self.topLimitValue - self.bottomLimitValue ) ) ) - ( sliderHeight / 2 ) ) | 0;
		// set the calculated geometry into the control's elements
		self.track.style.left = "0" + trackLeft + "px";
		self.track.style.top = "0" + trackTop + "px";
		self.track.style.width = "0" + trackWidth + "px";
		self.track.style.height = "0" + trackHeight + "px";
		self.track.style.borderRadius = "0" + ( ( trackWidth / 2 ) | 0 ) + "px";
		self.imageElement.style.left = self.slider.style.left = "0" + sliderLeft + "px";
		self.imageElement.style.top = self.slider.style.top = "0" + sliderTop + "px";
		self.imageElement.style.width = self.slider.style.width = "0" + sliderWidth + "px";
		self.imageElement.style.height = self.slider.style.height = "0" + sliderHeight + "px";
	}
	// an event handler to call the resizing routine whenever there's a change in browser geometry
	this.windowResizeHandler = function() {
		if( self.dormant ) return;
		self.resize( self.hostId, self.bottomLimitPercent, self.horizontalCenterPercent, self.limitToLimitPercent, self.sliderWidthPercent, self.trackWidthPercent );
	}

	// a routine to make the control visible and responsive
	this.activate = function() {
		self.dormant = false;
		self.track.style.display = "block";
		self.slider.style.display = "block";
		self.windowResizeHandler();
	}
	// a routine to make the control invisible and dormant
	this.deactivate = function() {
		self.dormant = true;
		self.track.style.display = "none";
		self.slider.style.display = "none";
	}

	// a routine to convert click/touch screen geometry into the equivalent slider value
	this.updateControlValue = function( pixelY ) {
		if( pixelY > self.bottomLimitPixel ) pixelY = self.bottomLimitPixel;
		if( pixelY < self.topLimitPixel ) pixelY = self.topLimitPixel;
		self.currentValue = self.bottomLimitValue + self.valueRange * ( self.bottomLimitPixel - pixelY ) / self.motionPixelRange;
		self.windowResizeHandler();
		changeHandler( self.currentValue );
	}

	// handlers for mouse and touch events
	this.sliderMouseDownEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		// a click on the slider "grabs" the slider...
		self.nowTracking = true;
		// and sets the slider's vertical position to that of the point clicked
		self.updateControlValue( e.clientY );
	}
	this.sliderMouseMoveEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		if( !self.nowTracking ) return;
		// dragging the slider with the mouse varies the slider's vertical position
		self.updateControlValue( e.clientY );
	}
	this.sliderMouseUpEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		// releasing the mouse button stops any further moving of the slider
		self.nowTracking = false;
	}
	this.touchStartEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		// touching the slider "grabs" it...
		self.nowTracking = true;
		// and sets the slider's vertical position to that of the point touched
		self.updateControlValue( e.touches[ 0 ].clientY );
	}
	this.touchMoveEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		if( !self.nowTracking ) return;
		// dragging the slider varies its vertical position
		self.updateControlValue( e.touches[ 0 ].clientY );
	}
	this.touchEndEventHandler = function( e ) {
		if( self.dormant ) return;
		e.preventDefault();
		// lifting the touch finger stops any further moving of the slider
		self.nowTracking = false;
	}

	// an initial invocation of the resizing routine to work out the starting geometry of the control
	this.windowResizeHandler();

	// add an event listener to invoke the resize handler
	window.addEventListener( "resize", this.windowResizeHandler, false );
	// add event listeners to invoke the mouse/touch handlers
	this.track.addEventListener( "mousedown", this.sliderMouseDownEventHandler, false );
	this.slider.addEventListener( "mousedown", this.sliderMouseDownEventHandler, false );
	this.track.addEventListener( "mousemove", this.sliderMouseMoveEventHandler, false );
	this.slider.addEventListener( "mousemove", this.sliderMouseMoveEventHandler, false );
	window.addEventListener( "mouseup", this.sliderMouseUpEventHandler, false );
	this.track.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.slider.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.track.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	this.slider.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	document.addEventListener( "touchend", this.touchEndEventHandler, false );
}

// imageButton places the image from an image file into a named HTML element.
// The image can be clicked/touched to invoke an event handler routine.
// The "preserveAspect" argument can be supplied as "W", "H" or anything else and indicates that during resizing, the image's
//  original aspect ratio is to be preserved with size tracking:
//   - the width of the host element ("W")
//   - the height of the host element ("H")
//   - neither of the above and simply stretch along with any resizing
function imageButton( imageFileName, hostElementId, leftPercent, topPercent, widthPercent, heightPercent, preserveAspect, handler ) {
	// make a persistent variable of this instance for later reference during event handling
	var self = this;
	// make a variable allowing the label to become dormant
	this.dormant = false;
	// preserve the arguments
	this.imageFileName = imageFileName;
	this.hostId = hostElementId;
	this.leftPercent = leftPercent;
	this.topPercent = topPercent;
	this.widthPercent = widthPercent;
	this.heightPercent = heightPercent;
	this.preserveAspect = preserveAspect;
	this.visible = document.createElement( "div" );
	this.visible.style.cssText = "position:absolute";
	document.body.appendChild( this.visible );
	this.imageElement = new Image();
	this.imageElement.onload = function() { self.windowResizeHandler(); };
	this.imageElement.src = imageFileName;
	this.visible.appendChild( this.imageElement );
	this.buttonDown = false;
	this.resize = function( windowElementId, left, top, width, height ) {
		// find the button's host element
		var hostElement = document.getElementById( windowElementId ); 
		// get the geometry of the host element
		var hostLeft = hostElement.offsetLeft;
		var hostTop = hostElement.offsetTop;
		var hostWidth = hostElement.offsetWidth;
		var hostHeight = hostElement.offsetHeight;
		// calculate the button image's natural aspect ratio
		var imageAspectRatio = self.imageElement.naturalWidth / self.imageElement.naturalHeight;
		// set the button's location geometry (both container div and image) to the specified proportions
		self.imageElement.style.left = self.visible.style.left = "0" + ( ( hostLeft + ( left * hostWidth ) ) | 0 ) + "px";
		self.imageElement.style.top = self.visible.style.top = "0" + ( ( hostTop + ( top * hostHeight ) ) | 0 ) + "px";
		// calculate the button's size geometry according to the specified proportions
		var rulingWidth = width * hostWidth;
		var rulingHeight = height * hostHeight;
		// set the button's size geometry
		switch( self.preserveAspect ) {
			case "W":
				// set the button's size according to the width of the host element and maintain the image's original aspect ratio
				self.imageElement.style.width = self.visible.style.width = "0" + ( ( rulingWidth ) | 0 ) + "px";
				self.imageElement.style.height = self.visible.style.height = "0" + ( ( rulingWidth / imageAspectRatio ) | 0 ) + "px";
				break;
			case "H":
				// set the button's size according to the height of the host element and maintain the image's original aspect ratio
				self.imageElement.style.width = self.visible.style.width = "0" + ( ( rulingHeight * imageAspectRatio ) | 0 ) + "px";
				self.imageElement.style.height = self.visible.style.height = "0" + ( ( rulingHeight ) | 0 ) + "px";
				break;
			default:
				// set the button's size according to the geometry of the host element and ignore the original image's aspect ratio
				self.imageElement.style.width = self.visible.style.width = "0" + ( ( rulingWidth ) | 0 ) + "px";
				self.imageElement.style.height = self.visible.style.height = "0" + ( ( rulingHeight ) | 0 ) + "px";
				break;
		}
	}
	// an event handler to call the resizing routine whenever there's a change in browser geometry
	this.windowResizeHandler = function() {
		if( self.dormant ) return;
		self.resize( self.hostId, self.leftPercent, self.topPercent, self.widthPercent, self.heightPercent );
	}

	// a routine to make the button visible and responsive
	this.activate = function() {
		self.dormant = false;
		self.visible.style.display = "block";
		self.windowResizeHandler();
	}
	// a routine to make the button invisible and dormant
	this.deactivate = function() {
		self.dormant = true;
		self.visible.style.display = "none";
	}

	// handlers for mouse and touch events
	this.mouseDownEventHandler = function( e ) {
		if( self.dormant ) return;
		// a mouse click on the button sets the button's "Down" flag to true...
		self.buttonDown = true;
		// and invokes the button's handler routine
		handler();
	}
	this.mouseUpEventHandler = function( e ) {
		if( self.dormant ) return;
		// the mouse button being released resets the button's "Down" flag to false
		self.buttonDown = false;
	}
	this.mouseOutEventHandler = function( e ) {
		if( self.dormant ) return;
		// dragging the mouse pointer outside the button's extent also resets the button's "Down" flag to false
		self.buttonDown = false;
	}
	this.touchStartEventHandler = function( e ) {
		if( self.dormant ) return;
		event.preventDefault();
		// touching the button sets the button's "Down" flag to true...
		self.buttonDown = true;
		// and invokes the button's handler routine
		handler();
	}
	this.touchEndEventHandler = function( e ) {
		if( self.dormant ) return;
		event.preventDefault();
		// lifting the touching finger resets the button's "Down" flag to false
		self.buttonDown = false;
	}
	this.touchLeaveEventHandler = function( e ) {
		if( self.dormant ) return;
		event.preventDefault();
		// dragging the touching finger outside the button's extent also reset the button's "Down" flag to false
		self.buttonDown = false;
	}

	// an initial invocation of the resizing routine to work out the starting geometry of the control
	this.windowResizeHandler();

	// add an event listener to invoke the resize handler
	window.addEventListener( "resize", this.windowResizeHandler, false );
	// add event listeners to invoke the mouse/touch handlers
	this.visible.addEventListener( "mousedown", this.mouseDownEventHandler, false );
	this.visible.addEventListener( "mouseup", this.mouseUpEventHandler, false );
	this.visible.addEventListener( "mouseout", this.mouseMoveEventHandler, false );
	this.visible.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.visible.addEventListener( "touchend", this.touchEndEventHandler, false );
	this.visible.addEventListener( "touchleave", this.touchLeaveEventHandler, false );
}

