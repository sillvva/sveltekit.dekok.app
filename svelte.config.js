import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { imagetools } from 'vite-imagetools';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		vite: {
			plugins: [imagetools()],
			define: {
				'process.env': process.env
			},
			optimizeDeps: {
				include: ['highlight.js', 'highlight.js/lib/core']
			}
		}
	}
};

export default config;
