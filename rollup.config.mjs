import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'electron/main.ts',
        output: {
            file: 'dist/ares.js',
            format: 'cjs',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve({ extensions: ['.mjs', '.js', '.mts', '.ts', '.json'], exportConditions: ['node'] }),
            commonjs({ ignoreDynamicRequires: true }),
            json(),
            typescript({ tsconfig: 'electron/tsconfig.json' })
        ],
        external: ['electron'],

        onwarn(warning, show) {
            if (warning.code === 'CIRCULAR_DEPENDENCY') {
                if (warning.message.includes('node_modules/conf/node_modules')) return;
                if (warning.message.includes('node_modules/wkx/lib')) return;
                if (warning.message.includes('node_modules/sequelize')) return;
            };

            show(warning);
        }
    },
    {
        input: 'deimos/deimos.ts',
        output: {
            file: 'dist/deimos.js',
            format: 'iife',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve({ extensions: ['.mjs', '.js', '.mts', '.ts', '.json'] }),
            commonjs(),
            json(),
            typescript({ tsconfig: 'deimos/tsconfig.json' })
        ]
    },
    {
        input: 'phobos/phobos.ts',
        output: {
            file: 'dist/phobos.js',
            format: 'cjs',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve({ extensions: ['.mjs', '.js', '.mts', '.ts', '.json'] }),
            commonjs(),
            json(),
            typescript({ tsconfig: 'phobos/tsconfig.json' })
        ],
        external: ['electron']
    }
];