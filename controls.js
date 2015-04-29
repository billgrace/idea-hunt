function horizontalLabel ( labelColor, labelText, hostElementId, leftPercent, topPercent, widthPercent, heightPercent ) {
	this.labelColor = labelColor;
	this.labelText = labelText;
	this.hostId = hostElementId;
	// this.host = document.getElementById( hostElementId );
	this.leftPercent = leftPercent;
	this.topPercent = topPercent;
	this.widthPercent = widthPercent;
	this.heightPercent = heightPercent;
	this.visible = document.createElement( "div" );
	this.visible.style.cssText = "position:absolute;background-color:" + this.labelColor;
	this.visible.innerHTML = this.labelText;
	document.body.appendChild( this.visible );
	var self = this;
	this.resize = function( windowElementId, left, top, width, height ) {
		var hostElement = document.getElementById( windowElementId ); 
		var hostLeft = hostElement.offsetLeft;
		var hostTop = hostElement.offsetTop;
		var hostWidth = hostElement.offsetWidth;
		var hostHeight = hostElement.offsetHeight;
		self.visible.style.left = "0" + ( ( hostLeft + ( left * hostWidth ) ) | 0 ) + "px";
		self.visible.style.top = "0" + ( ( hostTop + ( top * hostHeight ) ) | 0 ) + "px";
		self.visible.style.width = "0" + ( ( width * hostWidth ) | 0 ) + "px";
		self.visible.style.height = "0" + ( ( height * hostHeight ) | 0 ) + "px";
	}
	this.windowResizeHandler = function() {
		self.resize( self.hostId, self.leftPercent, self.topPercent, self.widthPercent, self.heightPercent );
	}
	this.resize( self.hostId, self.leftPercent, self.topPercent, self.widthPercent, self.heightPercent );
	window.addEventListener( "resize", this.windowResizeHandler, false );
};
function horizontalSlider( sliderColor, trackColor, leftLimitValue, rightLimitValue, startingValue, hostElementId, sliderRadiusPercent, trackRadiusPercent, leftLimitPercent, verticalCenterPercent, limitToLimitPercent ) {
	// "...Percent" values refer to host element width and height
	this.sliderColor = sliderColor;
	this.trackColor = trackColor;
	this.leftLimitValue = leftLimitValue;
	this.rightLimitValue = rightLimitValue;
	this.valueRange = rightValue - leftValue;
	this.currentValue = startingValue;
		this.leftLimitPixel = 0;
	this.rightLimitPixel = 0;
	this.motionPixelRange = 0;
	this.hostId = hostElementId;
	// this.host = document.getElementById( hostElementId );
	this.sliderRadiusPercent = sliderRadiusPercent;
	this.trackRadiusPercent = trackRadiusPercent;
	this.leftLimitPercent = leftLimitPercent;
	this.verticalCenterPercent = verticalCenterPercent;
	this.limitToLimitPercent = limitToLimitPercent;
	this.nowTracking = false;
	this.track = document.createElement( "div" );
	this.track.style.cssText = "position:absolute;background-color:" + this.trackColor;
	document.body.appendChild( this.track );
	this.slider = document.createElement( "div" );
	this.slider.style.cssText = "position:absolute;background-color:" + this.sliderColor;
	document.body.appendChild( this.slider );
	var self = this;
	this.resize = function( windowElementId, leftLimitPercent, verticalCenterPercent, limitToLimitPercent, sliderRadiusPercent, trackRadiusPercent ) {
		var hostElement = document.getElementById( windowElementId ); 
		var hostLeft = hostElement.offsetLeft;
		var hostTop = hostElement.offsetTop;
		var hostWidth = hostElement.offsetWidth;
		var hostHeight = hostElement.offsetHeight;
		var trackLeft = ( hostLeft + ( ( leftLimitPercent - trackRadiusPercent ) * hostWidth ) ) | 0;
		var trackTop = ( hostTop + ( ( verticalCenterPercent - trackRadiusPercent ) * hostHeight ) ) | 0;
		var trackWidth = ( ( limitToLimitPercent + 2 * trackRadiusPercent ) * hostWidth ) | 0;
		var trackRadius = ( trackRadiusPercent * hostHeight ) | 0;
		var trackHeight = ( 2 * trackRadiusPercent * hostHeight ) | 0;
		self.leftLimitPixel = ( trackLeft + trackHeight / 2 ) | 0;
		self.rightLimitPixel = (trackLeft + trackWidth - trackHeight / 2 ) | 0;
		self.motionPixelRange = self.rightLimitPixel - self.leftLimitPixel;
		var sliderHeight = ( 2 * sliderRadiusPercent * hostHeight ) | 0;
		var sliderWidth = sliderHeight;
		var sliderLeft = ( self.leftLimitPixel + ( self.motionPixelRange * ( self.currentValue / ( self.rightLimitValue - self.leftLimitValue ) ) ) - ( sliderWidth / 2 ) ) | 0;
		var sliderTop = ( hostTop + ( ( verticalCenterPercent - sliderRadiusPercent ) * hostHeight ) ) | 0;
		self.track.style.left = "0" + trackLeft + "px";
		self.track.style.top = "0" + trackTop + "px";
		self.track.style.width = "0" + trackWidth + "px";
		self.track.style.height = "0" + trackHeight + "px";
		self.track.style.borderRadius = "0" + trackRadius + "px";
		self.slider.style.left = "0" + sliderLeft + "px";
		self.slider.style.top = "0" + sliderTop + "px";
		self.slider.style.width = "0" + sliderWidth + "px";
		self.slider.style.height = "0" + sliderHeight + "px";
		self.slider.style.borderRadius = "0" + trackRadius + "px";
	}
	this.windowResizeHandler = function() {
		self.resize( self.hostId, self.leftLimitPercent, self.verticalCenterPercent, self.limitToLimitPercent, self.sliderRadiusPercent, self.trackRadiusPercent );
	}
	this.updateControlValue = function( pixelX ) {
		if( pixelX < self.leftLimitPixel ) pixelX = self.leftLimitPixel;
		if( pixelX > self.rightLimitPixel ) pixelX = self.rightLimitPixel;
		self.currentValue = self.leftLimitValue + self.valueRange * ( pixelX - self.leftLimitPixel ) / self.motionPixelRange;
		self.windowResizeHandler();
		testLabelCore.visible.innerHTML = self.currentValue | 0;
	}
	this.sliderMouseDownEventHandler = function( e ) {
		e.preventDefault();
		self.nowTracking = true;
		self.updateControlValue( e.clientX );
	}
	this.sliderMouseMoveEventHandler = function( e ) {
		e.preventDefault();
		if( !self.nowTracking ) return;
		self.updateControlValue( e.clientX );
	}
	this.sliderMouseUpEventHandler = function( e ) {
		e.preventDefault();
		self.nowTracking = false;
	}
	this.touchStartEventHandler = function( e ) {
		e.preventDefault();
		self.nowTracking = true;
		self.updateControlValue( e.touches[ 0 ].clientX );
	}
	this.touchMoveEventHandler = function( e ) {
		e.preventDefault();
		if( !self.nowTracking ) return;
		self.updateControlValue( e.touches[ 0 ].clientX );
	}
	this.touchEndEventHandler = function( e ) {
		e.preventDefault();
		self.nowTracking = false;
	}
	this.resize( self.hostId, self.leftLimitPercent, self.verticalCenterPercent, self.limitToLimitPercent, self.sliderRadiusPercent, self.trackRadiusPercent );
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
	window.addEventListener( "resize", this.windowResizeHandler, false );
}
function simpleButton( buttonColor, hostElementId, leftPercent, topPercent, widthPercent, heightPercent, handler ) {
	// buttonColor is a text color specifier: "#ff0088"
	// host is the text id of the div into which button is placed
	// left-, top-, width- and heightPercent are floats = button's percentage of corresponding host div
	this.buttonColor = buttonColor;
	this.hostId = hostElementId;
	this.host = document.getElementById( hostElementId );
	this.leftPercent = leftPercent;
	this.topPercent = topPercent;
	this.widthPercent = widthPercent;
	this.heightPercent = heightPercent;
	this.visible = document.createElement( "div" );
	this.visible.style.cssText = "position:absolute;background-color:" + buttonColor;
	document.body.appendChild( this.visible );
	this.buttonDown = false;
	this.startingX = 0;
	this.startingY = 0;
	this.dragX = 0;
	this.dragY = 0;
	var self = this;
	this.resize = function( windowElementId, left, top, width, height ) {
		var hostElement = document.getElementById( windowElementId ); 
		var hostLeft = hostElement.offsetLeft;
		var hostTop = hostElement.offsetTop;
		var hostWidth = hostElement.offsetWidth;
		var hostHeight = hostElement.offsetHeight;
		self.visible.style.left = "0" + ( ( hostLeft + ( left * hostWidth ) ) | 0 ) + "px";
		self.visible.style.top = "0" + ( ( hostTop + ( top * hostHeight ) ) | 0 ) + "px";
		self.visible.style.width = "0" + ( ( width * hostWidth ) | 0 ) + "px";
		self.visible.style.height = "0" + ( ( height * hostHeight ) | 0 ) + "px";
	}
	this.windowResizeHandler = function() {
		self.resize( self.hostId, self.leftLimitPercent, self.verticalCenterPercent, self.limitToLimitPercent, self.sliderRadiusPercent, self.trackRadiusPercent  );
	}
	this.mouseDownEventHandler = function( e ) {
		handler( "click" );
	}
	this.mouseMoveEventHandler = function( e ) {
	}
	this.mouseUpEventHandler = function( e ) {
	}
	this.touchStartEventHandler = function( e ) {
		event.preventDefault();
		handler( "touch" );
	}
	this.touchMoveEventHandler = function( e ) {
		event.preventDefault();
	}
	this.touchEndEventHandler = function( e ) {
		event.preventDefault();
	}
	this.resize( self.hostId, self.leftPercent, self.topPercent, self.widthPercent, self.heightPercent );
	window.addEventListener( "resize", this.windowResizeHandler, false );
	this.visible.addEventListener( "mousedown", this.mouseDownEventHandler, false );
	this.visible.addEventListener( "mousemove", this.mouseMoveEventHandler, false );
	this.visible.addEventListener( "mouseup", this.mouseUpEventHandler, false );
	this.visible.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.visible.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	this.visible.addEventListener( "touchend", this.touchEndEventHandler, false );
}
