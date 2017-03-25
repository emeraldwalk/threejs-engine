import * as THREE from 'three';
import { BaseView } from './base.view';
import { TileSetService } from '../services/tileset.service';

let viewElement: Element = document.getElementsByClassName('controls-view')[0];

let aspectRatio = viewElement.clientWidth / viewElement.clientHeight;
let cameraWidth = 32;
let cameraHeight = cameraWidth / aspectRatio;

let orthoCamera = new THREE.OrthographicCamera(
	0,
	cameraWidth,
	0,
	-cameraHeight,
	1,
	1000);

let view = new BaseView(
	viewElement,
	orthoCamera);

let texture = new THREE.TextureLoader().load('assets/zelda-tiles.png', texture => {
	// let spriteMat = new THREE.SpriteMaterial({
	// 	map: texture
	// });
	// let sprite = new THREE.Sprite(spriteMat);
	// view.scene.add(sprite);

	view.camera.position.setZ(1);
	// view.camera.lookAt(view.scene.position);

	let squareShape = new THREE.Shape([
		new THREE.Vector2(0, 0),
		new THREE.Vector2(1, 0),
		new THREE.Vector2(1, 1),
		new THREE.Vector2(0, 1)
	]);
	let squareGeo = new THREE.ShapeGeometry(squareShape);

	let squareMat = new THREE.MeshBasicMaterial({
		//color: 0xFF0000,
		map: texture,
		side: THREE.DoubleSide
	});

	let tileSet = new TileSetService({
		tileMapWidth: texture.image.width,
		tileMapHeight: texture.image.height,
		tileSize: 16
	});

	let x = 0;
	let y = 0;
	let col = cameraWidth;
	for(let tile of tileSet.tiles) {
		let geoClone = squareGeo.clone();
		geoClone.faceVertexUvs[0] = [];
		geoClone.faceVertexUvs[0][0] = [ tile[3], tile[0], tile[1] ];
		geoClone.faceVertexUvs[0][1] = [ tile[1], tile[2], tile[3] ];

		let squareMesh = new THREE.Mesh(geoClone, squareMat);
		squareMesh.position.setX(x);
		squareMesh.position.setY(y - 1);
		view.scene.add(squareMesh);

		if(x % col === col - 1) {
			x = 0;
			--y;
		}
		else {
			++x;
		}
	}
});