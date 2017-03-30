import * as THREE from 'three';

export class RendererService {
	private _renderer: THREE.WebGLRenderer;

	constructor(config: { width?: number, height?: number, element?: Element } = {}) {
		this._renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});

		this._renderer.setSize(
			config.width || window.innerWidth,
			config.height || window.innerHeight);

		this._renderer.shadowMap.enabled = true;

		let element = config.element || document.body;
		element.appendChild(this._renderer.domElement);
	}

	public render(
		scene: THREE.Scene,
		camera: THREE.Camera,
		animate?: (time: number) => THREE.Renderer
	) {
		let animateMain = (time) => {
			if (animate) {
				animate(time);
			}

			this._renderer.render(scene, camera);
			requestAnimationFrame(animateMain);
		};

		requestAnimationFrame(animateMain);

		return this._renderer;
	}
}