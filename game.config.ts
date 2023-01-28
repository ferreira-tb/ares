import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./painel', import.meta.url)),
            '$': fileURLToPath(new URL('./game', import.meta.url)),
            '#': fileURLToPath(new URL('./global', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        outDir: '__dist__',
        emptyOutDir: false,
        lib: {
            entry: resolve(__dirname, 'game/game.ts'),
            fileName: 'game',
            name: 'game',
            formats: ['cjs']
        },
        rollupOptions: {
            external: ['electron']
        }
    }
});