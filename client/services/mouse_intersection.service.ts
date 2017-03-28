import * as THREE from 'three';

export type IMouseIntersectionHandler = (
	intersections: Array<THREE.Intersection>,
	mouseClick: THREE.Vector2) => void;

/**
 * Register a callback for intersections of mouse clicks with
 * objects in 3D space.
 */
export function registerMouseIntersectionHandler(
	element: Element,
	camera: THREE.Camera,
	intersectionCandidates: Array<THREE.Object3D>,
	handler: IMouseIntersectionHandler) {

	let raycaster = new THREE.Raycaster();
	let mouse = new THREE.Vector2();

	function mouseDown(event: MouseEvent) {
		mouse.x = (event.clientX - this.offsetLeft) / this.width * 2 - 1;
		mouse.y = -(event.clientY - this.offsetTop) / this.height * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		let intersections = raycaster.intersectObjects(intersectionCandidates);

		handler(intersections, mouse);
	}

	element.addEventListener('mousedown', mouseDown);

	return () => element.removeEventListener('mousedown', mouseDown);
}