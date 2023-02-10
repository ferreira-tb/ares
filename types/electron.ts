import type { AutoResizeOptions, Rectangle, BrowserViewConstructorOptions } from 'electron';
import type { Schema as StoreSchema } from 'electron-store';
import type { ErrorLog, DOMErrorLog } from '$types/error.js';

export type Schema = StoreSchema<Record<string, unknown>>;
export type JSONSchema = Schema[keyof Schema];

export interface PhobosOptions extends BrowserViewConstructorOptions {
    autoResize?: AutoResizeOptions;
    bounds?: Rectangle;
    
    /** Define se um Phobos já ativo será destruido ao se tentar criar um novo com o mesmo nome.  */
    override?: boolean;
    /**
     * Se for usado um Phobos já ativo, define se a URL dele deve ser alterada.
     * Ela SEMPRE será alterada caso sua origem for diferente da URL passada ao Phobos.
     */
    overrideUrl?: boolean;
}

export type PhobosNames = 'deimos-report';

/** Representa o objeto que é enviado ao Deimos ao se fazer uma requisição. */
export interface ErrorLogRequest extends ErrorLog {
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
}

/** Representa a resposta do Deimos após requisição dos itens no banco de dados. */
export interface ErrorLogResponse extends ErrorLogRequest {
    readonly id: number;
}

/** Representa o objeto que é enviado ao Deimos ao se fazer uma requisição. */
export interface DOMErrorLogRequest extends DOMErrorLog {
    readonly url: string;
    readonly world: string | null;
    readonly ares: string;
    readonly electron: string;
    readonly chrome: string;
}

/** Representa a resposta do Deimos após requisição dos itens no banco de dados. */
export interface DOMErrorLogResponse extends DOMErrorLogRequest {
    readonly id: number;
}