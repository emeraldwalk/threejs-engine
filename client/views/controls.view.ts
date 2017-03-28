import * as THREE from 'three';
import { BaseView } from './base.view';
import { TileMapService } from '../services/tilemap.service';
import { registerMouseIntersectionHandler } from '../services/mouse_intersection.service';

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

	let tileSet = new TileMapService({
		tileMapWidth: texture.image.width,
		tileMapHeight: texture.image.height,
		tileSize: 16
	});

	/**
	 * Handle clicks for tile selection.
	 */
	let intersectionCandidates: Array<THREE.Object3D> = [];

	let selectedSquareMesh: THREE.Mesh;
	function updateSelectedSquare(intersections: Array<THREE.Intersection>) {
		let i = intersectionCandidates.indexOf(intersections[0].object);
		let tile = tileSet.tiles[i];

		let geoClone = TileMapService.mapUVtoGeometry(
			squareGeo.clone(),
			tile);

		selectedSquareMesh = new THREE.Mesh(
			geoClone,
			squareMat);

		selectedSquareMesh.position.set(0, -36, 0);
		selectedSquareMesh.scale.set(2, 2, 2);

		view.scene.remove(selectedSquareMesh);
		view.scene.add(selectedSquareMesh);
	}

	registerMouseIntersectionHandler(
		view.renderer.domElement,
		orthoCamera,
		intersectionCandidates,
		(intersections) => {
			updateSelectedSquare(intersections);
		});

	/**
	 * Render our tiles.
	 */
	let x = 0;
	let y = 0;
	let col = cameraWidth;

	let squareGeos = tileSet.createUVGeometries(squareGeo);

	for (let geoClone of squareGeos) {
		let squareMesh = new THREE.Mesh(geoClone, squareMat);
		squareMesh.position.setX(x);
		squareMesh.position.setY(y - 1);
		view.scene.add(squareMesh);

		intersectionCandidates.push(squareMesh);

		if (x % col === col - 1) {
			x = 0;
			--y;
		}
		else {
			++x;
		}
	}
});