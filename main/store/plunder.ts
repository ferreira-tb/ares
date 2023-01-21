import Store from 'electron-store';
import type { JSONSchema, Schema } from '@/types.js';

const stateChema: JSONSchema = {
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
};

const historyEntry: JSONSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        wood: { type: 'number', default: 0 },
        stone: { type: 'number', default: 0 },
        iron: { type: 'number', default: 0 },
        total: { type: 'number', default: 0 },
        attackAmount: { type: 'number', default: 0 }
    }
};

const history: JSONSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        last: historyEntry,
        total: historyEntry
    }
};

const plunderSchema: Schema = {
    'plunder-state': {
        type: 'object',
        additionalProperties: stateChema
    },
    'history': {
        type: 'object',
        additionalProperties: history
    }
};

export const plunderStore = new Store({
    name: 'plunder',
    schema: plunderSchema,
    accessPropertiesByDotNotation: true
});