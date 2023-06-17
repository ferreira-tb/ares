import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '$common': fileURLToPath(new URL('./common', import.meta.url)),
            '$icons': fileURLToPath(new URL('./renderer/components/icons', import.meta.url)),
            '$ipc': fileURLToPath(new URL('./ipc', import.meta.url)),
            '$panel': fileURLToPath(new URL('./panel', import.meta.url)),
            '$renderer': fileURLToPath(new URL('./renderer', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        emptyOutDir: false,
        chunkSizeWarningLimit: 2000,
        minify: true,
        rollupOptions: {
            external: ['electron'],
            input: 'panel.html',
            output: {
                format: 'cjs',
                generatedCode: 'es2015',
                interop: 'auto'
            }
        }
    }
});