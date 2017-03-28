import * as THREE from 'three';
import { state } from '../services/state.service';
import { BaseView } from './base.view';
import { TileMapService } from '../services/tilemap.service';
import { registerMouseIntersectionHandler } from '../services/mouse_intersection.service';

import { map as tileMap } from '../map2';

let mainViewElement: Element = document.getElementsByClassName('main-view')[0];
let view = new BaseView(mainViewElement);

let tileSize = 16;

let height = tileSize * 10; //mainViewElement.clientHeight

view.camera.position.set(
	height,
	height / 2,
	height);

view.camera.lookAt(view.scene.position);

let texture = new THREE.TextureLoader().load('assets/zelda-tiles.png', texture => {
	let tileSet = new TileMapService({
		tileMapWidth: texture.image.width,
		tileMapHeight: texture.image.height,
		tileSize
	});

	let squareShape = new THREE.Shape([
		new THREE.Vector2(0, 0),
		new THREE.Vector2(tileSize, 0),
		new THREE.Vector2(tileSize, tileSize),
		new THREE.Vector2(0, tileSize)
	]);
	let squareGeo = new THREE.ShapeGeometry(squareShape);
	squareGeo.rotateX(-90 * Math.PI / 180);

	let squareMat = new THREE.MeshBasicMaterial({
		//color: 0xFF0000,
		map: texture,
		side: THREE.DoubleSide
	});

	// let tileMap = [
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	// ];

	let tiles: Array<{ x: number, y: number, i: number }> = [];
	let cols = tileMap[0].length;
	let rows = tileMap.length;
	for (let y = 0; y < rows; ++y) {
		for (let x = 0; x < cols; ++x) {
			tiles.push({
				x: (x - cols / 2) * tileSize,
				y: ((y - rows / 2) + 1) * tileSize,
				i: tileMap[y][x]
			});
		}
	}

	let intersectionCandidates = [];

	registerMouseIntersectionHandler(
		view.renderer.domElement,
		view.camera,
		intersectionCandidates,
		(intersections) => {
			if (intersections[0] && state.selectedTileIndex !== undefined) {
				let tile = tileSet.tiles[state.selectedTileIndex];
				let mesh: THREE.Mesh = <any>intersections[0].object;
				let geoClone = mesh
					.geometry
					.clone() as THREE.Geometry;

				TileMapService.mapUVtoGeometry(
					geoClone,
					tile);

				let meshClone = new THREE.Mesh(
					geoClone,
					squareMat);

				meshClone.position.x = mesh.position.x;
				meshClone.position.z = mesh.position.z;

				view.scene.remove(mesh);
				view.scene.add(meshClone);

				let index = intersectionCandidates.indexOf(mesh);
				if (index > -1) {
					intersectionCandidates.splice(index, 1);
				}
				intersectionCandidates.push(meshClone);
			}
		});

	let mapObject = new THREE.Object3D();
	view.scene.add(mapObject);

	let geoClones = [];

	for (let tile of tiles) {
		let geoClone = geoClones[tile.i] = geoClones[tile.i] || squareGeo.clone();

		TileMapService.mapUVtoGeometry(
			geoClone,
			tileSet.tiles[tile.i]);

		let squareMesh = new THREE.Mesh(
			geoClone,
			squareMat);

		squareMesh.position.x = tile.x;
		squareMesh.position.z = tile.y;

		mapObject.add(squareMesh);

		intersectionCandidates.push(squareMesh);
	}
});