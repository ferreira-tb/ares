import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const tsOptions = {
    include: ['main/**/*'],
    tsconfig: 'main/tsconfig.json',
    compilerOptions: {
        target: 'esnext'
    }
};

export default {
    input: 'main/main.ts',
    output: {
        file: 'dist/main.js',
        format: 'cjs'
    },
    plugins: [
        typescript(tsOptions),
        nodeResolve()
    ],
    external: ['electron']
};