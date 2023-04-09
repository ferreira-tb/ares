import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '$assets': fileURLToPath(new URL('./renderer/assets', import.meta.url)),
            '$browser': fileURLToPath(new URL('./browser', import.meta.url)),
            '$deimos': fileURLToPath(new URL('./deimos', import.meta.url)),
            '$global': fileURLToPath(new URL('./global', import.meta.url)),
            '$icons': fileURLToPath(new URL('./renderer/components/icons', import.meta.url)),
            '$lib': fileURLToPath(new URL('./browser/lib', import.meta.url)),
            '$modules': fileURLToPath(new URL('./modules', import.meta.url)),
            '$panel': fileURLToPath(new URL('./panel', import.meta.url)),
            '$renderer': fileURLToPath(new URL('./renderer', import.meta.url)),
            '$types': fileURLToPath(new URL('./types', import.meta.url)),
            '$ui': fileURLToPath(new URL('./ui', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        emptyOutDir: false,
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            external: ['electron'],
            input: 'modules.html',
            output: {
                format: 'cjs',
                generatedCode: 'es2015',
                interop: 'auto'
            }
        }
    }
});