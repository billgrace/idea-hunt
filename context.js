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
			scene.remove( launcherPusherMesh );
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
			scene.remove( launcherPusherMesh );
			scene.remove( flyerMesh );
			removeSelfFromScene();
			orbitElement.style.display = "none";
			orbitControls.enabled = false;
			roamingBackButton.deactivate();
			roamingPauseButton.deactivate();
			roamingSpeedButton.deactivate();
			// roamingLeftRightButton.deactivate();
			// roamingUpDownButton.deactivate();
			roamingDirectionButton.deactivate();
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
			trackPlayerMeshPartPositionsToPlayerMeshPosition();
			// trackPlayerMeshPartOrientationsToPlayerMeshOrientation();
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
			selfBody.position.copy( selfBodyHomePosition );
			trackPlayerMeshPositionToPlayerBodyPosition();
			trackPlayerMeshPartPositionsToPlayerMeshPosition();
			// selfMeshOrientation.copy( selfMeshHomeOrientation );
			// trackPlayerMeshPartOrientationsToPlayerMeshOrientation();
			// trackPlayerBodyOrientationToPlayerMeshOrientation();
			scene.add( topicHorizonMesh );
			scene.add( launchPlatformMesh );
			scene.add( launcherPusherMesh );
			scene.add( flyerMesh );
			addSelfToScene();
			render();
			break;
		case gameScreens.roaming:
			orbitElement.style.display = "block";
			orbitControls.enabled = true;
			roamingBackButton.activate();
			roamingPauseButton.activate();
			roamingSpeedButton.activate();
			// roamingLeftRightButton.activate();
			// roamingUpDownButton.activate();
			roamingDirectionButton.activate();
			roamingShootButton.activate();
			roamingGraspButton.activate();
			scene.add( topicHorizonMesh );
			scene.add( launchPlatformMesh );
			scene.add( launcherPusherMesh );
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
	scene.add( selfTorsoMesh );
}
function removeSelfFromScene() {
	scene.remove( selfHeadMesh );
	scene.remove( selfHairMesh );
	scene.remove( selfHatMesh );
	scene.remove( selfTorsoMesh );
}
function createWorld() {
	// create a basic THREE.JS scene with lights and renderer
	scene = new THREE.Scene();
	// scene.add( new THREE.AmbientLight( 0x888888 ) );
	var rightLight = new THREE.DirectionalLight( 0x888888 );
	rightLight.position.set( 1, 0, 0 ).normalize();
	scene.add( rightLight );
	var leftLight = new THREE.DirectionalLight( 0x888888 );
	leftLight.position.set( -1, 0, 0 ).normalize();
	scene.add( leftLight );
	var bottomLight = new THREE.DirectionalLight( 0x888888 );
	bottomLight.position.set( 0, -1, 0 ).normalize();
	scene.add( bottomLight );
	var topLight = new THREE.DirectionalLight( 0x888888 );
	topLight.position.set( 0, 1, 0 ).normalize();
	scene.add( topLight );
	var frontLight = new THREE.DirectionalLight( 0x888888 );
	frontLight.position.set( 0, 0, -1 ).normalize();
	scene.add( frontLight );
	var backLight = new THREE.DirectionalLight( 0x888888 );
	backLight.position.set( 0, 0, 1 ).normalize();
	scene.add( backLight );
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild( renderer.domElement );
	renderer.domElement.id = "rendererDomElement";

	// create a basic CANNON.JS world
	caWorld = new CANNON.World();
	// caWorld.gravity.set( 0, -980, 0 ); // (gravity in centimeters per second pointing "down")
	caWorld.gravity.set( 0, 0, 0 ); // (gravity in centimeters per second pointing "down")
	caWorld.broadphase = new CANNON.NaiveBroadphase();
	if( debuggingModeIsOn ) {
		cannonDebugThreeJsOutliner = new THREE.CannonDebugRenderer( scene, caWorld );
	}

	// create an HTML division to provide a strip-over-the-rendering along the right-hand side of the window
	optVWindowContainer = document.createElement( "div" );
	optVWindowContainer.id = "optv";
	optVWindowContainer.style.cssText = "display:none;position:absolute;border-style:solid;border-width:1px;border-color:#cc0;background-color:#880";
	document.body.appendChild( optVWindowContainer );

	// load the image files that make up the borders of the renderable universe
	topicHorizonEastMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonEastWall.jpg', THREE.UVMapping, clearLoadingSemaphore ), side:THREE.DoubleSide } );
	registerLoadingSemaphore();
	topicHorizonWestMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonWestWall.jpg', THREE.UVMapping, clearLoadingSemaphore ), side:THREE.DoubleSide } );
	registerLoadingSemaphore();
	topicHorizonSkyMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonSkyWall.jpg', THREE.UVMapping, clearLoadingSemaphore ), side:THREE.DoubleSide } );
	registerLoadingSemaphore();
	topicHorizonGroundMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonGroundWall.jpg', THREE.UVMapping, clearLoadingSemaphore ), side:THREE.DoubleSide } );
	registerLoadingSemaphore();
	topicHorizonNorthMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonNorthWall.jpg', THREE.UVMapping, clearLoadingSemaphore ), side:THREE.DoubleSide } );
	registerLoadingSemaphore();
	topicHorizonSouthMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'art/topicHorizonSouthWall.jpg', THREE.UVMapping, clearLoadingSemaphore ), side:THREE.DoubleSide } );
	registerLoadingSemaphore();

	// where the camera is positioned to view the launch
	launchCameraFocusPoint = new THREE.Vector3;
	launchCameraFocusPoint.set( 0, 0, -3000 );

	// make a launching platform
	launchPlatformMesh = new THREE.Mesh(
		new THREE.BoxGeometry( 200, 50, 300 ),
		new THREE.MeshLambertMaterial( { color:0x00ff00 } ) );
		// new THREE.MeshBasicMaterial( { color:0x00ff00 } ) );
	launchPlatformMesh.position.set( 0, -75, 125 );

	// make a launcher piston
	launcherPusherMesh = new THREE.Mesh(
		new THREE.CylinderGeometry( 25, 25, 150 ),
		new THREE.MeshLambertMaterial( { color:0xff0000 } ) );
		// new THREE.MeshBasicMaterial( { color:0xff0000 } ) );
	launcherPusherMeshHomePosition = new THREE.Vector3;
	launcherPusherMeshHomePosition.set( 0, -25, 105 );
	launcherPusherMesh.position.copy( launcherPusherMeshHomePosition );
	launcherPusherMesh.rotation.x = Math.PI / 2;

	// make a vehicle to be launched
	flyerGeometry = new THREE.CylinderGeometry( 30, 30, 30 );
	flyerMaterial = new THREE.MeshLambertMaterial( { color:0x224488, transparent:true } );
	// flyerMaterial = new THREE.MeshBasicMaterial( { color:0x224488, transparent:true } );
	flyerMesh = new THREE.Mesh( flyerGeometry, flyerMaterial );
	flyerOffset = new THREE.Vector3( 0, -35, 0 );

	// initialize the location for the active player
	selfMeshPosition = new THREE.Vector3( 0, 0, 0 );
	selfMeshOrientation = new THREE.Quaternion( 0, 0, 0, 1 );
	selfMeshHomeOrientation = new THREE.Quaternion();
	selfMeshHomeOrientation.copy( selfMeshOrientation );
	selfBodyHomePosition = new THREE.Vector3;
	selfBodyHomePosition.copy( selfMeshPosition );

	// arrange for the launch piston and active player to move together during launch power selection
	launcherPusherOffset = new THREE.Vector3;
	launcherPusherOffset.subVectors( selfMeshPosition, launcherPusherMesh.position );

	// initialize materials for active player rendering
	// selfHeadMaterial = new THREE.MeshBasicMaterial( { color:0xefa942, transparent:true, side:THREE.DoubleSide } );
	// selfHairMaterial = new THREE.MeshBasicMaterial( { color: 0x7f4000, transparent:true, side:THREE.DoubleSide } );
	// selfHatMaterial = new THREE.MeshBasicMaterial( { color: 0x8357dc, transparent:true, side:THREE.DoubleSide } );
	// selfTorsoMaterial = new THREE.MeshBasicMaterial( { color: 0xdc7283, transparent:true, side:THREE.DoubleSide } );
	selfHeadMaterial = new THREE.MeshLambertMaterial( { color:0xefa942, transparent:true, side:THREE.DoubleSide } );
	selfHairMaterial = new THREE.MeshLambertMaterial( { color: 0x7f4000, transparent:true, side:THREE.DoubleSide } );
	selfHatMaterial = new THREE.MeshLambertMaterial( { color: 0x8357dc, transparent:true, side:THREE.DoubleSide } );
	selfTorsoMaterial = new THREE.MeshLambertMaterial( { color: 0xdc7283, transparent:true, side:THREE.DoubleSide } );
	// selfHeadMaterial = new THREE.MeshPhongMaterial( { color:0xefa942, transparent:true, side:THREE.DoubleSide } );
	// selfHairMaterial = new THREE.MeshPhongMaterial( { color: 0x7f4000, transparent:true, side:THREE.DoubleSide } );
	// selfHatMaterial = new THREE.MeshPhongMaterial( { color: 0x8357dc, transparent:true, side:THREE.DoubleSide } );
	// selfTorsoMaterial = new THREE.MeshLambertMaterial( { color: 0xdc7283, transparent:true, side:THREE.DoubleSide } );

	// initialize offset vectors to position active player parts relative to the active player overall position location
	selfHeadOffset = new THREE.Vector3( 0, 0, 0 );
	selfHairOffset = new THREE.Vector3( 0, 0, 0 );
	selfHatOffset = new THREE.Vector3( 0, 0, 0 );
	selfTorsoOffset = new THREE.Vector3( 0, 0, 0 );
	sphericalHeadOffset = new THREE.Vector3( 0, 0, 0 );
	cylindricalHeadOffset = new THREE.Vector3( 0, 0, 0 );
	conicalHeadOffset = new THREE.Vector3( 0, 0, 0 );
	bowlcutHairOffset = new THREE.Vector3( 0, 0, 0 );
	napecoverHairOffset = new THREE.Vector3( 0, 0, 0 );
	girlcurlHairOffset = new THREE.Vector3( 0, -2.9, 0 );
	beanieHatOffset = new THREE.Vector3( 0, 7, 0 );
	baseballHatOffset = new THREE.Vector3( 0, 7, 0 );
	brimmedHatOffset = new THREE.Vector3( 0, 7, 0 );
	squareTorsoOffset = new THREE.Vector3( 0, -19, 0 );
	cylinderTorsoOffset = new THREE.Vector3( 0, -19, 0 );
	triangleTorsoOffset = new THREE.Vector3( 0, -19, 0 );
	diskTorsoOffset = new THREE.Vector3( 0, -19, 0 );

	// load the blender-generated json files containing stock geometries that can be chosen to make up the parts of a player
	// (head geometries)
	var sphericalHeadLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	sphericalHeadLoader.load( 'geometry/sphericalHead.json', function( geometry ) {
		sphericalHeadMesh = new THREE.Mesh( geometry, selfHeadMaterial );
		clearLoadingSemaphore();
	} );
	var cylindricalHeadLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	cylindricalHeadLoader.load( 'geometry/cylindricalHead.json', function( geometry ) {
		cylindricalHeadMesh = new THREE.Mesh( geometry, selfHeadMaterial );
		clearLoadingSemaphore();
	} );
	var conicalHeadLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	conicalHeadLoader.load( 'geometry/conicalHead.json', function( geometry ) {
		conicalHeadMesh = new THREE.Mesh( geometry, selfHeadMaterial );
		clearLoadingSemaphore();
	} );
	// (hair geometries)
	var bowlcutHairLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	bowlcutHairLoader.load( 'geometry/bowlcutHair.json', function( geometry ) {
		bowlcutHairMesh = new THREE.Mesh( geometry, selfHairMaterial );
		clearLoadingSemaphore();
	} );
	var napecoverHairLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	napecoverHairLoader.load( 'geometry/napecoverHair.json', function( geometry ) {
		napecoverHairMesh = new THREE.Mesh( geometry, selfHairMaterial );
		clearLoadingSemaphore();
	} );
	var girlcurlHairLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	girlcurlHairLoader.load( 'geometry/girlcurlHair.json', function( geometry ) {
		girlcurlHairMesh = new THREE.Mesh( geometry, selfHairMaterial );
		clearLoadingSemaphore();
	} );
	// (hat geometries)
	var beanieHatLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	beanieHatLoader.load( 'geometry/beanieHat.json', function( geometry ) {
		beanieHatMesh = new THREE.Mesh( geometry, selfHatMaterial );
		clearLoadingSemaphore();
	} );
	var baseballHatLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	baseballHatLoader.load( 'geometry/baseballHat.json', function( geometry ) {
		baseballHatMesh = new THREE.Mesh( geometry, selfHatMaterial );
		clearLoadingSemaphore();
	} );
	var brimmedHatLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	brimmedHatLoader.load( 'geometry/brimmedHat.json', function( geometry ) {
		brimmedHatMesh = new THREE.Mesh( geometry, selfHatMaterial );
		clearLoadingSemaphore();
	} );
	// (torso geometries)
	var squareTorsoLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	squareTorsoLoader.load( 'geometry/squareTorso.json', function( geometry ) {
		squareTorsoMesh = new THREE.Mesh( geometry, selfTorsoMaterial );
		clearLoadingSemaphore();
	} );
	var cylinderTorsoLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	cylinderTorsoLoader.load( 'geometry/cylinderTorso.json', function( geometry ) {
		cylinderTorsoMesh = new THREE.Mesh( geometry, selfTorsoMaterial );
		clearLoadingSemaphore();
	} );
	var triangleTorsoLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	triangleTorsoLoader.load( 'geometry/triangleTorso.json', function( geometry ) {
		triangleTorsoMesh = new THREE.Mesh( geometry, selfTorsoMaterial );
		clearLoadingSemaphore();
	} );
	var diskTorsoLoader = new THREE.JSONLoader();
	registerLoadingSemaphore();
	diskTorsoLoader.load( 'geometry/diskTorso.json', function( geometry ) {
		diskTorsoMesh = new THREE.Mesh( geometry, selfTorsoMaterial );
		clearLoadingSemaphore();
	} );

	// create an analog of the active player in the physics world
	var caSelfMaterial = new CANNON.Material( "caSelfMaterial" );
	var caSelfShape = new CANNON.Sphere( 50 );
	selfBody = new CANNON.Body( { mass: 10, material: caSelfMaterial } );
	selfBody.addShape( caSelfShape );
	// selfBody.preStep = preStepHookRoutine;
	selfBody.rotationalDamping = 0.1;
	caWorld.add( selfBody );

	// Create the choose player screen
	choosePlayerScreenDiv = document.createElement( "Div" );
	choosePlayerScreenDiv.id = "choosePlayerScreenDiv";
	choosePlayerScreenDiv.style.cssText = "display:none;position:absolute;left:0;top:0;width:100%;height:100%;opacity:0";
	document.body.appendChild( choosePlayerScreenDiv );
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
	// roamingLeftRightButton = new imageButton( "art/leftRightArrows-Yellow.png", "rendererDomElement", 0.01, 0.81, 0.45, 0.15, " ", true, roamingLeftRightButtonClickHandler );
	roamingDirectionButton = new imageButton( "art/directionArrows-Yellow.png", "rendererDomElement", 0.01, 0.81, 0.45, 0.15, " ", true, roamingDirectionButtonClickHandler );
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

