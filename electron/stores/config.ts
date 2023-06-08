import Store, { type Schema } from 'electron-store';

const schema: Schema<AppConfigType> = {
    cache: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            lastRegion: { type: 'string', default: 'br' }
        }
    },
    general: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            reloadAfterCaptcha: { type: 'boolean', default: true }
        }
    },
    panel: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            show: { type: 'boolean', default: true },
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
    notifications: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            notifyOnError: { type: 'boolean', default: process.env.ARES_MODE === 'dev' }
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
    }
};

export const appConfig = new Store({
    name: 'app-config',
    cwd: 'stores',
    accessPropertiesByDotNotation: true,
    schema
});