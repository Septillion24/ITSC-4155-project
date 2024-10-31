import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['**/*.{test,spec}.{js,ts}'], // Include test files with .test.ts or .spec.ts extensions
		globals: true,
		environment: 'node' // Use 'node' environment to avoid loading browser-specific files
	}
});
