import { DeimosError } from '$deimos/shared/error.js';
import { assertString } from '@tb-dev/ts-guard';
import type { TribalWarsGameData } from '$deimos/models/data.js';
import type { PlunderInfo } from '$deimos/models/plunder.js';
import type { Units } from '$deimos/models/units.js';

// Arquivos no diretório "shared" não podem importar de outras partes do Deimos.
// Isso é para evitar que a importações dos protótipos feitas no index vazem para o resto do código.

export class Deimos {
    readonly channel: string;
    readonly message: unknown[];

    constructor(channel: string, ...args: unknown[]) {
        this.channel = channel;
        this.message = args ?? [];
    };

    public static send(channel: 'show-ui-error-message', message: string): void;
    public static send(channel: 'show-ui-info-message', message: string): void;
    public static send(channel: 'show-ui-success-message', message: string): void;
    public static send(channel: string, ...args: unknown[]) {
        channel = this.#handleKey(channel);
        const deimos = new Deimos(channel, ...args);
        window.postMessage(deimos, '*');
    };

    public static invoke(channel: 'get-game-data'): Promise<TribalWarsGameData | null>;
    public static invoke(channel: 'get-current-village-units'): Promise<Units | null>;
    public static invoke(channel: 'get-plunder-info'): Promise<PlunderInfo | null>;
    public static invoke(channel: string, ...args: unknown[]): Promise<unknown> {
        return new Promise((resolve) => {
            channel = this.#handleKey(channel);

            // Usa o UUID para identificar a requisição.
            const uuid = `invoke${crypto.randomUUID()}`;
            const deimos = new Deimos(channel, uuid, ...args);

            const request = (e: MessageEvent<Deimos>) => {
                const handlerUUID = uuid.replace(/^invoke/, 'handle');
                if (e.data.channel === channel && e.data.message[0] === handlerUUID) {
                    window.removeEventListener('message', request);
                    e.data.message.shift();
                    resolve(e.data.message[0]);
                };
            };

            window.addEventListener('message', request);
            window.postMessage(deimos, '*');
        });
    };

    public static handle(channel: 'get-game-data', listener: () => TribalWarsGameData | null): void;
    public static handle(channel: 'get-current-village-units', listener: () => Units | null): void;
    public static handle(channel: 'get-plunder-info', listener: () => PlunderInfo | null): void;
    public static handle(channel: string, listener: (...args: any[]) => unknown): void {
        channel = this.#handleKey(channel);
        window.addEventListener('message', async (e: MessageEvent<Deimos>) => {
            if (e.data.channel === channel) {
                if (typeof e.data.message[0] !== 'string') return;

                // Verifica se há o UUID.
                const regex = /^invoke[a-z,0-9,-]{36}$/;
                if (!regex.test(e.data.message[0])) return;
                
                // Remove o UUID da array e em seguida executa a função.
                const uuid = e.data.message.shift() as string;
                const result = await Promise.resolve().then(() => listener(...e.data.message));

                const handlerUUID = uuid.replace(/^invoke/, 'handle');
                const deimos = new Deimos(channel, handlerUUID, result);
                window.postMessage(deimos, '*');
            };
        });
    };

    public static on(channel: 'show-ui-error-message', listener: (message: string) => void): void;
    public static on(channel: 'show-ui-info-message', listener: (message: string) => void): void;
    public static on(channel: 'show-ui-success-message', listener: (message: string) => void): void;
    public static on(channel: string, listener: (...args: any[]) => void) {
        channel = this.#handleKey(channel);
        window.addEventListener('message', (e: MessageEvent<Deimos>) => {
            if (e.data.channel === channel) {
                Promise.resolve().then(() => listener(...e.data.message))
                    .catch((err: unknown) => DeimosError.catch(err));
            };
        });
    };


    static #handleKey(channel: string) {
        assertString(channel, 'A chave para o Deimos deve ser uma string');
        return `deimos-${channel}`;
    };
};