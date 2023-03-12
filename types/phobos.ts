import type { AutoResizeOptions, Rectangle, BrowserViewConstructorOptions } from 'electron';

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
};

export type PhobosNames =
    | 'fetch-world-config'
    | 'fetch-world-unit';

export type PhobosChannel = PhobosNames;

export interface PhobosPortMessage extends Record<string, any> {
    channel: PhobosChannel;
};