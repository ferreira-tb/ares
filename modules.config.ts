import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '$types': fileURLToPath(new URL('./types', import.meta.url)),
            '$browser': fileURLToPath(new URL('./browser', import.meta.url)),
            '$global': fileURLToPath(new URL('./global', import.meta.url)),
            '$vue': fileURLToPath(new URL('./vue', import.meta.url)),
            '$deimos': fileURLToPath(new URL('./deimos', import.meta.url)),
            '$phobos': fileURLToPath(new URL('./phobos', import.meta.url)),
            '$modules': fileURLToPath(new URL('./modules', import.meta.url)),
            '$panel': fileURLToPath(new URL('./panel', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
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