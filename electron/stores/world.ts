import Store from 'electron-store';
import { MainProcessError } from '../error.js';
import type { JSONSchema, Schema } from '$types/electron.js';

const worldData: JSONSchema = {
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

const eachUnit: JSONSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        // Velocidade base da unidade.
        speed: { type: 'number', default: 0 },
        // Capacidade de carga.
        carry: { type: 'number', default: 0 }
    }
};

const unitData: JSONSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        // Data do último fetch.
        fetch: { type: 'number', default: 0 },
        spear: eachUnit,
        sword: eachUnit,
        axe: eachUnit,
        archer: eachUnit,
        spy: eachUnit,
        light: eachUnit,
        marcher: eachUnit,
        heavy: eachUnit,
        ram: eachUnit,
        catapult: eachUnit,
        knight: eachUnit,
        snob: eachUnit,
        militia: eachUnit
    }
};

const worldSchema: Schema = {
    'world-info': {
        type: 'object',
        additionalProperties: worldData
    },
    'unit-info': {
        type: 'object',
        additionalProperties: unitData
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