/* eslint-disable @typescript-eslint/unified-signatures */
import { IpcTribalError } from '$ipc/interface/error';
import type { PlunderInfo, TribalWarsGameData, TribalWarsTiming, GameUnits } from '$ipc/templates';

// Arquivos no diretório "interface" não podem importar de outras partes do IpcTribal.
// Isso é para evitar que a importações dos protótipos feitas no index vazem para o resto do código.

export class IpcTribal {
    private readonly channel: string;
    private readonly message: unknown[];

    private constructor(channel: string, ...args: unknown[]) {
        this.channel = channel;
        this.message = args;
    }

    private static uuid: number = 0;
    private static readonly generateUUID = (type: 'invoke' | 'send') => `${type}${(++this.uuid).toString(10)}`;

    public static send(channel: UIMessageType, message: string): void;
    public static send(channel: string, ...args: unknown[]) {
        channel = this.handleKey(channel);
        const uuid = this.generateUUID('send');
        const ipc = new IpcTribal(channel, uuid, ...args);
        window.postMessage(ipc, '*');
    }

    public static invoke(channel: 'ipc-tribal:current-village-units'): Promise<GameUnits | null>;
    public static invoke(channel: 'ipc-tribal:game-data'): Promise<TribalWarsGameData | null>;
    public static invoke(channel: 'ipc-tribal:incoming-attacks'): Promise<number>;
    public static invoke(channel: 'ipc-tribal:plunder-info'): Promise<PlunderInfo | null>;
    public static invoke(channel: 'ipc-tribal:response-time'): Promise<number | null>;
    public static invoke(channel: 'ipc-tribal:timing'): Promise<TribalWarsTiming | null>;
    public static invoke(channel: string, ...args: unknown[]): Promise<unknown> {
        return new Promise((resolve) => {
            channel = this.handleKey(channel);

            // Usa o UUID para identificar a requisição.
            const uuid = this.generateUUID('invoke');
            const ipc = new IpcTribal(channel, uuid, ...args);

            const request = (e: MessageEvent<IpcTribal>) => {
                const handlerUUID = uuid.replace(/^invoke/, 'handle');
                if (e.data.channel === channel && e.data.message[0] === handlerUUID) {
                    window.removeEventListener('message', request);
                    e.data.message.shift();
                    resolve(e.data.message[0]);
                }
            };

            window.addEventListener('message', request);
            window.postMessage(ipc, '*');
        });
    }

    public static handle(channel: 'ipc-tribal:current-village-units', listener: () => GameUnits | null): void;
    public static handle(channel: 'ipc-tribal:game-data', listener: () => TribalWarsGameData | null): void;
    public static handle(channel: 'ipc-tribal:incoming-attacks', listener: () => number | null): void;
    public static handle(channel: 'ipc-tribal:plunder-info', listener: () => PlunderInfo | null): void;
    public static handle(channel: 'ipc-tribal:response-time', listener: () => number | null): void;
    public static handle(channel: 'ipc-tribal:timing', listener: () => TribalWarsTiming | null): void;
    public static handle(channel: string, listener: (...args: unknown[]) => unknown): void {
        channel = this.handleKey(channel);
        window.addEventListener('message', async (e: MessageEvent<IpcTribal>) => {
            if (e.data.channel === channel) {
                try {
                    if (typeof e.data.message[0] !== 'string') return;

                    // Verifica se há o UUID.
                    const regex = /^invoke\d+$/;
                    if (!regex.test(e.data.message[0])) return;
                    
                    // Remove o UUID da array e em seguida executa a função.
                    const uuid = e.data.message.shift() as string;
                    const result = await Promise.resolve().then(() => listener(...e.data.message));

                    const handlerUUID = uuid.replace(/^invoke/, 'handle');
                    const ipc = new IpcTribal(channel, handlerUUID, result);
                    window.postMessage(ipc, '*');

                } catch (err) {
                    IpcTribalError.catch(err);
                }
            }
        });
    }

    public static on(channel: UIMessageType, listener: (message: string) => void): void;
    public static on(channel: string, listener: (...args: any[]) => void) {
        channel = this.handleKey(channel);
        window.addEventListener('message', async (e: MessageEvent<IpcTribal>) => {
            if (e.data.channel === channel) {
                try {
                    if (typeof e.data.message[0] !== 'string') return;

                    // Verifica se há o UUID.
                    const regex = /^send\d+$/;
                    if (!regex.test(e.data.message[0])) return;

                    e.data.message.shift();
                    await Promise.resolve().then(() => listener(...e.data.message));

                } catch (err) {
                    IpcTribalError.catch(err);
                }
            }
        });
    }


    private static handleKey(channel: string) {
        return `ipc-${channel}`;
    }
}