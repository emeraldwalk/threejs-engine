import * as THREE from 'three';
import * as THREE_ORBIT_CONTROLS from 'three-orbit-controls';
import { RendererService } from '../services/renderer.service';

export class BaseView {
	private _renderer: THREE.WebGLRenderer;
	private _scene: THREE.Scene;
	private _camera: THREE.Camera;

	constructor(element: Element, camera?: THREE.Camera) {
		let rendererService = new RendererService({
			width: element.clientWidth,
			height: element.clientHeight,
			element: element
		});

		this._scene = new THREE.Scene();

		let axis = new THREE.AxisHelper(100);
		this._scene.add(axis);

		this._camera = camera || new THREE.PerspectiveCamera(
			75,
			element.clientWidth / element.clientHeight,
			1,
			10000);

		let OrbitControls = THREE_ORBIT_CONTROLS(THREE);

		this._renderer = rendererService.render(
			this._scene,
			this._camera);

		new OrbitControls(
			this._camera,
			element);
	}

	public get scene(): THREE.Scene {
		return this._scene;
	}

	public get camera(): THREE.Camera {
		return this._camera;
	}

	public get renderer(): THREE.WebGLRenderer {
		return this._renderer;
	}
}