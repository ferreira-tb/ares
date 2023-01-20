import Store from 'electron-store';
import { MainProcessError } from '#/error.js';
import type { JSONSchema, Schema } from '@/types.js';

const worldDataSchema: JSONSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        // Data do último fetch.
        fetch: { type: 'number', default: 0 },
        // Velocidade do mundo.
        speed: { type: 'number', default: 0 },
        // Velocidade das unidades.
        unitSpeed: { type: 'number', default: 0 },
        // Indica se o mundo possui arqueiros.
        archer: { type: 'boolean', default: false }
    }
};

const eachUnitSchema: JSONSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        // Velocidade base da unidade.
        speed: { type: 'number', default: 0 },
        // Capacidade de carga.
        carry: { type: 'number', default: 0 }
    }
};

const unitDataSchema: JSONSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        // Data do último fetch.
        fetch: { type: 'number', default: 0 },
        spear: eachUnitSchema,
        sword: eachUnitSchema,
        axe: eachUnitSchema,
        archer: eachUnitSchema,
        spy: eachUnitSchema,
        light: eachUnitSchema,
        marcher: eachUnitSchema,
        heavy: eachUnitSchema,
        ram: eachUnitSchema,
        catapult: eachUnitSchema,
        knight: eachUnitSchema,
        snob: eachUnitSchema,
        militia: eachUnitSchema
    }
};

const worldSchema: Schema = {
    'world-info': {
        type: 'object',
        additionalProperties: worldDataSchema
    },
    'unit-info': {
        type: 'object',
        additionalProperties: unitDataSchema
    }
};

export const worldStore = new Store({
    name: 'world',
    schema: worldSchema,
    accessPropertiesByDotNotation: true
});

export function setIntoWorldStore(key: string, value: unknown): boolean {
    try {
        worldStore.set(key, value);
        return true;

    } catch (err) {
        MainProcessError.handle(err);
        return false;
    };
};