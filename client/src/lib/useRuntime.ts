import { onMount } from 'svelte';

export const useRuntime = (init: () => any, animate: () => any) => {
	onMount(() => {
		init();
		localAnimate();
	});

	function localAnimate() {
		requestAnimationFrame(localAnimate);
		animate();
	}
};
