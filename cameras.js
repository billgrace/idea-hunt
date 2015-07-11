/* cameras.js
 *
 * @author billgrace / http://billgrace.com
 *
 */

/*
 * camera handling routines for the Three.js cameras
 */

function initCamera() {
	camera = new THREE.PerspectiveCamera( 50, 1.3, 1, 1000000 );
	homeTheCamera();

	orbitElement = document.createElement( "div" );
	document.body.appendChild( orbitElement );
	orbitElement.id = "orbitElement";
	orbitElement.style.cssText = "position:absolute;display:none";

	orbitControls = new THREE.OrbitControls( camera, orbitElement );
	orbitControls.name = "orbitControls";
	orbitControls.damping = 0.2;
	orbitControls.addEventListener( 'change', render );
	orbitControls.enabled = false;
}
function homeTheCamera() {
	camera.position.set( 250, 100, 700 );
	camera.rotation.x = -Math.PI/10;
	camera.rotation.y = Math.PI/4;
	camera.rotation.z = 0;
	camera.aspect = viewWindowWidth / viewWindowHeight;
	camera.lookAt( launchCameraFocusPoint );
	cameraLaunchPosition.copy( camera.position );
	cameraLaunchOrientation.copy( camera.quaternion );
}
function setMeshPartsOpacityTo( opacity0to1 ) {
	selfHeadMaterial.opacity = opacity0to1;
	selfHairMaterial.opacity = opacity0to1;
	selfHatMaterial.opacity = opacity0to1;
	selfTorsoMaterial.opacity = opacity0to1;
}
function locateCameraBehindPlayer( howFar ) {
	// using the orientation of the player, move the camera toward the player's "rear" by the given distance
	// ... get the direction of "player's rear"
	var playerRearward = new THREE.Vector3( 0, 0, 1 );
	var meshOrientationQuaternion = new THREE.Quaternion();
	meshOrientationQuaternion.copy( selfMeshOrientation );
	playerRearward.applyQuaternion( meshOrientationQuaternion.normalize() );
	// ... scale this direction vector to the given distance
	playerRearward.normalize();
	playerRearward.multiplyScalar( howFar );
	// ... set the camera position to the player position plus the new offset vector
	camera.position.addVectors( selfMeshPosition, playerRearward );
}
function trackTheCameraToSelfMesh() {
	if( launchStartCameraSelfConvergenceAnimationCounter > 0 ) {
		// animate the view camera from its home position to the mesh's position
		// - how far behind are we in the animation? (starts at "almost entirely" and gradually moves to "not at all")
		launchStartCameraSelfConvergenceAnimationCounter--;
		var behindAmountFraction = launchStartCameraSelfConvergenceAnimationCounter / launchStartCameraSelfConvergenceAnimationCount;
		// make the animation quadratic...
		behindAmountFraction = ( behindAmountFraction * behindAmountFraction );
		var cameraPx = selfMeshPosition.x - behindAmountFraction * ( selfMeshPosition.x - cameraLaunchPosition.x );
		var cameraPy = selfMeshPosition.y - behindAmountFraction * ( selfMeshPosition.y - cameraLaunchPosition.y );
		var cameraPz = selfMeshPosition.z - behindAmountFraction * ( selfMeshPosition.z - cameraLaunchPosition.z );
		// var cameraQx = selfMeshOrientation.x - behindAmountFraction * ( selfMeshOrientation.x - cameraLaunchOrientation.x );
		// var cameraQy = selfMeshOrientation.y - behindAmountFraction * ( selfMeshOrientation.y - cameraLaunchOrientation.y );
		// var cameraQz = selfMeshOrientation.z - behindAmountFraction * ( selfMeshOrientation.z - cameraLaunchOrientation.z );
		// var cameraQw = selfMeshOrientation.w - behindAmountFraction * ( selfMeshOrientation.w - cameraLaunchOrientation.w );
		camera.position.set( cameraPx, cameraPy, cameraPz );
		camera.lookAt( selfMeshPosition );
		// locateCameraBehindPlayer( 75 );
		// camera.quaternion.set( cameraQx, cameraQy, cameraQz, cameraQw );
		// Over the last part of the animation, fade the self mesh to transparency
		// The following "fadeFactor" will start at 3.0 and move to 0.0 and provide the opacity value (1.0...0.0)
		var fadeFactor = ( launchStartCameraSelfConvergenceAnimationCounter * 3 ) / launchStartCameraSelfConvergenceAnimationCount;
		if( ( fadeFactor < 1.0 ) && ( fadeFactor > 0.5 ) ) {
		// if( fadeFactor < 1.0 ) {
			// setMeshPartsOpacityTo( fadeFactor );
		}
		if( ( fadeFactor < 1.0 ) && ( fadeFactor > 0.5 ) ) {
			// flyerMaterial.opacity = fadeFactor;
		}
	} else {
		// launch start animation is over so just track the camera to the mesh
		camera.position.copy( selfMeshPosition );
		// locateCameraBehindPlayer( 75 );
		locateCameraBehindPlayer( 575 );
		camera.lookAt( selfMeshPosition );
		// camera.quaternion.copy( selfMeshOrientation );
	}
	camera.updateProjectionMatrix();
}
function updateRenderingGeometry() {
	var windowLeftSegmentPercent;
	var windowRightSegmentPercent;
	var windowMidRightSegmentPercent;
	var windowTopSegmentPercent;
	var windowBottomSegmentPercent;
	var windowNavHeightPercent;
	var windowSelfHeightPercent;
	var Aspect;
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
	Aspect = windowWidth / windowHeight;

	if( Aspect > 1 ) {
		windowRightSegmentPercent = 10;
	} else {
		windowRightSegmentPercent = 20;
	}
	optVWindowWidth = ( ( windowWidth * windowRightSegmentPercent ) / 100 ) | 0;
	optVWindowHeight = windowHeight;
	optVWindowLeft = windowWidth - optVWindowWidth;
	optVWindowTop = 0;
	viewWindowLeft = 0;
	viewWindowTop = 0;
	viewWindowWidth = windowWidth - optVWindowWidth;
	viewWindowHeight = windowHeight;
	viewWindowBottom = viewWindowTop + viewWindowHeight;
	viewWindowRight = viewWindowLeft + viewWindowWidth;
	// selfWindowBottom = selfWindowTop + selfWindowHeight;
	// selfWindowRight = selfWindowLeft + selfWindowWidth;
	optVWindowBottom = optVWindowTop + optVWindowHeight;
	optVWindowRight = optVWindowLeft + optVWindowWidth;
	optVWindowContainer.style.left = "0"+optVWindowLeft+"px";
	optVWindowContainer.style.top = "0"+optVWindowTop+"px";
	optVWindowContainer.style.width = "0"+optVWindowWidth+"px";
	optVWindowContainer.style.height = "0"+optVWindowHeight+"px";
	orbitElement .style.left = "0"+viewWindowLeft+"px";
	orbitElement.style.top = "0"+viewWindowTop+"px";
	orbitElement.style.width = "0"+viewWindowWidth+"px";
	orbitElement.style.height = "0"+viewWindowHeight+"px";
	// orbitElement.style.display = "block";
	// orbitControls.enabled = true;
}
function render() {
	switch( currentGameScreen ) {
		case gameScreens.initialLoadingScreen:
			break;
		case gameScreens.openingScreen:
			break;
		case gameScreens.choosePlayer:
			renderer.setSize( window.innerWidth, window.innerHeight );
			camera.updateProjectionMatrix();
			renderer.render( scene, camera );
			break;
		case gameScreens.editPlayer:
			break;
		case gameScreens.savePlayerError:
			break;
		case gameScreens.browseTopics:
			break;
		case gameScreens.launch:
			renderer.setSize( window.innerWidth, window.innerHeight );
			camera.updateProjectionMatrix();
			renderer.render( scene, camera );
			break;
		case gameScreens.roaming:
			renderer.setSize( window.innerWidth, window.innerHeight );
			trackTheCameraToSelfMesh();
			camera.updateProjectionMatrix();
			renderer.render( scene, camera );
			break;
		case gameScreens.ideaContact:
			break;
		case gameScreens.ideaInterior:
			break;
		case gameScreens.myScore:
			break;
		case gameScreens.allScores:
			break;
		default:
			break;
	}
}
