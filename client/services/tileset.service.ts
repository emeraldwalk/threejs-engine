import * as THREE from 'three';

export class TileSetService {
	private _tiles: Array<[THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]>;

	constructor(config: { tileMapWidth: number, tileMapHeight: number, tileSize }) {
		let tilesWide = config.tileMapWidth / config.tileSize;
		let tilesHigh = config.tileMapHeight / config.tileSize;
		let uUnit = 1 / tilesWide;
		let vUnit = 1 / tilesHigh;

		this._tiles = [];

		for (let y = tilesHigh - 1; y >= 0; --y) {
			for (let x = 0; x < tilesWide; ++x) {
				let u = x * uUnit;
				let v = y * vUnit;

				let tile: [THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2] = [
					new THREE.Vector2(u, v),
					new THREE.Vector2(u + uUnit, v),
					new THREE.Vector2(u + uUnit, v + vUnit),
					new THREE.Vector2(u, v + vUnit)
				];

				this._tiles.push(tile);
			}
		}
	}

	public get tiles(): Array<[THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]> {
		return this._tiles;
	}
}