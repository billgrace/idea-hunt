/*
 * motion.js
 *
 * @author billgrace / http://billgrace.com
 *
 */

function trackPlayerMeshPartPositionsToPlayerMeshPosition() {
	selfHeadMesh.position.addVectors( selfMeshPosition, selfHeadOffset );
	selfHairMesh.position.addVectors( selfMeshPosition, selfHairOffset );
	selfHatMesh.position.addVectors( selfMeshPosition, selfHatOffset );
	selfTorsoMesh.position.addVectors( selfMeshPosition, selfTorsoOffset );
	flyerMesh.position.addVectors( selfMeshPosition, flyerOffset );

	// // First rotate the player part offsets according to the current player orientation
	// // then apply the rotated offsets to determine the individual part positions
	// var playerOrientationRotationQuaternion = new THREE.Quaternion();
	// var selfHeadRotatedOffset = new THREE.Vector3();
	// var selfHairRotatedOffset = new THREE.Vector3();
	// var selfHatRotatedOffset = new THREE.Vector3();
	// var selfTorsoRotatedOffset = new THREE.Vector3();
	// var flyerRotatedOffset = new THREE.Vector3();
	// playerOrientationRotationQuaternion.copy( selfMeshOrientation );
	// playerOrientationRotationQuaternion.normalize();
	// selfHeadRotatedOffset.copy( selfHeadOffset );
	// selfHairRotatedOffset.copy( selfHairOffset );
	// selfHatRotatedOffset.copy( selfHatOffset );
	// selfTorsoRotatedOffset.copy( selfTorsoOffset );
	// flyerRotatedOffset.copy( flyerOffset );
	// selfHeadRotatedOffset.applyQuaternion( playerOrientationRotationQuaternion );
	// selfHairRotatedOffset.applyQuaternion( playerOrientationRotationQuaternion );
	// selfHatRotatedOffset.applyQuaternion( playerOrientationRotationQuaternion );
	// selfTorsoRotatedOffset.applyQuaternion( playerOrientationRotationQuaternion );
	// flyerRotatedOffset.applyQuaternion( playerOrientationRotationQuaternion );
	// selfHeadMesh.position.addVectors( selfMeshPosition, selfHeadRotatedOffset );
	// selfHairMesh.position.addVectors( selfMeshPosition, selfHairRotatedOffset );
	// selfHatMesh.position.addVectors( selfMeshPosition, selfHatRotatedOffset );
	// selfTorsoMesh.position.addVectors( selfMeshPosition, selfTorsoRotatedOffset );
	// flyerMesh.position.addVectors( selfMeshPosition, flyerRotatedOffset );
}
// function trackPlayerMeshPartOrientationsToPlayerMeshOrientation() {
// 	selfHeadMesh.quaternion.copy( selfMeshOrientation );
// 	selfHairMesh.quaternion.copy( selfMeshOrientation );
// 	selfHatMesh.quaternion.copy( selfMeshOrientation );
// 	selfTorsoMesh.quaternion.copy( selfMeshOrientation );
// 	flyerMesh.quaternion.copy( selfMeshOrientation );
// }
function trackPlayerMeshPositionToPlayerBodyPosition() {
	// move the player rendering meshes to match the position of the player physics body
	selfMeshPosition.copy( selfBody.position );
	trackPlayerMeshPartPositionsToPlayerMeshPosition();
}
// function trackPlayerBodyOrientationToPlayerMeshOrientation() {
// 	// orient the player physics body to match the orientation of the player rendering meshes
// 	selfBody.quaternion.copy( selfMeshOrientation );
// }

