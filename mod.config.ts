import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./panel', import.meta.url)),
            '$': fileURLToPath(new URL('./browser', import.meta.url)),
            '#': fileURLToPath(new URL('./global', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: '__dist__',
        emptyOutDir: false,
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