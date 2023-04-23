import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const extensions = ['.mjs', '.js', '.mts', '.ts', '.json'];

export default [
    {
        input: 'electron/electron.ts',
        output: {
            file: 'dist/ares.js',
            format: 'cjs',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve({ extensions, exportConditions: ['node'] }),
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
                if (warning.message.includes('node_modules/semver')) return;
            };

            show(warning);
        }
    },
    {
        input: 'electron/child-process/world-data.ts',
        output: {
            file: 'dist/child-process/world-data.js',
            format: 'cjs',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve({ extensions, exportConditions: ['node'] }),
            commonjs({ ignoreDynamicRequires: true }),
            json(),
            typescript({ tsconfig: 'electron/tsconfig.json' })
        ],
        external: ['electron']
    },
    {
        input: 'deimos/index.ts',
        output: {
            file: 'dist/deimos.js',
            format: 'iife',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve({ extensions }),
            commonjs(),
            json(),
            typescript({ tsconfig: 'deimos/tsconfig.json' })
        ],
        external: ['electron']
    },
    {
        input: 'phobos/index.ts',
        output: {
            file: 'dist/phobos.js',
            format: 'cjs',
            generatedCode: 'es2015'
        },
        plugins: [
            nodeResolve({ extensions }),
            commonjs(),
            json(),
            typescript({ tsconfig: 'phobos/tsconfig.json' })
        ],
        external: ['electron']
    }
];