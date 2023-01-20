import Store from 'electron-store';
import type { Schema } from 'electron-store';

const plunderSchema: Schema<Record<string, unknown>> = {
    'plunder-state': {
        type: 'object',
        additionalProperties: false,
        properties: {
            status: { type: 'boolean', default: false },
            ignoreWall: { type: 'boolean', default: false },
            destroyWall: { type: 'boolean', default: false },
            groupAttack: { type: 'boolean', default: false },
            useCModel: { type: 'boolean', default: false },
            ignoreDelay: { type: 'boolean', default: false },
            blindAttack: { type: 'boolean', default: false }
        }
    }
};

export const plunderStore = new Store({
    name: 'plunder',
    schema: plunderSchema,
    accessPropertiesByDotNotation: true
});