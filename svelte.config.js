import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Options for the adapter (e.g., out: 'build')
			out: 'build'
		}),
		alias: {
			$layouts: 'src/layouts',
			$classes: 'src/classes',
			$utils: 'src/utils',
			$assets: '/src/assets',
			$lib: 'src/lib'
		},
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};

export default config;
