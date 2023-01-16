import typescript from '@rollup/plugin-typescript';
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
            format: 'cjs'
        },
        plugins: [
            typescript(mainTsOptions),
            nodeResolve()
        ],
        external: ['electron']
    },
    {
        input: 'preload/preload.ts',
        output: {
            file: 'dist/preload.js',
            format: 'cjs'
        },
        plugins: [
            typescript(preloadTsOptions),
            nodeResolve()
        ],
        external: ['electron']
    }
];