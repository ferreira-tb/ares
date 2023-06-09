import ElectronStore, { type Schema } from 'electron-store';

const schema: Schema<AppConfigType> = {
    general: {
        type: 'object',
        additionalProperties: false,
        default: {},
        properties: {
            lastRegion: { type: 'string', default: 'br' },
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
            notifyOnError: { type: 'boolean', default: true }
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

export const appConfig = new ElectronStore({
    name: 'app-config',
    cwd: 'stores',
    accessPropertiesByDotNotation: true,
    schema
});