import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            external: ['electron'],
            output: {
                format: 'cjs',
                generatedCode: 'es2015',
                interop: 'auto'
            }
        },
    }
});