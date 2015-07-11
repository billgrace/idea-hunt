/*
 * eventHandlers.js
 *
 * @author billgrace / http://billgrace.com
 *
 */

// Global events
function onWindowResize() {
	updateRenderingGeometry();
	render();
}

// Choose player screen events
function choosePlayerCreateNewClickHandler( e ) {
	if( currentGameScreen != gameScreens.choosePlayer ) return;
	newPlayerBeingCreated = true;
	switchToScreen( gameScreens.editPlayer );
	}
function choosePlayerMakeChangesClickHandler( e ) {
	if( currentGameScreen != gameScreens.choosePlayer ) return;
	newPlayerBeingCreated = false;
	switchToScreen( gameScreens.editPlayer );
	}
function choosePlayerPlayWithClickHandler( e ) {
	if( currentGameScreen != gameScreens.choosePlayer ) return;
	switchToScreen( gameScreens.launch );
	}
// Edit player screen events
function editPlayerCancelClickHandler( e ) {
	if( currentGameScreen != gameScreens.editPlayer ) return;
	switchToScreen( gameScreens.choosePlayer );
	}
function editPlayerSaveClickHandler( e ) {
	if( currentGameScreen != gameScreens.editPlayer ) return;
	switchToScreen( gameScreens.choosePlayer );
	}
// Launch screen events
function launchButtonClickHandler( e ) {
	if( currentGameScreen != gameScreens.launch ) return;
	selfBodyLaunchSpeed = -100 * launchPowerSlider.currentValue;
	roamingCurrentSpeedScalar = launchPowerSlider.currentValue / 2.0;
	selfBody.velocity.set( 0, 0, selfBodyLaunchSpeed );
	selfBodyLaunchVelocity.copy( selfBody.velocity );
	launcherPusherMesh.position.copy( launcherPusherMeshHomePosition );
	launchPowerSlider.setSlider( launchPowerSlider.homeValue );
	launchStartCameraSelfConvergenceAnimationCounter = launchStartCameraSelfConvergenceAnimationCount;
	trackTheCameraToSelfMesh();
	switchToScreen( gameScreens.roaming );
}
function launchPowerSliderChangeHandler( e ) {
	if( currentGameScreen != gameScreens.launch ) return;
	var launchPower = launchPowerSlider.currentValue;
	launchPowerMeter.updateText( launchPower.toFixed( 0 ) + "%" );
	launcherPusherMesh.position.addVectors( launcherPusherMeshHomePosition, new THREE.Vector3( 0, 0, 5 * launchPower ) );
	selfMeshPosition.addVectors( launcherPusherMesh.position, launcherPusherOffset );
	trackPlayerMeshPartPositionsToPlayerMeshPosition();
}
// Roaming screen events
function squareButRetainSign( argument ) {
	var returnMagnitude = argument * argument;
	if( argument < 0.0 )
		return -returnMagnitude;
	else
		return returnMagnitude;
}
function figureTerrainElevationAt( x, z ) {
	// find 4 terrain vertices surrounding horizontal point x, z & return the average elevation of those points
	return 0;
}
function roamingButtonPoller() {
	if( roamingDirectionButton.buttonDown ) {
		// While the direction button is being pressed, continuously apply horizontal motion
		var leftRightDistance = ( roamingDirectionButton.touchPointX - 50.0 ) * roamingMaxLeftRightChange;
		var frontBackDistance = ( roamingDirectionButton.touchPointY - 50.0 ) * roamingMaxFrontBackChange;
		selfMeshPosition.x += leftRightDistance;
		selfMeshPosition.z += frontBackDistance;
		selfMeshPosition.y = figureTerrainElevationAt( selfMeshPosition.x, selfMeshPosition.z );
	}
	// if( roamingLeftRightButton.buttonDown ) {
	// 	// While the left/right button is being pressed, continuously apply yaw to the self
	// 	var turnRate = ( roamingLeftRightButton.touchPointX - 50.0 ) * roamingMaxYawChange;
	// 	// Give the linear control a more quadratic response
	// 	turnRate = squareButRetainSign( turnRate );
	// 	yawPlayerMesh( -turnRate );
	// }
	// if( roamingUpDownButton.buttonDown ) {
	// 	// while the up/down button is being pressed, continuously apply pitch to the self
	// 	var turnRate = ( roamingUpDownButton.touchPointY - 50.0 ) * roamingMaxPitchChange;
	// 	// Give the linear control a more quadratic response
	// 	turnRate = squareButRetainSign( turnRate );
	// 	pitchPlayerMesh( -turnRate );
	// }
	// if( roamingSpeedButton.buttonDown ) {
	// 	// While the speed button is being pressed, continuously update the self speed
	// 	// The speed control .touchPointX can range from 0.0 (full-speed backwards) to 100.0 (full speed forward) with 50.0 representing "standing still"
	// 	// We convert this raw control value into "50.0 to just-less-than-0.0 backwards" and "0.0 to 50.0 frontwards"
	// 	var desiredSpeed = roamingSpeedButton.touchPointX - 50.0;
	// 	// keep a copy for later use by the routine that orients the self mesh, body and camera to track with the velocity
	// 	// ...( when the speed is less than zero, i.e. "backwards", the velocity and orientation point in opposite directions)
	// 	roamingCurrentSpeedScalar = desiredSpeed;
	// 	// // // Cube the desired speed to give some non-linear snappiness to the control while retaining the forward/backward sign value
	// 	// // desiredSpeed = desiredSpeed * desiredSpeed * desiredSpeed;
	// 	// // Give the linear control a more quadratic response
	// 	// desiredSpeed = squareButRetainSign( desiredSpeed * roamingSpeedMultplier );
	// 	// // Set the self's velocity to this speed in the direction of the self's present "frontwards"
	// 	// setVelocityToGivenSpeed( selfBody, selfMesh, desiredSpeed );
	// }
}
function roamingBackButtonClickHandler( e ) {
	if( currentGameScreen != gameScreens.roaming ) return;
	selfBody.velocity.set( 0, 0, 0 );
	selfBody.position.copy( selfBodyHomePosition );
	trackPlayerMeshPositionToPlayerBodyPosition();
	selfMeshOrientation.set( 0, 0, 0, 1 );
	// trackPlayerBodyOrientationToPlayerMeshOrientation();
	setMeshPartsOpacityTo( 1.0 );
	flyerMaterial.opacity = 1.0;
	homeTheCamera();
	switchToScreen( gameScreens.launch );
}
function roamingPauseButtonClickHandler( e ) {
	if( currentGameScreen != gameScreens.roaming ) return;
}
function roamingSpeedButtonClickHandler( e ) {
	if( currentGameScreen != gameScreens.roaming ) return;
}
// function roamingLeftRightButtonClickHandler( e ) {
// 	if( currentGameScreen != gameScreens.roaming ) return;
// }
function roamingDirectionButtonClickHandler( e ) {
	if( currentGameScreen != gameScreens.roaming ) return;
}
function roamingUpDownButtonClickHandler( e ) {
	if( currentGameScreen != gameScreens.roaming ) return;
}
function roamingShootButtonClickHandler( e ) {
	if( currentGameScreen != gameScreens.roaming ) return;
}
function roamingGraspButtonClickHandler( e ) {
	if( currentGameScreen != gameScreens.roaming ) return;
}

// Event handler initialization at program start
function initEventHandlers() {
	window.addEventListener( "resize", onWindowResize, false );
	window.addEventListener( "orientationchange", onWindowResize, false );
}