function buildItemsWaitingForLoadComplete() {
	topicHorizonMaterialArray.push( topicHorizonEastMaterial );
	topicHorizonMaterialArray.push( topicHorizonWestMaterial );
	topicHorizonMaterialArray.push( topicHorizonSkyMaterial );
	topicHorizonMaterialArray.push( topicHorizonGroundMaterial );
	topicHorizonMaterialArray.push( topicHorizonNorthMaterial );
	topicHorizonMaterialArray.push( topicHorizonSouthMaterial );
	topicHorizonMaterial = new THREE.MeshFaceMaterial( topicHorizonMaterialArray );
	topicHorizonGeometry = new THREE.BoxGeometry( worldPixelWidth, worldPixelHeight, worldPixelLength );
	topicHorizonMesh = new THREE.Mesh( topicHorizonGeometry, topicHorizonMaterial );
	topicHorizonMesh.position.set( 0, 0, -300 );

	// selfHeadMesh = conicalHeadMesh.clone();
	// selfHairMesh = girlcurlHairMesh.clone();
	// selfHatMesh = brimmedHatMesh.clone();
	// selfTorsoMesh = diskTorsoMesh.clone();
	selfHeadMesh = conicalHeadMesh;
	selfHairMesh = girlcurlHairMesh;
	selfHatMesh = brimmedHatMesh;
	selfTorsoMesh = diskTorsoMesh;
	selfHeadOffset.copy( conicalHeadOffset );
	selfHairOffset.copy( girlcurlHairOffset );
	selfHatOffset.copy( brimmedHatOffset );
	selfTorsoOffset.copy( diskTorsoOffset );
}
function registerLoadingSemaphore() {
	initialLoadingSemaphore++;
}
function clearLoadingSemaphore() {
	initialLoadingSemaphore--;
}