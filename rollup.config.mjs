import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'electron/main.ts',
    output: {
        file: '__dist__/main.js',
        format: 'cjs',
        generatedCode: 'es2015'
    },
    plugins: [
        nodeResolve({ extensions: ['.mjs', '.js', '.mts', '.ts', '.json'] }),
        commonjs(),
        json(),
        typescript({ tsconfig: 'electron/tsconfig.json' })
    ],
    external: ['electron'],

    onwarn(warning, show) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
            if (warning.message.includes('node_modules/conf/node_modules')) return;
        };

        show(warning);
    }
};