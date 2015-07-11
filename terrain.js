/*
 * terrain.js
 *
 * @author billgrace / http://billgrace.com
 *
 */

function initTerrain() {
	terrainPixelWidth = worldPixelWidth;
	terrainPixelLength = worldPixelLength;
	terrainVertexWidth = 200;
	terrainVertexLength = 200;
	terrainHalfVertexWidth = terrainVertexWidth / 2;
	terrainHalfVertexLength = terrainVertexLength / 2;

	terrainHeightData = generateHeight( terrainVertexWidth, terrainVertexLength );

	terrainGeometry = new THREE.PlaneBufferGeometry( terrainPixelWidth, terrainPixelLength, terrainVertexWidth - 1, terrainVertexLength - 1 );
	terrainGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );
	terrainVertices = terrainGeometry.attributes.position.array;
	for( var i = 0, j = 0, l = terrainVertices.length; i < l; i++, j += 3 ) {
		// terrainVertices[ j + 1 ] = terrainHeightData[ i ] * 10;
		// terrainVertices[ j + 1 ] = terrainHeightData[ i ] * 10 - ( worldPixelHeight / 2 );
		terrainVertices[ j + 1 ] = terrainHeightData[ i ] * 10 - 2000;
	}

	terrainTexture = new THREE.Texture( generateTexture( terrainHeightData, terrainVertexWidth, terrainVertexLength), THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
	terrainTexture.needsUpdate = true;

	terrainMaterial = new THREE.MeshBasicMaterial( { map: terrainTexture } );
	// terrainMaterial = new THREE.MeshBasicMaterial( { color:0x123456, wireframe:true } );
	terrainMesh = new THREE.Mesh( terrainGeometry, terrainMaterial );
	scene.add( terrainMesh );
}

function generateHeight( width, height ) {

	var size = width * height, data = new Uint8Array( size ),
	perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
	// perlin = new ImprovedNoise(), quality = 3, z = Math.random() * 100;

	for ( var j = 0; j < 4; j ++ ) {

		for ( var i = 0; i < size; i ++ ) {

			var x = i % width, y = ~~ ( i / width );
			data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

		}

		quality *= 5;

	}

	return data;

}

function generateTexture( data, width, height ) {

	var canvas, canvasScaled, context, image, imageData,
	level, diff, vector3, sun, shade;

	vector3 = new THREE.Vector3( 0, 0, 0 );

	sun = new THREE.Vector3( 1, 1, 1 );
	sun.normalize();

	canvas = document.createElement( 'canvas' );
	canvas.width = width;
	canvas.height = height;

	context = canvas.getContext( '2d' );
	context.fillStyle = '#000';
	context.fillRect( 0, 0, width, height );

	image = context.getImageData( 0, 0, canvas.width, canvas.height );
	imageData = image.data;

	for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

		vector3.x = data[ j - 2 ] - data[ j + 2 ];
		vector3.y = 2;
		vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
		vector3.normalize();

		shade = vector3.dot( sun );

		imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
		imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
		imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
	}

	context.putImageData( image, 0, 0 );

	// Scaled 4x

	canvasScaled = document.createElement( 'canvas' );
	canvasScaled.width = width * 4;
	canvasScaled.height = height * 4;

	context = canvasScaled.getContext( '2d' );
	context.scale( 4, 4 );
	context.drawImage( canvas, 0, 0 );

	image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
	imageData = image.data;

	for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

		var v = ~~ ( Math.random() * 5 );

		imageData[ i ] += v;
		imageData[ i + 1 ] += v;
		imageData[ i + 2 ] += v;

	}

	context.putImageData( image, 0, 0 );

	return canvasScaled;

}
