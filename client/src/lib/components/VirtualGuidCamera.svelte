<script lang="ts">
	import { useRuntime } from '$lib/useRuntime';
	import * as THREE from 'three';
	import { DeviceOrientationControls } from '../DeviceOri';
	import { world } from '../../app/world';
	import type Circle from 'progressbar.js/circle';

	let capturePoints: THREE.Mesh[] = $state([]);
	let activeCapturePointName: null | string = $state(null);
	let images: string[][] = [];
	let activeVerticalTileIndex: number = 0;
	let captureTimeout: number | null = null;
	let circularCaptureLoading: Circle | null = null;
	let capturedPoint: string[] = [];

	const itemAround = 8;

	$effect(() => {
		if (!activeCapturePointName) {
			clearTimeout(captureTimeout as any);
			captureTimeout = null;
			circularCaptureLoading?.set(0);
			return;
		}
		const isPointAlreadyCaptured = Boolean(
			capturedPoint.find((point) => point === activeCapturePointName)
		);
		if (isPointAlreadyCaptured) return;

		circularCaptureLoading?.animate(1);
		captureTimeout = setTimeout(() => {
			captureTileImage();
			circularCaptureLoading?.set(0);
			if (captureTimeout) {
				clearTimeout(captureTimeout);
				captureTimeout = null;
			}
		}, 1500);
	});

	const captureTileImage = () => {
		if (!activeCapturePointName) return;
		const video = document.getElementById('camera-stream') as HTMLVideoElement;
		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
		const imageData = canvas.toDataURL('image/png');
		if (!images[activeVerticalTileIndex]) images[activeVerticalTileIndex] = [];

		if (images[activeVerticalTileIndex].length === 3) {
			activeVerticalTileIndex++;
			images[activeVerticalTileIndex] = [];
		}
		images[activeVerticalTileIndex].push(imageData);
		const currentCapturePoint = capturePoints.find(
			(point) => point.name === activeCapturePointName
		);
		if (currentCapturePoint) {
			const ob = $world.scene?.getObjectByName(`guid-${currentCapturePoint.name}`) as THREE.Mesh;
			const xx = new THREE.CanvasTexture(canvas);
			xx.colorSpace = THREE.SRGBColorSpace;
			ob.material = new THREE.MeshBasicMaterial({ map: xx });
			capturedPoint.push(currentCapturePoint.name);
			currentCapturePoint.material = new THREE.MeshBasicMaterial({
				color: 0x008000,
				side: THREE.FrontSide
			});
		}
	};

	const setupThe3DWorld = () => {
		const virtualGuidCanvas = document.getElementById('virtual-guid') as HTMLCanvasElement;
		let scene = new THREE.Scene();
		let camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
		let renderer = new THREE.WebGLRenderer({ antialias: true });
		camera.position.z = 0;
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(window.innerWidth, window.innerHeight);
		virtualGuidCanvas.appendChild(renderer.domElement);
		let deviceMotion = new DeviceOrientationControls(camera);
		world.set({ camera, deviceMotion, renderer, scene });
	};
	const createGuidPanelObject = (index: number, y: number, name: string) => {
		const angle = (index / itemAround) * Math.PI * 2;
		const guidPanelMaterial = new THREE.MeshBasicMaterial({
			color: 0x000000,
			opacity: 0.2,
			side: THREE.FrontSide
		});
		guidPanelMaterial.transparent = true;
		const guidPanelPlaneMesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 8), guidPanelMaterial);
		guidPanelPlaneMesh.position.x = Math.cos(angle) * 6;
		guidPanelPlaneMesh.position.z = Math.sin(angle) * 6;
		guidPanelPlaneMesh.position.y = y;
		guidPanelPlaneMesh.lookAt(new THREE.Vector3(0, 0, 0));
		guidPanelPlaneMesh.name = `guid-${name}-${index}`;
		$world.scene?.add(guidPanelPlaneMesh);
	};
	const createCapturePointObject = (index: number, y: number, name: string) => {
		const angle = (index / itemAround) * Math.PI * 2;
		const capturePointMaterial = new THREE.MeshBasicMaterial({
			color: 0xff7142,
			side: THREE.FrontSide
		});
		const capturePointMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(0.3, 0.3),
			capturePointMaterial
		);
		capturePointMesh.position.x = Math.cos(angle) * 5.9;
		capturePointMesh.position.z = Math.sin(angle) * 5.9;
		capturePointMesh.position.y = y;
		capturePointMesh.lookAt(new THREE.Vector3(0, 0, 0));
		capturePointMesh.name = `${name}-${index}`;
		$world.scene?.add(capturePointMesh);
		capturePoints.push(capturePointMesh);
	};
	function checkCapturePointIsIntersected() {
		if (!$world.camera) return;
		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(new THREE.Vector2(0, 0), $world.camera);
		const intersects = raycaster.intersectObjects(capturePoints);
		if (intersects.length <= 0) return (activeCapturePointName = null);
		const mesh = intersects[0].object;
		activeCapturePointName = mesh.name;
	}

	const init = async () => {
		const ProgressBar = (await import('progressbar.js')).default;
		circularCaptureLoading = new ProgressBar.Circle('#loader', {
			easing: 'linear',
			strokeWidth: 10,
			trailWidth: 2,
			color: '#fff',
			duration: 1500
		});
		setupThe3DWorld();
		const virtualGuidPanelCount = new Array(itemAround).fill(0);
		for (let i in virtualGuidPanelCount) {
			const index = +i;
			createGuidPanelObject(index, -8, 't');
			createGuidPanelObject(index, 0, 'c');
			createGuidPanelObject(index, 8, 'b');
			createCapturePointObject(index, -8, 't');
			createCapturePointObject(index, 0, 'c');
			createCapturePointObject(index, 8, 'b');
		}
	};
	const animate = () => {
		if (!$world.renderer || !$world.scene || !$world.camera || !$world.deviceMotion) return;
		$world.deviceMotion.update();
		$world.renderer.render($world.scene, $world.camera);
		checkCapturePointIsIntersected();
	};

	useRuntime(init, animate);
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
</svelte:head>

<div class="h-dvh w-dvw touch-none">
	<video
		class="h-full w-full object-cover"
		id="camera-stream"
		autoplay
		muted
		playsinline
		controls={false}
	>
		<source src="" />
	</video>
	<canvas id="camera-canves" class="hidden"></canvas>
</div>
<div class="container fixed top-0 touch-none" id="virtual-guid"></div>

<div
	id="loader"
	class="pointer-none fixed left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full"
>
	<div
		class="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
	></div>
</div>
