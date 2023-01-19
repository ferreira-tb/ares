import Store from 'electron-store';
import { falseDefault } from '#/store/defaults.js';
import type { Schema } from 'electron-store';

const plunderSchema: Schema<Record<string, unknown>> = {
    'plunder-state': {
        type: 'object',
        additionalProperties: false,
        properties: {
            status: falseDefault,
            ignoreWall: falseDefault,
            destroyWall: falseDefault,
            groupAttack: falseDefault,
            useCModel: falseDefault,
            ignoreDelay: falseDefault,
            blindAttack: falseDefault
        }
    }
};

export const plunderStore = new Store({
    name: 'plunder',
    schema: plunderSchema
});