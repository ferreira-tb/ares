import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { resolve } from 'path';
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
        lib: {
            entry: resolve(__dirname, 'browser/browser.ts'),
            fileName: 'browser',
            name: 'browser',
            formats: ['cjs']
        },
        rollupOptions: {
            external: ['electron']
        }
    }
});