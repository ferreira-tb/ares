import Store from 'electron-store';
import type { Schema } from 'electron-store';

const falseDefault: Record<string, unknown> = {
    type: 'boolean',
    default: false
};

const plunderSchema: Schema<Record<string, unknown>> = {
    'plunder-state': {
        type: 'object',
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