// function trackPlayerBodyVelocityToPlayerMeshPlusZAxis() {
// 	var meshOrientationQuaternion = new THREE.Quaternion();
// 	var newVelocityVector = new THREE.Vector3();
// 	var desiredSpeed;
// 	var locallyOrientedPlusZAxis = new THREE.Vector3();
// 	// Start with a global +ve Z-axis
// 	locallyOrientedPlusZAxis.set( 0, 0, 1 );
// 	// Get the mesh's orientation quaternion
// 	// meshOrientationQuaternion.copy( t3Mesh.quaternion );
// 	meshOrientationQuaternion.copy( selfMeshOrientation );
// 	// Apply the mesh's orientation to the global plus-Z axis to get a local, mesh-centric plus-Z axis
// 	locallyOrientedPlusZAxis.applyQuaternion( meshOrientationQuaternion.normalize() );
// 	// Store this vector's direction information in a global variable
// 	roamingVelocityVector.copy( locallyOrientedPlusZAxis );
// 	// Now apply the currently desired speed to this direction to make the body's new velocity vector
// 	// // Cube the desired speed to give some non-linear snappiness to the control while retaining the forward/backward sign value
// 	// desiredSpeed = roamingCurrentSpeedScalar * roamingCurrentSpeedScalar * roamingCurrentSpeedScalar;
// 	// Give the linear control a more quadratic response
// 	desiredSpeed = squareButRetainSign( roamingCurrentSpeedScalar * roamingSpeedMultplier );
// 	newVelocityVector.copy( roamingVelocityVector );
// 	newVelocityVector.normalize();
// 	// negate the applied speed scalar since "frontwards" is in the negative z-axis direction....
// 	newVelocityVector.multiplyScalar( -desiredSpeed );
// 	// copy the new, complete velocity vector to the body
// 	selfBody.velocity.copy( newVelocityVector );
// 	// copy the mesh's orientation to the body
// 	// caBody.quaternion.copy( t3Mesh.quaternion );
// 	selfBody.quaternion.copy( selfMeshOrientation );
// }
// The velocity of a CANNON.JS body is a 3-d vector with coordinates relative to the world... regardless of body orientation.
// The velocity of a CANNON.JS body may be freely adjusted in the "preStep" callback routine
// The position of a CANNON.JS body is updated by calls to the "world.step" routine which applies the effects of velocity, forces, constraints, etc.
// The positions of CANNON.JS bodies and THREE.JS meshes may be freely copied back and forth as mesh.position.copy( body.position ) & vice versa
// The orientations of CANNON.JS bodies and THREE.JS meshes may be freely copied back and forth as mesh.quaternion.copy( body.quaternion) & vice versa
// Our flight control scheme amounts to:
//  - user navigation controls adjust the orientation of the THREE mesh
//  - - "right" and "left" become "yaw" which is rotation around the mesh's local vertical ( Y ) axis
//  - - "up" and "down" become "pitch" which is rotation around the mesh's local "left/right" horizontal ( X ) axis
//  - user speed control adjusts the magnitude of the CANNON body's velocity
//  - - "forward" speed applies a positive scalar value to the velocity vector which always points in the direction of the body's local "frontward" direction
//  - - "backward" speed applies a negative scalar value to the velocity vector
//  - - "stand still" is just between "forward" and "backward" and will likely be approached rather than actually reached.
//  - - we're going to simply ignore the issue of "roll" such as an airplane uses during yawing which keeps apparent gravity facing "down" for passengers
//  - - we're also going to simply ignore gravity by setting it to zero (this may change...)
//  - in the animate() routine, just before calling the processPhysics() routine, we sample user controls and adjust
//  -    the mesh orientation accordingly in the trackBodyVelocityToMeshPlusZAxis() routine
//  - we insert an "updateVelocity" routine as the pre-step callback for the CANNON world.step() routine and use this to adjust the
//  -    body velocity to point in the direction of the mesh orientation "frontwards" and scale the velocity according to the speed control
//  - then in the processPhysics() routine's world.step(), CANNON physics sets the CANNON body's position
//  - after the physics call, the THREE mesh's position is copied from the CANNON body's position using trackMeshPositionToBodyPosition()
//  - finally, the CANNON body's orientation is copied from the THREE mesh's orientation using trackBodyOrientationToMeshOrientation()

