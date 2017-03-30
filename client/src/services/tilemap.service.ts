import * as THREE from 'three';

export type ITileUV = [
	THREE.Vector2,
	THREE.Vector2,
	THREE.Vector2,
	THREE.Vector2
];

export interface ITileMapConfig {
	tileMapWidth: number,
	tileMapHeight: number,
	tileSize
}

/**
 * Maps uv coordinates from a tile map to geometries.
 */
export class TileMapService {
	private _tiles: Array<ITileUV>;

	constructor(config: ITileMapConfig) {
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

	/**
	 * UV coordinates for tiles in the tile map.
	 */
	public get tiles(): Array<ITileUV> {
		return this._tiles;
	}

	/**
	 * Set uv coordinates on a given geometry.
	 */
	public static mapUVtoGeometry(
		geometry: THREE.Geometry,
		tile: ITileUV): THREE.Geometry {
		geometry.faceVertexUvs[0] = [];
		geometry.faceVertexUvs[0][0] = [tile[3], tile[0], tile[1]];
		geometry.faceVertexUvs[0][1] = [tile[1], tile[2], tile[3]];
		return geometry;
	}

	/**
	 * Create an array of cloned geometries using uv maps from the tiles.
	 */
	public createUVGeometries(seed: THREE.Geometry): Array<THREE.Geometry> {
		let geos: Array<THREE.Geometry> = [];
		for (let tile of this._tiles) {
			let geoClone = TileMapService.mapUVtoGeometry(
				seed.clone(),
				tile);
			geos.push(geoClone);
		}
		return geos;
	}
}