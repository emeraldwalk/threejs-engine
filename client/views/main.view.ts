import * as THREE from 'three';
import { BaseView } from './base.view';

let mainViewElement: Element = document.getElementsByClassName('main-view')[0];
let view = new BaseView(mainViewElement);

view.camera.position.set(mainViewElement.clientHeight, mainViewElement.clientHeight / 2, mainViewElement.clientHeight);
view.camera.lookAt(view.scene.position);

// import * as THREE_ORBIT_CONTROLS from 'three-orbit-controls';
// import { RendererService } from '../services/renderer.service';

// let mainViewElement: Element = document.getElementsByClassName('main-view')[0];

// let renderer = new RendererService({
// 	width: mainViewElement.clientWidth,
// 	height: mainViewElement.clientHeight,
// 	element: mainViewElement
// });

// let scene: THREE.Scene = new THREE.Scene();

// let axis = new THREE.AxisHelper(100);
// scene.add(axis);

// let perCamera = new THREE.PerspectiveCamera(
// 	75,
// 	mainViewElement.clientWidth / mainViewElement.clientHeight,
// 	1,
// 	1000);

// perCamera.position.set(mainViewElement.clientHeight, mainViewElement.clientHeight / 2, mainViewElement.clientHeight);
// perCamera.lookAt(scene.position);

// let OrbitControls = THREE_ORBIT_CONTROLS(THREE);


// renderer.render(scene, perCamera);
// new OrbitControls(perCamera, mainViewElement);