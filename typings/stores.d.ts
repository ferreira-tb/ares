type Mechanus = import('mechanus').Mechanus;
type MechanusRef<T> = import('mechanus').MechanusRef<T>;
type MechanusRefOptions<T> = import('mechanus').MechanusRefOptions<T>;
type MechanusComputedRef<T> = import('mechanus').MechanusComputedRef<T>;
type MechanusStore<T> = import('mechanus').MechanusStore<T>;

// ARES
type AresType = TribalWarsGameDataType['ares'];
interface AresStore extends AresType {
    /** Indica se há um captcha ativo. */
    readonly captcha: boolean;
    /** Tempo de resposta do servidor do jogo. */
    readonly responseTime: number | null;
};
type PiniaAresStoreType = {
    [K in keyof AresStore]: import('vue').Ref<AresStore[K]>;
};
type MechanusAresStoreType = {
    [K in keyof AresStore]: MechanusRef<AresStore[K]>;
};

// PLAYER
type PlayerStore = TribalWarsGameDataType['player'];
type PiniaPlayerStoreType = {
    [K in keyof PlayerStore]: import('vue').Ref<PlayerStore[K]>;
};
type MechanusPlayerStoreType = {
    [K in keyof PlayerStore]: MechanusRef<PlayerStore[K]>;
};

// FEATURES
type FeaturesStore = TribalWarsGameDataType['features'];
type PiniaFeaturesStoreType = {
    [K in keyof FeaturesStore]: import('vue').Ref<FeaturesStore[K]>;
};
type MechanusFeaturesStoreType = {
    [K in keyof FeaturesStore]: MechanusRef<FeaturesStore[K]>;
};

// GROUPS
type GameDataGroups = TribalWarsGameDataType['groups'];
interface GroupsStore extends GameDataGroups {
    /** Todos os grupos de aldeias referentes ao alias atual. */
    readonly all: Set<VillageGroup>;
};
type PiniaGroupsStoreType = {
    [K in keyof GroupsStore]: import('vue').Ref<GroupsStore[K]>;
};
type MechanusGroupsStoreType = {
    [K in keyof GroupsStore]: MechanusRef<GroupsStore[K]>;
};

// CURRENT VILLAGE
type CurrentVillageType = TribalWarsGameDataType['currentVillage'];
interface CurrentVillageStore extends CurrentVillageType {
    readonly coords: [CurrentVillageType['x'], CurrentVillageType['y']];
    readonly totalResources: number | null;

    /**
     * Retorna o id da aldeia atual.
     * Essa função emitirá um erro caso o id não seja um número inteiro.
     */
    getId(): number;
};

type PiniaCurrentVillageStoreActions = CurrentVillageStore['getId'];
type PiniaCurrentVillageStoreType = {
    [K in keyof CurrentVillageStore]:
        CurrentVillageStore[K] extends PiniaCurrentVillageStoreActions ?
        CurrentVillageStore[K] :
        K extends keyof Omit<CurrentVillageStore, keyof CurrentVillageType> ?
        import('vue').ComputedRef<CurrentVillageStore[K]> :
        import('vue').Ref<CurrentVillageStore[K]>;
};

