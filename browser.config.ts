import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { join } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '$common': fileURLToPath(new URL('./common', import.meta.url)),
            '$browser': fileURLToPath(new URL('./browser', import.meta.url)),
            '$icons': fileURLToPath(new URL('./renderer/components/icons', import.meta.url)),
            '$ipc': fileURLToPath(new URL('./ipc', import.meta.url)),
            '$lib': fileURLToPath(new URL('./browser/lib', import.meta.url)),
            '$renderer': fileURLToPath(new URL('./renderer', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        emptyOutDir: false,
        minify: true,
        lib: {
            entry: join(__dirname, 'browser/index.ts'),
            fileName: 'browser',
            name: 'browser',
            formats: ['cjs']
        },
        rollupOptions: {
            external: ['electron']
        }
    }
});