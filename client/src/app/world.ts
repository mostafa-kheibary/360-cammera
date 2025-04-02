import { writable } from 'svelte/store';
import * as THREE from 'three';

export interface World {
	scene: THREE.Scene | null;
	renderer: THREE.WebGLRenderer | null;
	camera: THREE.PerspectiveCamera | null;
	deviceMotion: any | null;
}

export const world = writable<World>({
	scene: null,
	renderer: null,
	camera: null,
	deviceMotion: null
});
