import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '$': fileURLToPath(new URL('./preload', import.meta.url)),
            '#': fileURLToPath(new URL('./main', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'preload/preload.ts'),
            fileName: 'preload',
            name: 'preload',
            formats: ['cjs']
        },
        rollupOptions: {
            external: ['electron']
        }
    }
});