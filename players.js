/* players.js
 *
 * @author billgrace / http://billgrace.com
 *
 */

/*
 * player creation and mainenance
 * routines to allow a player to create his/her custom self for game playing
 *
 * - view all players and select one for a game
 * - create a new player, delete (de-activate) a player, edit a player
 */

/*
 * an IndexedDb object store for player information is named "ideahunt.players"
 * each player has:
 *  a text name
 *  a choice of self image:
 *   - one of several stock JPG images built into the game
 *   - or "custom" with a player-supplied JPG image
 *  self image is a JPG 150 pixels wide, 225 pixels high
 */
// IdeaHuntPlayerGallery makes the gallery of known players.
// Players can be added, made dormant (??? deleted permanently ???) and modified.
// The gallery of players can be stored and loaded from local database storage.
// One of the players in the gallery can be selected as the player to play the game.
// Each time the game is loaded a single playerGallery is instantiated.
function IdeaHuntPlayerGallery() {
	var inst = this;
	// make a variable to allow the text box to become dormant
	this.playerGalleryIsDormant = true;
	this.playerGalleryIsBeingTouched = false;
	this.playerGalleryBackgroundColor = "#40c080";
	this.playerGalleryWidth = 0;
	this.playerGalleryHeight = 0;
	this.playerGalleryWindowWidth = 0;
	this.playerGalleryMugShotWidth = 0;
	this.playerGalleryMugShotHeight = 0;
	this.lastUsedPlayerMugShot = 0;
	this.currentlySelectedPlayerMugShotIndex = 0;
	this.currentlySelectedPlayerName = "nemo";
	this.playerGalleryAspects = {
		wide: "wide",
		medium: "medium",
		narrow: "narrow"
	};
	this.playerGalleryAspect = this.playerGalleryAspects.medium;
	this.playerGalleryTotalNumberOfMugShots = 0;
	this.playerGalleryVisibleNumberOfMugShots = 0;
	this.playerGalleryVisibleMugShotOffset = 0;
	this.playerGalleryDiv = document.createElement( "div" );
	this.playerGalleryDiv.id = "playerGalleryDivId";
	this.playerGalleryDiv.style.display = "none";
	choosePlayerScreenDiv.appendChild( this.playerGalleryDiv );
	this.playerGalleryDiv.style.cssText = "position:absolute;overflow:hidden";
	this.playerGalleryDiv.style.backgroundColor = this.playerGalleryBackgroundColor;
	this.playerGalleryLeftMask = document.createElement( "div" );
	this.playerGalleryLeftMask.id = "playerGalleryLeftMaskId";
	this.playerGalleryDiv.appendChild( this.playerGalleryLeftMask );
	this.playerGalleryLeftMask.style.cssText = "position:absolute;z-index:1";
	this.playerGalleryLeftMask.style.backgroundColor = this.playerGalleryBackgroundColor;
	this.playerGalleryRightMask = document.createElement( "div" );
	this.playerGalleryRightMask.id = "playerGalleryRightMaskId";
	this.playerGalleryDiv.appendChild( this.playerGalleryRightMask );
	this.playerGalleryRightMask.style.cssText = "position:absolute;z-index:1";
	this.playerGalleryRightMask.style.backgroundColor = this.playerGalleryBackgroundColor;
	this.playerGalleryTouchStartPoint;
	this.playerGalleryTouchStartTime;
	this.playerGalleryVelocity = 0;
	this.selfNameList = [];
	this.playerMugShotList = [];

	this.onPlayerMugMouseDown = function( e ) {
		var clickedPlayerMugShotIndex = parseInt( e.currentTarget.id.substring( 13 ) );
		for( var i = 0; i < inst.playerGalleryTotalNumberOfMugShots; i++ )
			inst.playerMugShotList[ i ].isSelected = false;
		inst.currentlySelectedPlayerMugShotIndex = clickedPlayerMugShotIndex;
		inst.currentlySelectedPlayerName = inst.selfNameList[ inst.currentlySelectedPlayerMugShotIndex ];
		inst.playerMugShotList[ clickedPlayerMugShotIndex ].isSelected = true;
	}
	this.fetchPlayerMugShotCollection = function() {
		inst.selfNameList.push( 'Happy', 'Sleepy', 'Sad', 'Grumpy', 'Dopey', 'Atsign', 'Copyright', 'Omega', 'Oomlaut-O', 'Theta' );
		inst.playerGalleryTotalNumberOfMugShots = inst.selfNameList.length;
		for( var i = 0; i < inst.playerGalleryTotalNumberOfMugShots; i++ ) {
			inst.playerMugShotList.push( new playerMugShot( inst.selfNameList[ i ], "playerGalleryDivId" ) );
			inst.playerMugShotList[ i ].cntnr.id = "playerMugShot" + i;
			inst.playerMugShotList[ i ].cntnr.addEventListener( "mousedown", inst.onPlayerMugMouseDown );
			inst.playerMugShotList[ i ].cntnr.addEventListener( "touchstart", inst.onPlayerMugMouseDown );
		}
		// inst.aPlayerMugShotIsCurrentlySelected = false;
		inst.playerGalleryVisibleMugShotsOffset = 0.0;
		inst.lastUsedPlayerMugShot = 0;
		inst.currentlySelectedPlayerMugShotIndex = 0;
		inst.currentlySelectedPlayerName = inst.selfNameList[ inst.currentlySelectedPlayerMugShotIndex ];
		inst.playerMugShotList[ 0 ].isSelected = true;
	}

	this.storePlayerMugShotCollection = function() {
	}
	this.sizeThePlayerGallery = function() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;
		var winAspectRatio = winWidth / winHeight;
		if( winAspectRatio > 1.5 ) {
			// wide
			inst.playerGalleryAspect = inst.playerGalleryAspects.wide;
			inst.playerGalleryVisibleNumberOfMugShots = 5;
			inst.playerGalleryHeight = ( ( 0.4 * winHeight ) | 0 );
			inst.playerMugShotHeight = inst.playerGalleryHeight;
			inst.playerMugShotWidth = ( ( inst.playerMugShotHeight / 2 ) | 0 );
			inst.playerGalleryWindowWidth = ( ( inst.playerMugShotWidth * inst.playerGalleryVisibleNumberOfMugShots ) | 0 );
			inst.playerGalleryWidth = ( ( inst.playerGalleryWindowWidth + inst.playerMugShotWidth * 2 ) | 0 );
		} else  if( winAspectRatio > 0.95 ) {
			// medium
			inst.playerGalleryAspect = inst.playerGalleryAspects.medium;
			inst.playerGalleryVisibleNumberOfMugShots = 4;
			inst.playerGalleryWidth = ( ( 0.9 * winWidth ) | 0 );
			inst.playerMugShotWidth = ( ( inst.playerGalleryWidth / ( inst.playerGalleryVisibleNumberOfMugShots + 2 ) ) | 0 );
			inst.playerMugShotHeight = ( inst.playerMugShotWidth * 2 ) | 0;
			inst.playerGalleryWindowWidth = ( inst.playerMugShotWidth * inst.playerGalleryVisibleNumberOfMugShots ) | 0;
			inst.playerGalleryHeight = inst.playerMugShotHeight;
		} else {
			// narrow
			inst.playerGalleryAspect = inst.playerGalleryAspects.narrow;
			inst.playerGalleryVisibleNumberOfMugShots = 3;
			inst.playerGalleryWidth = ( ( 0.95 * winWidth ) | 0 );
			inst.playerMugShotWidth = ( ( inst.playerGalleryWidth / ( inst.playerGalleryVisibleNumberOfMugShots + 2 ) ) | 0 );
			inst.playerMugShotHeight = ( ( 2 * inst.playerMugShotWidth ) | 0 );
			inst.playerGalleryHeight = inst.playerMugShotHeight;
			inst.playerGalleryWindowWidth = ( ( inst.playerMugShotWidth * inst.playerGalleryVisibleNumberOfMugShots ) | 0 );
		}
		inst.playerGalleryLeftMask.style.height = inst.playerGalleryRightMask.style.height = inst.playerGalleryDiv.style.height = "0" + inst.playerGalleryHeight + "px";
		inst.playerGalleryDiv.style.top = "0" + ( ( 0.1 * winHeight ) | 0 ) + "px";
		inst.playerGalleryLeftMask.style.top = inst.playerGalleryRightMask.style.top = "0px";
		inst.playerGalleryDiv.style.width = "0" + inst.playerGalleryWidth + "px";
		inst.playerGalleryLeftMask.style.width = inst.playerGalleryRightMask.style.width = "0" + ( inst.playerMugShotWidth | 0 ) + "px";
		inst.playerGalleryDiv.style.left = "0" + ( ( ( winWidth - inst.playerGalleryWidth ) / 2 ) | 0 ) + "px";
		inst.playerGalleryLeftMask.style.left = "0px";
		inst.playerGalleryRightMask.style.left = "0" + ( ( inst.playerGalleryWidth - inst.playerMugShotWidth ) | 0 ) + "px";
	}
	this.hideThePlayerGallery = function() {
		inst.playerGalleryDiv.style.display = "none";
		inst.playerGalleryIsDormant = true;
	}
	this.changePlayerGalleryOffset = function( changeAmount ) {
		inst.playerGalleryVisibleMugShotsOffset += changeAmount;
		if( inst.playerGalleryVisibleMugShotsOffset >= inst.playerGalleryTotalNumberOfMugShots ) {
			inst.playerGalleryVisibleMugShotsOffset -= inst.playerGalleryTotalNumberOfMugShots;
		}
		if( inst.playerGalleryVisibleMugShotsOffset < 0 ) {
			inst.playerGalleryVisibleMugShotsOffset +=  inst.playerGalleryTotalNumberOfMugShots;
		}
	}
	this.showThePlayerGallery = function() {
		// Make the gallery visible
		inst.playerGalleryDiv.style.display = "block";
		inst.playerGalleryIsDormant = false;
		// On the entire line of mugshots, those with index less than the integer part of offset are hidden "to the left".
		// ...those with index greater than the integer part of offset PLUS the visible width (measured in mugshots) are hidden "to the right".
		// ...those between these two get displayed.
		// Minimum value of offset is zero which puts index[0] mugshot at left of visible width
		// Maximum value of offset is (almost) the number of mug shots, so when offset is more
		//  than number of mug shots less visible gallery width, some mug shots from the lowest
		//  index positions must be appended to the visible end of the array to provide the
		//  effect of rolling right past the upper boundary.
		// When incrementing offset actually hits the number of mug shots + 1, it becomes zero again.
		// When decrementing offset actually drops below zero, it gets the number of mug shots + 1 added to it.
		var offsetInteger = inst.playerGalleryVisibleMugShotsOffset | 0;
		var offsetFraction = inst.playerGalleryVisibleMugShotsOffset - offsetInteger;
		// if total mugshots <= visible#mugshots simply show them all, centered in the window
		// else for offset up to offset + visible#, show mugshots with starters substituting for indexes beyond number on list
		if( inst.playerGalleryTotalNumberOfMugShots <= inst.playerGalleryVisibleNumberOfMugShots ) {
			// no motion, just show them all centered in the window
		} else {
			// allow changing offset to scroll the mugshot list around in the visible window
			// first turn off any mugshots "left of" offset
			for( var i = 0; i < offsetInteger; i++ ) {
				inst.playerMugShotList[ i ].cntnr.style.display = "none";
			}
			// now turn on the mugshots belonging in the window and place them
			for( var i = offsetInteger; i <= ( offsetInteger + inst.playerGalleryVisibleNumberOfMugShots + 1 ); i++ ) {
				if( i < inst.playerGalleryTotalNumberOfMugShots )
					var j = i;
				else
					var j = i - inst.playerGalleryTotalNumberOfMugShots;
				inst.playerMugShotList[ j ].cntnr.style.display = "block";
				inst.playerMugShotList[ j ].cntnr.style.top = "0px";
				inst.playerMugShotList[ j ].cntnr.style.height = "0" + ( inst.playerMugShotHeight ) + "px";
				inst.playerMugShotList[ j ].cntnr.style.width = "0" + ( inst.playerMugShotWidth ) + "px";
				inst.playerMugShotList[ j ].cntnr.style.left = "0" + ( inst.playerMugShotWidth * ( 1 + i - offsetInteger - offsetFraction ) | 0 ) + "px";
				if( inst.playerMugShotList[ j ].isSelected )
					inst.playerMugShotList[ j ].cntnr.style.borderWidth = "2px";
				else
					inst.playerMugShotList[ j ].cntnr.style.borderWidth = "0px";
			}
			// lastly, turn off any mugshots to the "right of" the window
			for( var i = ( offsetInteger + inst.playerGalleryVisibleNumberOfMugShots + 1 ); i < inst.playerGalleryTotalNumberOfMugShots; i++ ) {
				inst.playerMugShotList[ i ].cntnr.style.display = "none";
			}
		}
	}

	this.onWindowResize = function() {
		if( inst.playerGalleryIsDormant ) return;
		inst.sizeThePlayerGallery();
		inst.showThePlayerGallery();
	}

	this.onPlayerGalleryMouseDown = function( e ) {
		e.preventDefault();
		inst.playerGalleryIsBeingTouched = true;
		inst.playerGalleryTouchStartPoint = e.clientX;
		inst.playerGalleryTouchStartTime = Date.now()
		inst.playerGalleryVelocity = 0;
	}
	this.onPlayerGalleryMouseMove = function( e ) {
		if( !inst.playerGalleryIsBeingTouched ) return;
		e.preventDefault();
		var playerGalleryCurrentTouchPoint = e.clientX;
		var playerGalleryCurrentTouchTime = Date.now();
		if( playerGalleryCurrentTouchTime == inst.playerGalleryTouchStartTime ) return;
		inst.playerGalleryVelocity = -2 * ( playerGalleryCurrentTouchPoint - inst.playerGalleryTouchStartPoint ) / ( playerGalleryCurrentTouchTime - inst.playerGalleryTouchStartTime )
	}
	this.onWindowMouseUp = function( e ) {
		e.preventDefault();
		inst.playerGalleryIsBeingTouched = false;
	}
	this.onPlayerGalleryTouchStart = function( e ) {
		e.preventDefault();
		inst.playerGalleryIsBeingTouched = true;
		inst.playerGalleryTouchStartPoint = e.touches[ 0 ].clientX;
		inst.playerGalleryTouchStartTime = Date.now()
		inst.playerGalleryVelocity = 0;
	}
	this.onPlayerGalleryTouchMove = function( e ) {
		if( !inst.playerGalleryIsBeingTouched ) return;
		e.preventDefault();
		var playerGalleryCurrentTouchPoint = e.touches[ 0 ].clientX;
		var playerGalleryCurrentTouchTime = Date.now();
		inst.playerGalleryVelocity = -10 * ( playerGalleryCurrentTouchPoint - inst.playerGalleryTouchStartPoint ) / ( playerGalleryCurrentTouchTime - inst.playerGalleryTouchStartTime )
	}
	this.onPlayerGalleryTouchEnd = function( e ) {
		e.preventDefault();
		inst.playerGalleryIsBeingTouched = false;
	}
	this.updateGallery = function() {
		if( !inst.playerGalleryIsDormant ) {
			inst.changePlayerGalleryOffset( inst.playerGalleryVelocity / 60 );
			inst.showThePlayerGallery();
		}
	}

	this.fetchPlayerMugShotCollection();

	window.addEventListener( "resize", this.onWindowResize, false );
	window.addEventListener( "orientationchange", this.onWindowResize, false );

	this.playerGalleryDiv.addEventListener( "mousedown", this.onPlayerGalleryMouseDown, false );
	this.playerGalleryDiv.addEventListener( "mousemove", this.onPlayerGalleryMouseMove, false );
	window.addEventListener( "mouseup", this.onWindowMouseUp, false );
	this.playerGalleryDiv.addEventListener( "touchstart", this.onPlayerGalleryTouchStart, false );
	this.playerGalleryDiv.addEventListener( "touchmove", this.onPlayerGalleryTouchMove, false );
	this.playerGalleryDiv.addEventListener( "touchend", this.onPlayerGalleryTouchEnd, false );
}

// Given a player's name, build that player's mugshot div
function playerMugShot( playerName, hostElementId ) {
	var inst = this;
	var hostElement = document.getElementById( hostElementId );
	this.cntnr = document.createElement( "div" );
	hostElement.appendChild( this.cntnr );
	this.cntnr.style.cssText = "position:absolute;border-width:0;border-style:solid;border-color:yellow";
	this.cntnr.style.display = "none";
	this.image = document.createElement( "img" );
	this.cntnr.appendChild( this.image );
	this.image.src = "art/" + playerName + ".jpg";
	this.image.style.width = "100%";
	this.image.style.height = "75%";
	this.nam = document.createElement( "div" );
	this.nam.style.cssText = "text-align:center;width:100%;height:25%;font-size:2.5vw;overflow:hidden";
	this.nam.innerHTML = playerName;
	this.cntnr.appendChild( this.nam );
	this.isSelected = false;
}
