import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
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