import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const mainTsOptions = {
    include: ['main/**/*'],
    tsconfig: 'main/tsconfig.json',
    compilerOptions: {
        target: 'esnext'
    }
};

const preloadTsOptions = {
    include: ['preload/**/*'],
    tsconfig: 'preload/tsconfig.json',
    compilerOptions: {
        target: 'esnext'
    }
};

export default [
    {
        input: 'main/main.ts',
        output: {
            file: 'dist/main.js',
            format: 'cjs',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve(),
            commonjs(),
            json(),
            typescript(mainTsOptions)
        ],
        external: ['electron']
    },
    {
        input: 'preload/preload.ts',
        output: {
            file: 'dist/preload.js',
            format: 'cjs',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve(),
            typescript(preloadTsOptions)
        ],
        external: ['electron']
    }
];