// Set of 4 functions to rotate a mesh with respect to the current orientation of the mesh
// ... and ignoring the global axes of the scene.
// The mesh-centric orientation (picture yourself sitting inside it just after it is first created) is:
//  X-axis positive is to the right and negative is to the left
//  Y-axis positive is up and negative is down
//  Z-axis positive is toward the rear and negative is toward the front
// So, "pitch" amounts to tipping backward for positive angles and tipping forward for negative angles (because we "pitch" around the x-axis)
//  and "yaw" amounts to turning left for positive angles and turning right for negative angles (because we "yaw" around the y-axis)
//  and "roll" amounts to tipping left for positive angles and tipping right for negative angles (because we "roll" around the z-axis)
// function rotatePlayerMesh( rotationAxis, angleInRadians ) {
// 	var rotationQuaterion = new THREE.Quaternion();
// 	var meshOrientationQuaternion = new THREE.Quaternion();
// 	// apply the mesh's current orientation to the supplied rotation axis to convert it from a "world-centric" to a "mesh-centric" axis
// 	rotationAxis.applyQuaternion( selfMeshOrientation.normalize() );
// 	// create a quaternion representing the supplied angle being rotated around the now-mesh-centric axis of rotation
// 	rotationQuaterion.setFromAxisAngle( rotationAxis, angleInRadians );
// 	// get the quaternion representing the current orientation of the mesh
// 	meshOrientationQuaternion = selfMeshOrientation;
// 	// apply the desired rotation quaternion to the current orientation quaternion to make it become the desired new orientation quaternion
// 	meshOrientationQuaternion.multiplyQuaternions( rotationQuaterion, meshOrientationQuaternion );
// 	// normalize the new orientation quaterion
// 	meshOrientationQuaternion.normalize();
// 	// apply the new orientation quaternion to the mesh
// 	trackPlayerMeshPartOrientationsToPlayerMeshOrientation();
// }
// function pitchPlayerMesh( angleInRadians ) {
// 	// create an X-axis so the ensuing rotation will be a pitch
// 	var pitchAxis = new THREE.Vector3( 1, 0, 0 );
// 	// call the common routine with this axis of rotation
// 	rotatePlayerMesh( pitchAxis, angleInRadians );
// }
// function yawPlayerMesh( angleInRadians ) {
// 	// create a Y-axis so the ensuing rotation will be a yaw
// 	var yawAxis = new THREE.Vector3( 0, 1, 0 );
// 	// call the common routine with this axis of rotation
// 	rotatePlayerMesh( yawAxis, angleInRadians );
// }
// function rollPlayerMesh( angleInRadians ) {
// 	// create a Z-axis so the ensuing rotation will be a roll
// 	var rollAxis = new THREE.Vector3( 0, 0, 1 );
// 	// call the common routine with this axis of rotation
// 	rotatePlayerMesh( rollAxis, angleInRadians );
// }
// function preStepHookRoutine() {
// 	// Check the user controls and update the mesh orientation and desired speed settings
// 	roamingButtonPoller();
// 	// Update the direction of the body velocity according to the now-current mesh orientation
// 	trackPlayerBodyVelocityToPlayerMeshPlusZAxis();
// }
// function processPhysics() {
// 	var timeStep = 1 / 60;
// 	caWorld.step( timeStep );
// 	trackPlayerMeshPositionToPlayerBodyPosition();
// 	trackPlayerBodyOrientationToPlayerMeshOrientation();
// 	trackTheCameraToSelfMesh();
// }
function animate() {
	switch( currentGameScreen ) {
		case gameScreens.initialLoadingScreen:
			if( 0 == initialLoadingSemaphore ) {
				buildItemsWaitingForLoadComplete();
				galleryOfPlayers = new playerGallery();
				addSelfToScene();
				// switchToScreen( gameScreens.choosePlayer );
				switchToScreen( gameScreens.launch );
			}
			break;
		case gameScreens.choosePlayer:
			orbitControls.update();
			render();
			break;
		case gameScreens.launch:
			orbitControls.update();
			render();
			break;
		case gameScreens.roaming:
			// processPhysics();
			roamingButtonPoller();
			trackTheCameraToSelfMesh();
			orbitControls.update();
			render();
			break;
		default:
			return;
			break;
	}
	if( debuggingModeIsOn ) {
		stats.update();
		debugShowSelfGeometry();
		// cannonDebugThreeJsOutliner.update();
	}
	requestAnimationFrame( animate );
	frames++;
	if( frames > 59 ) {
		frames = 0;
		seconds++;
		if( seconds > 59 ) {
			seconds = 0;
			minutes++;
			if( minutes > 59 ) {
				minutes = 0;
				hours++;
				if( hours > 23 ) {
					hours = 0;
					days++;
				}
			}
		}
	}
}
function debugShowSelfGeometry() {
	// devMsg.innerHTML = "scene.children: " + scene.children;
}