type MechanusCurrentVillageStoreType = {
    [K in keyof RemoveMethods<CurrentVillageStore>]:
        K extends keyof Omit<CurrentVillageStore, keyof CurrentVillageType> ?
        MechanusComputedRef<CurrentVillageStore[K]> :
        MechanusRef<CurrentVillageStore[K]>;
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

type PiniaPlunderConfigStoreActions = PlunderConfigStore['raw'];

type PiniaPlunderConfigStoreType = {
    [K in keyof PlunderConfigStore]:
        PlunderConfigStore[K] extends PiniaPlunderConfigStoreActions ?
        PlunderConfigStore[K] :
        import('vue').Ref<PlunderConfigStore[K]>;
};
type MechanusPlunderConfigStoreType = {
    [K in keyof RemoveMethods<PlunderConfigStore>]: MechanusRef<RemoveMethods<PlunderConfigStore>[K]>;
};

// PLUNDER HISTORY
interface PlunderHistoryStore extends PlunderHistoryType {
    useTotal(): import('vue').ComputedRef<number>;
};
type PiniaPlunderHistoryStoreActions = PlunderHistoryStore['useTotal'];

type PiniaPlunderHistoryStoreType = {
    [K in Exclude<keyof PlunderHistoryStore, 'villages'>]:
        PlunderHistoryStore[K] extends PiniaPlunderHistoryStoreActions ?
        PlunderHistoryStore[K] :
        import('vue').Ref<PlunderHistoryStore[K]>;
};
type MechanusPlunderHistoryStoreType = {
    [K in keyof RemoveMethods<PlunderHistoryStore>]: MechanusRef<RemoveMethods<PlunderHistoryStore>[K]>;
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

type PiniaUnitsStoreActions = UnitsStore['raw'];
type PiniaUnitsStoreType = {
    [K in keyof UnitsStore]:
        UnitsStore[K] extends PiniaUnitsStoreActions ?
        UnitsStore[K] :
        import('vue').Ref<UnitsStore[K]>;
};
type MechanusUnitsStoreType = {
    [K in keyof RemoveMethods<UnitsStore>]: MechanusRef<RemoveMethods<UnitsStore>[K]>;
};

// WORLD CONFIG
type WorldConfigStore = WorldConfigType;
type MechanusWorldConfigStoreType = {
    [K in keyof WorldConfigStore]: MechanusRef<WorldConfigStore[K]>;
};

// WORLD UNIT
type WorldUnitStoresMap = ReadonlyMap<AllUnits, () => MechanusStore<UnitDetails>>;
type MechanusWorldUnitStoreType = {
    [K in keyof UnitDetails]: MechanusRef<UnitDetails[K]>;
};

// CACHE
interface CacheStore {
    readonly region: GameRegion;
    readonly world: World | null;
    readonly player: string | null;
    readonly userAlias: UserAlias | null;
};

type MechanusCacheStoreType = {
    [K in keyof CacheStore]:
        K extends 'userAlias' ?
        MechanusComputedRef<CacheStore[K]> :
        MechanusRef<CacheStore[K]>;
};

// BROWSER VIEW
interface BrowserViewStore {
    /** Todos os WebContents de BrowserViews associados à janela principal. */
    readonly allWebContents: Set<WebContents>;
    /** Todos os WebContents de BrowserViews com eventos já registrados. */
    readonly registeredWebContents: WeakSet<WebContents>;
    /** O WebContents atualmente ativo (em primeiro plano). */
    readonly currentWebContents: Electron.WebContents | null;
    /** Função para remover o evento de redimensionamento do WebContents ativo. */
    readonly currentAutoResize: (() => void) | null;
};

type MechanusBrowserViewStoreType = {
    [K in keyof BrowserViewStore]: MechanusRef<BrowserViewStore[K]>;
};

// BROWSER
interface BrowserStore {
    /** Indica se o IpcTribal está pronto para receber comandos. */
    readonly isIpcTribalReady: boolean;
};

type PiniaBrowserStoreType = {
    [K in keyof BrowserStore]: import('vue').Ref<BrowserStore[K]>;
};

// PAINEL
interface PanelStore {
    /** Indica se o painel está visível. */
    readonly isVisible: boolean;
};

type PiniaPanelStoreType = {
    [K in keyof PanelStore]: import('vue').Ref<PanelStore[K]>;
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

type PiniaSnobConfigStoreActions = SnobConfigStore['raw'];

type PiniaSnobConfigStoreType = {
    [K in keyof SnobConfigStore]:
        SnobConfigStore[K] extends PiniaSnobConfigStoreActions ?
        SnobConfigStore[K] :
        import('vue').Ref<SnobConfigStore[K]>;
};

// SNOB HISTORY
type SnobHistoryStore = Omit<SnobHistoryType, 'villages'>;

type PiniaSnobHistoryStoreType = {
    [K in SnobHistoryStore]: import('vue').Ref<SnobHistoryStore[K]>;
};