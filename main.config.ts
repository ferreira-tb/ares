import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '$types': fileURLToPath(new URL('./types', import.meta.url)),
            '$browser': fileURLToPath(new URL('./browser', import.meta.url)),
            '$lib': fileURLToPath(new URL('./browser/lib', import.meta.url)),
            '$global': fileURLToPath(new URL('./global', import.meta.url)),
            '$styles': fileURLToPath(new URL('./global/assets', import.meta.url)),
            '$vue': fileURLToPath(new URL('./vue', import.meta.url)),
            '$deimos': fileURLToPath(new URL('./deimos', import.meta.url)),
            '$phobos': fileURLToPath(new URL('./phobos', import.meta.url)),
            '$modules': fileURLToPath(new URL('./modules', import.meta.url)),
            '$panel': fileURLToPath(new URL('./panel', import.meta.url)),
            '$icons': fileURLToPath(new URL('./vue/components/icons', import.meta.url)),
            '$main': fileURLToPath(new URL('./main', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        emptyOutDir: false,
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            external: ['electron'],
            input: 'main.html',
            output: {
                format: 'cjs',
                generatedCode: 'es2015',
                interop: 'auto'
            }
        }
    }
});