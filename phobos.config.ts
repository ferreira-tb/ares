import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '$types': fileURLToPath(new URL('./types', import.meta.url)),
            '$browser': fileURLToPath(new URL('./browser', import.meta.url)),
            '$global': fileURLToPath(new URL('./global', import.meta.url)),
            '$vue': fileURLToPath(new URL('./vue', import.meta.url)),
            '$phobos': fileURLToPath(new URL('./phobos', import.meta.url)),
            '$modules': fileURLToPath(new URL('./modules', import.meta.url)),
            '$panel': fileURLToPath(new URL('./panel', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: '__dist__',
        emptyOutDir: false,
        lib: {
            entry: resolve(__dirname, 'phobos/phobos.ts'),
            fileName: 'phobos',
            name: 'phobos',
            formats: ['cjs']
        },
        rollupOptions: {
            external: ['electron']
        }
    }
});