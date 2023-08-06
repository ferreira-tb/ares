import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { builtinModules as builtin } from 'node:module';
import { nodeResolve, type RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';
import type { RollupOptions, RollupWarning } from 'rollup';

const externalDeps = [
    'electron',
    'sequelize',
    ...builtin,
    ...builtin.map((m) => `node:${m}`)
];

export default [
    {
        input: 'electron/electron.ts',
        output: output('dist/ares.js'),
        plugins: plugins('electron/tsconfig.json', {
            exportConditions: ['node'],
            ignoreDynamicRequires: true
        }),
        external: externalDeps,

        onwarn(warning: RollupWarning, show: (warning: RollupWarning | string) => void) {
            if (warning.code === 'CIRCULAR_DEPENDENCY') {
                if (warning.message.includes('node_modules/conf/node_modules')) return;
                if (warning.message.includes('node_modules/wkx/lib')) return;
                if (warning.message.includes('node_modules/sequelize')) return;
                if (warning.message.includes('node_modules/semver')) return;
            }

            show(warning);
        }
    },
    {
        input: 'electron/child-process/fetch-world-data.ts',
        output: output('dist/child-process/fetch-world-data.js'),
        plugins: plugins('electron/tsconfig.json', {
            exportConditions: ['node'],
            ignoreDynamicRequires: true
        }),
        external: externalDeps
    },
    {
        input: 'ipc/index.ts',
        output: output('dist/ipc-tw.js', 'iife'),
        plugins: plugins('ipc/tsconfig.json'),
        external: externalDeps
    },
    ...workers()
];

function output(file: string, format: 'cjs' | 'iife' = 'cjs') {
    return {
        file,
        format,
        generatedCode: 'es2015'
    } as const;
}

type PluginOptions = {
    exportConditions?: RollupNodeResolveOptions['exportConditions'];
    ignoreDynamicRequires?: NonNullable<Parameters<typeof commonjs>[0]>['ignoreDynamicRequires'];
};

function plugins(tsconfig: string, options: PluginOptions = {}) {
    const extensions = ['.mjs', '.js', '.mts', '.ts', '.json'];
    
    const nodeResolveOptions: RollupNodeResolveOptions = { extensions };
    if (Array.isArray(options.exportConditions)) {
        nodeResolveOptions.exportConditions = options.exportConditions;
    }

    const commonjsOptions: NonNullable<Parameters<typeof commonjs>[0]> = {};
    if (typeof options.ignoreDynamicRequires === 'boolean') {
        commonjsOptions.ignoreDynamicRequires = options.ignoreDynamicRequires;
    }

    return [
        nodeResolve(nodeResolveOptions),
        commonjs({ ignoreDynamicRequires: true }),
        json(),
        typescript({ tsconfig })
    ];
}

function workers() {
    const workersArray: RollupOptions[] = [
        {
            input: 'worker/tribal/groups/add-villages-to-group.ts',
            output: output('dist/worker/tribal/add-villages-to-group.js')
        },
        {
            input: 'worker/tribal/groups/create-static-group.ts',
            output: output('dist/worker/tribal/create-static-group.js')
        },
        {
            input: 'worker/tribal/units/count-troops.ts',
            output: output('dist/worker/tribal/count-troops.js')
        },
        {
            input: 'worker/tribal/ally/fetch-diplomacy.ts',
            output: output('dist/worker/tribal/fetch-diplomacy.js')
        },
        {
            input: 'worker/tribal/world/fetch-world-config.ts',
            output: output('dist/worker/tribal/fetch-world-config.js')
        },
        {
            input: 'worker/tribal/world/fetch-world-units.ts',
            output: output('dist/worker/tribal/fetch-world-units.js')
        },
        {
            input: 'worker/tribal/groups/get-village-groups.ts',
            output: output('dist/worker/tribal/get-village-groups.js')
        },
        {
            input: 'worker/tribal/incomings/handle-incomings.ts',
            output: output('dist/worker/tribal/handle-incomings.js')
        },
        {
            input: 'worker/tribal/snob/mint-coin.ts',
            output: output('dist/worker/tribal/mint-coin.js')
        },

        // Web Workers
        {
            input: 'worker/web/groups/calc-safe-zone-villages.ts',
            output: output('dist/worker/web/calc-safe-zone-villages.js')
        }
    ];

    const workerPlugins = plugins('worker/tsconfig.json');
    workersArray.forEach((w) => {
        w.plugins = workerPlugins;
        w.external = externalDeps;
    });

    return workersArray;
}