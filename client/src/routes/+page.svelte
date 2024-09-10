<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { DeviceOrientationControls } from '../lib/DeviceOri';
	import '../style.css';

	const arr = new Array(24).fill(0);
	let x: any = null;
	const handleClick = () => {
		x.connect();
	};
	onMount(() => {
		const cameraVideoStream = document.getElementById('camera-stream');
		const canvas = document.getElementById('cam');
		if (navigator.mediaDevices) {
			navigator.mediaDevices
				.getUserMedia({ video: { facingMode: 'environment' } })
				.then((stream) => {
					(cameraVideoStream as any).srcObject = stream;
					(cameraVideoStream as any).play();
				});
		}

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		x = new DeviceOrientationControls(camera);

		const ambientLight = new THREE.AmbientLight(0x404040, 20); // Soft white light
		ambientLight.position.y = 5;
		scene.add(ambientLight);

		const pointLight = new THREE.PointLight(0xffffff, 9, 100); // White point light
		pointLight.position.set(0, 0, 1); // Positioning the light above and to the side
		scene.add(pointLight);

		arr.forEach((_, i) => {
			const color = [0x00ff00, 0xff0000];
			const material = new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? color[0] : color[1] });
			const cube = new THREE.Mesh(new THREE.PlaneGeometry(1, 2), material);

			// Step 3: Position each cube in a circle
			const angle = (i / 24) * Math.PI * 2 * 1.5; // Calculate angle for each cube
			cube.position.x = Math.cos(angle) * 3;
			cube.position.z = Math.sin(angle) * 3;
			cube.position.y = 0; // Keep all cubes at the same z level for a flat circle
			cube.lookAt(new THREE.Vector3(0, 0, 0));

			scene.add(cube);
		});

		// Position the camera to view the scene
		camera.position.z = 0;

		// Resize the renderer when the window is resized
		window.addEventListener('resize', () => {
			renderer.setSize(window.innerWidth, window.innerHeight);
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
		});

		// Create a function to animate the scene
		function animate() {
			requestAnimationFrame(animate);
			x.update();
			renderer.render(scene, camera); // Render the scene from the camera's perspective
		}

		// Start the animation loop
		animate();
	});
</script>

<div
	class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center"
>
	<video
		class="opacity-60"
		id="camera-stream"
		width="200px"
		height="500px"
		autoplay
		muted
		playsinline
	>
		<source src="" />
	</video>
	<canvas id="cam" class=""></canvas>
</div>

<div class="fixed bottom-5 left-1/2 -translate-x-1/2 justify-center items-center">
	<button class="bg-white m-5" on:click={handleClick}>permisiion</button>
	<div><button class="w-10 h-10 bg-white">x</button></div>
</div>
