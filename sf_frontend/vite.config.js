import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    //if you have aliases:
    resolve: {
        alias: {
            '@': '/src',
        }
    },
    // For R3F models/assets, you might need to ensure assets are handled:
    // e.g., assetsDir: 'assets', etc.
    optimizeDeps: { 
        esbuildOptions: { force:true, loader:{ '.js': 'jsx' } } },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.js",
    },
});