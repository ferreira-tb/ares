interface PhobosOptions extends BrowserViewConstructorOptions {
    autoResize?: import('electron').AutoResizeOptions;
    bounds?: import('electron').Rectangle;
    
    /** Define se um Phobos já ativo será destruido ao se tentar criar um novo com o mesmo nome.  */
    override?: boolean;
    /**
     * Se for usado um Phobos já ativo, define se a URL dele deve ser alterada.
     * Ela SEMPRE será alterada caso sua origem for diferente da URL passada ao Phobos.
     */
    overrideUrl?: boolean;
};

type PhobosNames =
    | 'fetch-world-config'
    | 'fetch-world-unit'
    | 'get-village-groups';

type PhobosChannel = PhobosNames;

interface PhobosPortMessage extends Record<string, unknown> {
    channel: PhobosChannel;
};