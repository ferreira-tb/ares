type Mechanus = import('mechanus').Mechanus;
type MechanusRef<T> = import('mechanus').MechanusRef<T>;
type MechanusRefOptions<T> = import('mechanus').MechanusRefOptions<T>;
type MechanusComputedRef<T> = import('mechanus').MechanusComputedRef<T>;
type MechanusStore<T> = import('mechanus').MechanusStore<T>;

// GAME DATA
interface GameDataStore extends TribalWarsGameDataType {
    /** Retorna o id da aldeia atual. Essa função emitirá um erro caso o id não seja válido. */
    getVillageId(): number;

    useCoords(): import('vue').ComputedRef<[number | null, number | null]>;
    useTotalResources(): import('vue').ComputedRef<number | null>;
};

type PiniaGameDataStoreType = {
    [K in keyof GameDataStore]:
        GameDataStore[K] extends () => void ? GameDataStore[K] : import('vue').Ref<GameDataStore[K]>;
};

type MechanusGameDataStoreType = {
    [K in keyof RemoveMethods<GameDataStore>]: MechanusRef<RemoveMethods<GameDataStore>[K]>;
};

// CACHE
interface CacheStore {
    readonly world: World | null;
    readonly player: string | null;
    readonly userAlias: UserAlias | null;

    /** Indica se há um captcha ativo. */
    readonly captcha: boolean;
    /** Tempo de resposta do servidor do jogo. */
    readonly responseTime: number | null;
};

type PiniaCacheStoreType = {
    [K in keyof Omit<CacheStore, 'world' | 'player' | 'userAlias'>]: import('vue').Ref<CacheStore[K]>;
};

type MechanusCacheStoreType = {
    [K in keyof CacheStore]:
        K extends 'userAlias' ? MechanusComputedRef<CacheStore[K]> : MechanusRef<CacheStore[K]>;
};

// PLUNDER INFO
type PlunderStore = PlunderInfoType;
type PiniaPlunderStoreType = {
    [K in keyof PlunderStore]: import('vue').Ref<PlunderStore[K]>;
};
type MechanusPlunderStoreType = {
    [K in keyof PlunderStore]: MechanusRef<PlunderStore[K]>;
};

// PLUNDER CONFIG
interface PlunderConfigStore extends PlunderConfigType {
    raw(): PlunderConfigType;
};

type PiniaPlunderConfigStoreType = {
    [K in keyof PlunderConfigStore]:
        PlunderConfigStore[K] extends () => void ? PlunderConfigStore[K] : import('vue').Ref<PlunderConfigStore[K]>;
};

type MechanusPlunderConfigStoreType = {
    [K in keyof RemoveMethods<PlunderConfigStore>]: MechanusRef<RemoveMethods<PlunderConfigStore>[K]>;
};

// PLUNDER HISTORY
interface PlunderHistoryStore extends PlunderHistoryType {
    useTotal(): import('vue').ComputedRef<number>;
};

type PiniaPlunderHistoryStoreType = {
    [K in Exclude<keyof PlunderHistoryStore, 'villages'>]:
        PlunderHistoryStore[K] extends () => void ? PlunderHistoryStore[K] : import('vue').Ref<PlunderHistoryStore[K]>;
};

type MechanusPlunderHistoryStoreType = {
    [K in keyof RemoveMethods<PlunderHistoryStore>]: MechanusRef<RemoveMethods<PlunderHistoryStore>[K]>;
} & {
    proxifyVillages(): PlunderHistoryType['villages'];
    unproxifyVillages(): PlunderHistoryType['villages'];

    toClonable(): PlunderHistoryType;
};

// PLUNDER CACHE
type PlunderCacheStore = PlunderCacheType;
type MechanusPlunderCacheStoreType = {
    [K in keyof PlunderCacheStore]: MechanusRef<PlunderCacheStore[K]>;
};

// UNITS
interface UnitsStore extends UnitAmount {
    raw(): UnitAmount;
};

type PiniaUnitsStoreType = {
    [K in keyof UnitsStore]:
        UnitsStore[K] extends () => void ? UnitsStore[K] : import('vue').Ref<UnitsStore[K]>;
};

type MechanusUnitsStoreType = {
    [K in keyof RemoveMethods<UnitsStore>]: MechanusRef<RemoveMethods<UnitsStore>[K]>;
};

// BROWSER
interface BrowserStore {
    /** Indica se o IpcTribal está pronto para receber comandos. */
    readonly isIpcTribalReady: boolean;
};

type PiniaBrowserStoreType = {
    [K in keyof BrowserStore]: import('vue').Ref<BrowserStore[K]>;
};

// INCOMING ATTACKS
interface IncomingAttacksStore {
    /** Quantidade total de ataques a caminho. */
    readonly amount: number | null;
    /** Ataques a caminho. */
    readonly incomings: IncomingAttack[];
};

type PiniaIncomingAttacksStoreType = {
    [K in keyof IncomingAttacksStore]: import('vue').Ref<IncomingAttacksStore[K]>;
};

type MechanusIncomingAttacksStoreType = {
    [K in keyof RemoveMethods<IncomingAttacksStore>]: MechanusRef<IncomingAttacksStore[K]>;
};

// SNOB CONFIG
interface SnobConfigStore extends SnobConfigType {
    raw(): SnobConfigType;
};

type PiniaSnobConfigStoreType = {
    [K in keyof SnobConfigStore]:
        SnobConfigStore[K] extends () => void ? SnobConfigStore[K] : import('vue').Ref<SnobConfigStore[K]>;
};

// SNOB HISTORY
type SnobHistoryStore = Omit<SnobHistoryType, 'villages'>;

type PiniaSnobHistoryStoreType = {
    [K in SnobHistoryStore]: import('vue').Ref<SnobHistoryStore[K]>;
};