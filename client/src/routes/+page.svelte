<script lang="ts">
	import PermissionScreen from '$lib/components/PermissionScreen.svelte';
	import VirtualGuidCamera from '$lib/components/VirtualGuidCamera.svelte';

	let permissionAllowed = false;
</script>

{#if !permissionAllowed}
	<PermissionScreen onDone={() => (permissionAllowed = true)} />
{/if}
<VirtualGuidCamera />

<header class="fixed left-0 top-0 w-full p-4">
	<div class="flex w-full items-center justify-between">
		<div class="rounded-ful h-5 w-5 -translate-x-1/2"></div>
	</div>
	<div class="flex w-full items-start gap-0">
		<!-- {#each images as verticalTile}
			<div class="flex flex-col items-start justify-start">
				{#each verticalTile as tile}
					<img src={tile} width="50px" height="50px" class="object-cover" alt="" />
				{/each}
			</div>
		{/each} -->
	</div>
</header>
