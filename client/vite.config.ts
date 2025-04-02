import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		allowedHosts: ['test1.divarnama.com']
	},
	plugins: [tailwindcss(), sveltekit()]
});
