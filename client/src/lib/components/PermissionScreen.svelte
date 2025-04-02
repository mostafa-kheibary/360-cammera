<script lang="ts">
	import { world } from '../../app/world';
	const { onDone } = $props();

	const getGiroScopePermission = () => {
		if (!$world.deviceMotion) return;
		$world.deviceMotion.connect();
	};
	const getCameraPermission = async () => {
		const cameraVideoElement = document.getElementById('camera-stream') as HTMLVideoElement;
		if (navigator.mediaDevices) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: 'environment' }
				});
				cameraVideoElement.srcObject = stream;
				cameraVideoElement.play();
			} catch (error) {}
		}
	};
</script>

<div class="fixed left-0 top-0 z-50 h-dvh w-full bg-white">
	<div class="flex flex-col gap-5 p-5">
		<div class="flex items-center justify-between gap-2">
			<h5>video camera permission</h5>
			<button
				onclick={getCameraPermission}
				class="rounded-4xl cursor-pointer border border-solid border-gray-300 bg-gray-100 px-2 py-0.5 text-[12px]"
				>give</button
			>
		</div>
		<div class="flex items-center justify-between gap-2">
			<h5>device GyroScope permission</h5>
			<button
				onclick={getGiroScopePermission}
				class="rounded-4xl cursor-pointer border border-solid border-gray-300 bg-gray-100 px-2 py-0.5 text-[12px]"
				>give</button
			>
		</div>
	</div>
	<div class="absolute bottom-0 left-0 w-full p-2">
		<button
			onclick={() => onDone()}
			class="w-full rounded-[8px] border-2 bg-[#ff7142] p-2 text-white">Next</button
		>
	</div>
</div>
