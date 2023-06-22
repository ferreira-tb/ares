import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve, type RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';
import type { RollupOptions, RollupWarning } from 'rollup';

export default [
    {
        input: 'electron/electron.ts',
        output: output('dist/ares.js'),
        plugins: plugins('electron/tsconfig.json', {
            exportConditions: ['node'],
            ignoreDynamicRequires: true
        }),
        external: ['electron'],

        onwarn(warning: RollupWarning, show: (warning: RollupWarning | string) => void) {
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
        input: 'electron/child-process/fetch-world-data.ts',
        output: output('dist/child-process/fetch-world-data.js'),
        plugins: plugins('electron/tsconfig.json', {
            exportConditions: ['node'],
            ignoreDynamicRequires: true
        }),
        external: ['electron']
    },
    {
        input: 'ipc/index.ts',
        output: output('dist/ipc-tw.js', 'iife'),
        plugins: plugins('ipc/tsconfig.json'),
        external: ['electron']
    },
    ...workers()
];

function output(file: string, format: 'cjs' | 'iife' = 'cjs') {
    return {
        file,
        format,
        generatedCode: 'es2015'
    } as const;
};

type PluginOptions = {
    exportConditions?: RollupNodeResolveOptions['exportConditions'];
    ignoreDynamicRequires?: NonNullable<Parameters<typeof commonjs>[0]>['ignoreDynamicRequires'];
};

function plugins(tsconfig: string, options: PluginOptions = {}) {
    const extensions = ['.mjs', '.js', '.mts', '.ts', '.json'];
    
    const nodeResolveOptions: RollupNodeResolveOptions = { extensions };
    if (Array.isArray(options.exportConditions)) {
        nodeResolveOptions.exportConditions = options.exportConditions;
    };

    const commonjsOptions: NonNullable<Parameters<typeof commonjs>[0]> = {};
    if (typeof options.ignoreDynamicRequires === 'boolean') {
        commonjsOptions.ignoreDynamicRequires = options.ignoreDynamicRequires;
    };

    return [
        nodeResolve(nodeResolveOptions),
        commonjs({ ignoreDynamicRequires: true }),
        json(),
        typescript({ tsconfig })
    ];
};

function workers(): RollupOptions[] {
    const workerPlugins = plugins('worker/tsconfig.json');
    return [
        {
            input: 'worker/tribal/groups/add-villages-to-group.ts',
            output: output('dist/worker/tribal/add-villages-to-group.js'),
            plugins: workerPlugins,
            external: ['electron']
        },
        {
            input: 'worker/tribal/groups/create-static-group.ts',
            output: output('dist/worker/tribal/create-static-group.js'),
            plugins: workerPlugins,
            external: ['electron']
        },
        {
            input: 'worker/tribal/troops/count-troops.ts',
            output: output('dist/worker/tribal/count-troops.js'),
            plugins: workerPlugins,
            external: ['electron']
        },
        {
            input: 'worker/tribal/ally/fetch-diplomacy.ts',
            output: output('dist/worker/tribal/fetch-diplomacy.js'),
            plugins: workerPlugins,
            external: ['electron']
        },
        {
            input: 'worker/tribal/world/fetch-world-config.ts',
            output: output('dist/worker/tribal/fetch-world-config.js'),
            plugins: workerPlugins,
            external: ['electron']
        },
        {
            input: 'worker/tribal/world/fetch-world-units.ts',
            output: output('dist/worker/tribal/fetch-world-units.js'),
            plugins: workerPlugins,
            external: ['electron']
        },
        {
            input: 'worker/tribal/groups/get-village-groups.ts',
            output: output('dist/worker/tribal/get-village-groups.js'),
            plugins: workerPlugins,
            external: ['electron']
        },
        {
            input: 'worker/tribal/incomings/handle-incomings.ts',
            output: output('dist/worker/tribal/handle-incomings.js'),
            plugins: workerPlugins,
            external: ['electron']
        },
        {
            input: 'worker/tribal/snob/mint-coin.ts',
            output: output('dist/worker/tribal/mint-coin.js'),
            plugins: workerPlugins,
            external: ['electron']
        },

        {
            input: 'worker/web/groups/calc-safe-zone-villages.ts',
            output: output('dist/worker/web/calc-safe-zone-villages.js'),
            plugins: workerPlugins,
            external: ['electron']
        }
    ];
};