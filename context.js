/*
 * context.js
 *
 * @author billgrace / http://billgrace.com
 *
 */

/*
 * screen switching
 *
 * screens:
 *	opening screen at start of game
 *	player gallery screen - choose a player
 *	player editing screen - create/edit/delete a player
 *	player save error screen - deal with some problem saving a new/changed player
 *	topic browsing screen - choose a topic
 *	launch screen - launch into a topic
 *	roaming screen - flying around in a topic
 *	idea contact screen - chasing/shooting/capturing an idea
 *	idea interior screen - inside a captured idea
 *	my score screen - see current player's scoring
 *	everyone's score screen - see all players' scoring
 */

function switchToScreen( newScreen ) {
	// first exit the present screen
	switch( currentGameScreen ) {
		case gameScreens.initialLoadingScreen:
			// we're here when the game first loads
			break;
		case gameScreens.openingScreen:
			break;
		case gameScreens.choosePlayer:
			removeSelfFromScene();
			choosePlayerCreateNewButton.deactivate();
			choosePlayerMakeChangesButton.deactivate();
			choosePlayerPlayWithButton.deactivate();
			choosePlayerScreenDiv.style.display = "none";
			orbitElement.style.display = "none";
			orbitControls.enabled = false;
			break;
		case gameScreens.editPlayer:
			removeSelfFromScene();
			editPlayerCancelButton.deactivate();
			editPlayerSaveButton.deactivate();
			editPlayerScreenDiv.style.display = "none"
			orbitElement.style.display = "none";
			orbitControls.enabled = false;
			break;
		case gameScreens.savePlayerError:
			removeSelfFromScene();
			orbitElement.style.display = "none";
			orbitControls.enabled = false;
			break;
		case gameScreens.browseTopics:
			break;
		case gameScreens.launch:
			scene.remove( topicHorizonMesh );
			scene.remove( launchPlatformMesh );
			scene.remove( launcherMesh );
			scene.remove( flyerMesh );
			removeSelfFromScene();
			orbitElement.style.display = "none";
			orbitControls.enabled = false;
			optVWindowContainer.style.display = "none";
			launchButton.deactivate();
			launchButtonLabel.deactivate();
			launchPowerMeter.deactivate();
			launchPowerSlider.deactivate();
			launchSliderLabel.deactivate();
			break;
		case gameScreens.roaming:
			scene.remove( topicHorizonMesh );
			scene.remove( launchPlatformMesh );
			scene.remove( launcherMesh );
			scene.remove( flyerMesh );
			removeSelfFromScene();
			roamingBackButton.deactivate();
			roamingPauseButton.deactivate();
			roamingSpeedButton.deactivate();
			roamingLeftRightButton.deactivate();
			roamingUpDownButton.deactivate();
			roamingShootButton.deactivate();
			roamingGraspButton.deactivate();
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
	currentGameScreen = newScreen;
	updateRenderingGeometry();
	// now enter the new screen
	switch( newScreen ) {
		case gameScreens.initialLoadingScreen:
			break;
		case gameScreens.openingScreen:
			break;
		case gameScreens.choosePlayer:
			homeTheCamera();
			choosePlayerScreenDiv.style.display = "block";
			orbitElement.style.display = "block";
			orbitControls.enabled = true;
			choosePlayerCreateNewButton.activate();
			choosePlayerMakeChangesButton.activate();
			choosePlayerPlayWithButton.activate();
			addSelfToScene();
			break;
		case gameScreens.editPlayer:
			editPlayerScreenDiv.style.display = "block"
			orbitElement.style.display = "block";
			orbitControls.enabled = true;
			editPlayerCancelButton.activate();
			editPlayerSaveButton.activate();
			addSelfToScene();
			break;
		case gameScreens.savePlayerError:
			addSelfToScene();
			break;
		case gameScreens.browseTopics:
			break;
		case gameScreens.launch:
			homeTheCamera();
			optVWindowContainer.style.display = "block";
			orbitElement.style.display = "block";
			orbitControls.enabled = true;
			launchButton.activate();
			launchButtonLabel.activate();
			launchPowerSlider.activate();
			launchSliderLabel.activate();
			launchPowerMeter.activate();
			trackMeshPartsToMeshPosition();
			scene.add( topicHorizonMesh );
			scene.add( launchPlatformMesh );
			scene.add( launcherMesh );
			scene.add( flyerMesh );
			addSelfToScene();
			render();
			break;
		case gameScreens.roaming:
			roamingBackButton.activate();
			roamingPauseButton.activate();
			roamingSpeedButton.activate();
			roamingLeftRightButton.activate();
			roamingUpDownButton.activate();
			roamingShootButton.activate();
			roamingGraspButton.activate();
			scene.add( topicHorizonMesh );
			scene.add( launchPlatformMesh );
			scene.add( launcherMesh );
			scene.add( flyerMesh );
			addSelfToScene();
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
function addSelfToScene() {
	scene.add( selfHeadMesh );
	scene.add( selfHairMesh );
	scene.add( selfHatMesh );
	scene.add( selfShirtMesh );
}
function removeSelfFromScene() {
	scene.remove( selfHeadMesh );
	scene.remove( selfHairMesh );
	scene.remove( selfHatMesh );
	scene.remove( selfShirtMesh );
}
function createWorld() {
	scene = new THREE.Scene();
	var rightLight = new THREE.DirectionalLight( 0x888888 );
	rightLight.position.set( 1, 0, 0 ).normalize();
	scene.add( rightLight );
	var leftLight = new THREE.DirectionalLight( 0x888888 );
	leftLight.position.set( -1, 0, 0 ).normalize();
	scene.add( leftLight );
	var bottomLight = new THREE.DirectionalLight( 0x888888 );
	bottomLight.position.set( 0, -1, 0 ).normalize();
	scene.add( bottomLight );
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild( renderer.domElement );
	renderer.domElement.id = "rendererDomElement";

	caWorld = new CANNON.World();
	// caWorld.gravity.set( 0, -980, 0 ); // (gravity in centimeters per second pointing "down")
	caWorld.gravity.set( 0, 0, 0 ); // (gravity in centimeters per second pointing "down")
	caWorld.broadphase = new CANNON.NaiveBroadphase();
	if( debuggingModeIsOn ) {
		cannonDebugThreeJsOutliner = new THREE.CannonDebugRenderer( scene, caWorld );
	}

	optVWindowContainer = document.createElement( "div" );
	optVWindowContainer.id = "optv";
	optVWindowContainer.style.cssText = "display:none;position:absolute;border-style:solid;border-width:1px;border-color:#cc0;background-color:#880";
	document.body.appendChild( optVWindowContainer );

	topicHorizonMaterialArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonEastWall.jpg' ), side:THREE.DoubleSide } ) );
	topicHorizonMaterialArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonWestWall.jpg' ), side:THREE.DoubleSide } ) );
	topicHorizonMaterialArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonSkyWall.jpg' ), side:THREE.DoubleSide } ) );
	topicHorizonMaterialArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonGroundWall.jpg' ), side:THREE.DoubleSide } ) );
	topicHorizonMaterialArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonSouthWall.jpg' ), side:THREE.DoubleSide } ) );
	topicHorizonMaterialArray.push( new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonNorthWall.jpg' ), side:THREE.DoubleSide } ) );
	topicHorizonMaterial = new THREE.MeshFaceMaterial( topicHorizonMaterialArray );
	topicHorizonGeometry = new THREE.BoxGeometry( 400000, 300000, 400000 );
	topicHorizonMesh = new THREE.Mesh( topicHorizonGeometry, topicHorizonMaterial );
	topicHorizonMesh.position.set( 0, 0, -300 );

	launchCameraFocusPoint = new THREE.Vector3;
	launchCameraFocusPoint.set( 0, 0, -3000 );
	launchPlatformMesh = new THREE.Mesh(
		new THREE.BoxGeometry( 200, 50, 200 ),
		new THREE.MeshLambertMaterial( { color:0x00ff00 } ) );
	launchPlatformMesh.position.set( 0, -25, 100 );

	launcherMesh = new THREE.Mesh(
		new THREE.CylinderGeometry( 25, 25, 150 ),
		new THREE.MeshLambertMaterial( { color:0xff0000 } ) );
	launcherMeshHomePosition = new THREE.Vector3;
	launcherMeshHomePosition.set( 0, 25, 125 );
	launcherMesh.position.copy( launcherMeshHomePosition );
	launcherMesh.rotation.x = Math.PI / 2;

	flyerMesh = new THREE.Mesh(
		new THREE.CylinderGeometry( 50, 50, 50 ),
		new THREE.MeshLambertMaterial( { color:0x224488 } ) );
	flyerMeshHomePosition = new THREE.Vector3( 0, 40, 28 );

	var selfWidth = 50, selfHeight = 100, selfDepth = 56;
	selfMeshPosition = new THREE.Vector3( 0, 50, 58 );
	selfMeshOrientation = new THREE.Quaternion( 0, 0, 0, 1 );
	selfMeshHomePosition = new THREE.Vector3;
	selfMeshHomePosition.copy( selfMeshPosition );
	launcherToSelfOffset = new THREE.Vector3;
	launcherToSelfOffset.subVectors( selfMeshPosition, launcherMesh.position );
	selfHeadMaterial = new THREE.MeshLambertMaterial( { color:0xefa942, transparent:true } );
	selfHairMaterial = new THREE.MeshLambertMaterial( { color: 0x7f4000, transparent:true } );
	selfHatMaterial = new THREE.MeshLambertMaterial( { color: 0x8357dc, transparent:true } );
	selfShirtMaterial = new THREE.MeshLambertMaterial( { color: 0xdc7283, transparent:true } );
	var headLoader = new THREE.JSONLoader();
	initialLoadingSemaphore++;
	headLoader.load( 'selfHead.json', function( geometry ) {
		selfHeadMesh = new THREE.Mesh( geometry, selfHeadMaterial );
		scene.add( selfHeadMesh );
		initialLoadingSemaphore--;
		selfHeadOffset = new THREE.Vector3( 0, 0, -50 );
	} );
	var hairLoader = new THREE.JSONLoader();
	initialLoadingSemaphore++;
	hairLoader.load( 'selfHair.json', function( geometry ) {
		selfHairMesh = new THREE.Mesh( geometry, selfHairMaterial );
		scene.add( selfHairMesh );
		initialLoadingSemaphore--;
		selfHairOffset = new THREE.Vector3( 0, 0, -50 );
	} );
	var hatLoader = new THREE.JSONLoader();
	initialLoadingSemaphore++;
	hatLoader.load( 'selfHat.json', function( geometry ) {
		selfHatMesh = new THREE.Mesh( geometry, selfHatMaterial );
		scene.add( selfHatMesh );
		initialLoadingSemaphore--;
		selfHatOffset = new THREE.Vector3( 0, 0.5, -50 );
	} );
	var shirtLoader = new THREE.JSONLoader();
	initialLoadingSemaphore++;
	shirtLoader.load( 'selfShirt.json', function( geometry ) {
		selfShirtMesh = new THREE.Mesh( geometry, selfShirtMaterial );
		scene.add( selfShirtMesh );
		initialLoadingSemaphore--;
		selfShirtOffset = new THREE.Vector3( 0, 0, -50 );
	} );

	var caSelfMaterial = new CANNON.Material( "caSelfMaterial" );
	var caSelfShape = new CANNON.Box( new CANNON.Vec3( selfWidth/2, selfHeight/2, selfDepth/2 ) );
	selfBody = new CANNON.Body( { mass: 10, material: caSelfMaterial } );
	selfBody.addShape( caSelfShape );
	selfBody.preStep = preStepHookRoutine;
	selfBody.rotationalDamping = 0.1;
	moveSelfBodyToMesh();
	caWorld.add( selfBody );

	// scene.add( topicHorizonMesh );
	// scene.add( launchPlatformMesh );
	// scene.add( launcherMesh );
	// scene.add( selfMesh );
	// scene.add( flyerMesh );

	// Create the choose player screen
	choosePlayerScreenDiv = document.createElement( "Div" );
	choosePlayerScreenDiv.id = "choosePlayerScreenDiv";
	choosePlayerScreenDiv.style.cssText = "display:none;position:absolute;left:0;top:0;width:100%;height:100%;opacity:0";
	document.body.appendChild( choosePlayerScreenDiv );
	// playerGallery = new IdeaHuntPlayerGallery();
	choosePlayerCreateNewButton = new imageButton( "art/choosePlayerCreateNew.png", "choosePlayerScreenDiv", 0.1, 0.8, 0.2, 0.2, "H", false, choosePlayerCreateNewClickHandler );
	choosePlayerMakeChangesButton = new imageButton( "art/choosePlayerMakeChanges.png", "choosePlayerScreenDiv", 0.4, 0.8, 0.2, 0.2, "H", false, choosePlayerMakeChangesClickHandler );
	choosePlayerPlayWithButton = new imageButton( "art/choosePlayerPlayWith.png", "choosePlayerScreenDiv", 0.7, 0.8, 0.2, 0.2, "H", false, choosePlayerPlayWithClickHandler );

	// Create the edit player screen
	editPlayerScreenDiv = document.createElement( "Div" );
	editPlayerScreenDiv.id = "editPlayerScreenDiv";
	editPlayerScreenDiv.style.cssText = "display:none;position:absolute;left:0;top:0;width:100%;height:100%;background-color:#c4c";
	document.body.appendChild( editPlayerScreenDiv );
	editPlayerCancelButton = new imageButton( "art/editPlayerCancel.png", "editPlayerScreenDiv", 0.1, 0.3, 0.2, 0.2, "H", false, editPlayerCancelClickHandler );
	editPlayerSaveButton = new imageButton( "art/editPlayerSave.png", "editPlayerScreenDiv", 0.7, 0.3, 0.2, 0.2, "H", false, editPlayerSaveClickHandler );

	// Create the launch screen
	launchButton = new imageButton( "art/launchButton.png", "optv", 0.5, 0.85, 0.4, 0.1, " ", false, launchButtonClickHandler );
	launchButtonLabel = new imageLabel( "art/launchButtonLabel.png", "optv", 0.05, 0.85, 0.4, 0.1 );

	launchPowerSlider = new verticalSlider( "art/launchPowerSlider.png", "optv", 0.75, 0.23, 0.4, 0.15, 0.35, "#662244", bottomLaunchPowerSliderValue, topLaunchPowerSliderValue, startingLaunchPowerSliderValue, launchPowerSliderChangeHandler );
	launchSliderLabel = new imageLabel( "art/launchPowerSliderLabel.png", "optv", 0.1, 0.16, 0.4, 0.5 );
	launchPowerMeter = new textBox( "0%", "optv", 0.25, 0.73, 0.5, 0.05, "blue", "2.5", "white", 2, "black" );

	// Create the roaming screen
	roamingRaycaster = new THREE.Raycaster();
	roamingBackButton = new imageButton( "art/returnArrow-Teal.png", "rendererDomElement", 0.01, 0.01, 0.15, 0.15, " ", true, roamingBackButtonClickHandler );
	roamingPauseButton = new imageButton( "art/pauseBars-Teal.png", "rendererDomElement", 0.02, 0.2, 0.15, 0.15, " ", true, roamingPauseButtonClickHandler );
	roamingSpeedButton = new imageButton( "art/speedBar.png", "rendererDomElement", 0.5, 0.81, 0.3, 0.15, " ", true, roamingSpeedButtonClickHandler );
	roamingLeftRightButton = new imageButton( "art/leftRightArrows-Yellow.png", "rendererDomElement", 0.01, 0.81, 0.45, 0.15, " ", true, roamingLeftRightButtonClickHandler );
	roamingUpDownButton = new imageButton( "art/upDownArrows-Yellow.png", "rendererDomElement", 0.85, 0.5, 0.15, 0.45, " ", true, roamingUpDownButtonClickHandler );
	roamingShootButton = new imageButton( "art/crossHair-Red.png", "rendererDomElement", 0.85, 0.01, 0.15, 0.15, " ", true, roamingShootButtonClickHandler );
	roamingGraspButton = new imageButton( "art/graspingHand3.png", "rendererDomElement", 0.85, 0.21, 0.15, 0.15, " ", true, roamingGraspButtonClickHandler );


	if( debuggingModeIsOn ) {
		stats = new Stats();
		stats.domElement.style.position = "absolute";
		stats.domElement.style.top = "0px";
		document.body.appendChild( stats.domElement );

		devMsg = document.createElement( "div" );
		devMsg.style.cssText = "position:absolute;border-style:solid;border-width:1px;border-color:#c00;background-color:#f88";
		devMsg.style.left = stats.domElement.style.width;
		devMsg.style.height = "200px";
		devMsg.style.top = "0px";
		document.body.appendChild( devMsg );
	}
}