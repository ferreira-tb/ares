import { assertString, isString } from '$shared/guards';
import { IpcTribalError } from '$ipc/interface/error';
import type { PlunderInfo, TribalWarsGameData, TribalWarsTiming, Units } from '$ipc/models';

// Arquivos no diretório "interface" não podem importar de outras partes do IpcTribal.
// Isso é para evitar que a importações dos protótipos feitas no index vazem para o resto do código.

// IMPORTANTE: Não é possível utilizar o IpcTribal a partir do painel.
// A função dele é apenas prover uma forma de comunicação entre o browser e o jogo.

export class IpcTribal {
    readonly channel: string;
    readonly message: unknown[];

    constructor(channel: string, ...args: unknown[]) {
        this.channel = channel;
        this.message = args;
    };

    static #uuid: number = 0;
    static #generateUUID = (type: 'invoke' | 'send') => `${type}${(++this.#uuid).toString(10)}`;

    public static send(channel: UIMessageType, message: string): void;
    public static send(channel: string, ...args: unknown[]) {
        channel = this.#handleKey(channel);
        const uuid = this.#generateUUID('send');
        const deimos = new IpcTribal(channel, uuid, ...args);
        window.postMessage(deimos, '*');
    };

    public static invoke(channel: 'get-current-village-units'): Promise<Units | null>;
    public static invoke(channel: 'get-game-data'): Promise<TribalWarsGameData | null>;
    public static invoke(channel: 'get-incoming-attacks'): Promise<number>;
    public static invoke(channel: 'get-plunder-info'): Promise<PlunderInfo | null>;
    public static invoke(channel: 'get-response-time'): Promise<number | null>;
    public static invoke(channel: 'get-timing'): Promise<TribalWarsTiming | null>;
    public static invoke(channel: string, ...args: unknown[]): Promise<unknown> {
        return new Promise((resolve) => {
            channel = this.#handleKey(channel);

            // Usa o UUID para identificar a requisição.
            const uuid = this.#generateUUID('invoke');
            const deimos = new IpcTribal(channel, uuid, ...args);

            const request = (e: MessageEvent<IpcTribal>) => {
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

    public static handle(channel: 'get-current-village-units', listener: () => Units | null): void;
    public static handle(channel: 'get-game-data', listener: () => TribalWarsGameData | null): void;
    public static handle(channel: 'get-incoming-attacks', listener: () => number): void;
    public static handle(channel: 'get-plunder-info', listener: () => PlunderInfo | null): void;
    public static handle(channel: 'get-response-time', listener: () => number | null): void;
    public static handle(channel: 'get-timing', listener: () => TribalWarsTiming | null): void;
    public static handle(channel: string, listener: (...args: unknown[]) => unknown): void {
        channel = this.#handleKey(channel);
        window.addEventListener('message', async (e: MessageEvent<IpcTribal>) => {
            if (e.data.channel === channel) {
                try {
                    if (!isString(e.data.message[0])) return;

                    // Verifica se há o UUID.
                    const regex = /^invoke\d+$/;
                    if (!regex.test(e.data.message[0])) return;
                    
                    // Remove o UUID da array e em seguida executa a função.
                    const uuid = e.data.message.shift() as string;
                    const result = await Promise.resolve().then(() => listener(...e.data.message));

                    const handlerUUID = uuid.replace(/^invoke/, 'handle');
                    const deimos = new IpcTribal(channel, handlerUUID, result);
                    window.postMessage(deimos, '*');

                } catch (err) {
                    IpcTribalError.catch(err);
                };
            };
        });
    };

    public static on(channel: UIMessageType, listener: (message: string) => void): void;
    public static on(channel: string, listener: (...args: any[]) => void) {
        channel = this.#handleKey(channel);
        window.addEventListener('message', async (e: MessageEvent<IpcTribal>) => {
            if (e.data.channel === channel) {
                try {
                    if (!isString(e.data.message[0])) return;

                    // Verifica se há o UUID.
                    const regex = /^send\d+$/;
                    if (!regex.test(e.data.message[0])) return;

                    e.data.message.shift();
                    await Promise.resolve().then(() => listener(...e.data.message));

                } catch (err) {
                    IpcTribalError.catch(err);
                };
            };
        });
    };


    static #handleKey(channel: string) {
        assertString(channel, 'IpcTribal channel must be a string.');
        return `deimos-${channel}`;
    };
};