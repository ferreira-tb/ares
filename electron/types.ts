import type { ErrorLog, DOMErrorLog } from '#/types.js';

export type CreatePhobosOptions = {
    /** Define se um Phobos já ativo será destruido ao se tentar criar um novo com o mesmo nome.  */
    override?: boolean;
    /**
     * Se for usado um Phobos já ativo, define se a URL dele deve ser alterada.
     * Ela SEMPRE será alterada caso sua origem for diferente da URL passada ao Phobos.
     */
    overrideUrl?: boolean;
}

export type PhobosNames = 'deimos-report';

export interface ErrorLogForDeimos extends ErrorLog {
    readonly electron: string;
    readonly chrome: string;
}

export interface DOMErrorLogForDeimos extends DOMErrorLog {
    readonly url: string;
    readonly world: string | null;
    readonly electron: string;
    readonly chrome: string;
}