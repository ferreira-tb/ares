import ElectronStore from 'electron-store';
import type { Schema } from 'electron-store';

const schema: Schema<AppConfigType> = {
    advanced: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            debug: { type: 'boolean', default: false },
            devTools: { type: 'boolean', default: false },
            visibleWorkers: { type: 'boolean', default: false }
        }
    },
    general: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            lastRegion: { type: 'string', default: 'br' },
            reloadAfterCaptcha: { type: 'boolean', default: true }
        }
    },
    notifications: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            notifyOnError: { type: 'boolean', default: true }
        }
    },
    tags: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            nextIncoming: { type: 'boolean', default: true },
            plunder: { type: 'boolean', default: true },
            responseTime: { type: 'boolean', default: true },
            snob: { type: 'boolean', default: true }
        }
    },
    ui: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            bounds: {
                type: ['object', 'null'],
                additionalProperties: false,
                default: null,
                properties: {
                    x: { type: 'integer' },
                    y: { type: 'integer' },
                    width: { type: 'integer' },
                    height: { type: 'integer' }
                }
            }
        }
    },
    update: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            versionToIgnore: { type: ['string', 'null'], default: null }
        }
    },
    window: {
        type: 'object',
        additionalProperties: true,
        default: {}
    }
};

export const appConfig = new ElectronStore({
    name: 'app-config',
    cwd: 'stores',
    accessPropertiesByDotNotation: true,
    schema
});