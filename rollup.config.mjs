import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'main/main.ts',
        output: {
            file: 'dist/main.js',
            format: 'cjs',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve({ extensions: ['.mjs', '.js', '.mts', '.ts', '.json'] }),
            commonjs(),
            json(),
            typescript({ tsconfig: 'main/tsconfig.json' })
        ],
        external: ['electron']
    }
];