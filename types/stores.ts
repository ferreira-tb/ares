import type { ComputedRef, Ref } from 'vue';
import type { WebContents } from 'electron';
import type { MechanusComputedRef, MechanusRef, MechanusStore } from 'mechanus';
import type { RemoveMethods } from '$types/utils';
import type { WorldConfigType } from '$types/world';
import type { UnitDetails } from '$types/world';
import type { UserAlias } from '$types/electron';

import type {
    AllUnits,
    TribalWarsGameDataType,
    UnitAmount,
    VillageGroup,
    World
} from '$types/game';

import type {
    PlunderInfoType,
    PlunderConfigType,
    PlunderAttackDetails,
    PlunderCacheType
} from '$types/plunder';

////// ARES
type AresType = TribalWarsGameDataType['ares'];
export interface AresStore extends AresType {
    /** Indica se há um captcha ativo. */
    readonly captcha: boolean;
    /** Tempo de resposta do servidor do jogo. */
    readonly responseTime: number | null;
};
export type PiniaAresStoreType = {
    [K in keyof AresStore]: Ref<AresStore[K]>;
};
export type MechanusAresStoreType = {
    [K in keyof AresStore]: MechanusRef<AresStore[K]>;
};

////// PLAYER
export type PlayerStore = TribalWarsGameDataType['player'];
export type PiniaPlayerStoreType = {
    [K in keyof PlayerStore]: Ref<PlayerStore[K]>;
};
export type MechanusPlayerStoreType = {
    [K in keyof PlayerStore]: MechanusRef<PlayerStore[K]>;
};

////// CURRENT VILLAGE
type CurrentVillageType = TribalWarsGameDataType['currentVillage'];
export interface CurrentVillageStore extends CurrentVillageType {
    readonly coords: [CurrentVillageType['x'], CurrentVillageType['y']];
    readonly totalResources: number | null;

    /**
     * Retorna o id da aldeia atual.
     * Essa função emitirá um erro caso o id não seja um número positivo.
     */
    getId(): number;
};

export type PiniaCurrentVillageStoreActions = CurrentVillageStore['getId'];
export type PiniaCurrentVillageStoreType = {
    [K in keyof CurrentVillageStore]:
        CurrentVillageStore[K] extends PiniaCurrentVillageStoreActions ?
        CurrentVillageStore[K] :
        K extends keyof Omit<CurrentVillageStore, keyof CurrentVillageType> ?
        ComputedRef<CurrentVillageStore[K]> :
        Ref<CurrentVillageStore[K]>;
};

export type MechanusCurrentVillageStoreType = {
    [K in keyof RemoveMethods<CurrentVillageStore>]:
        K extends keyof Omit<CurrentVillageStore, keyof CurrentVillageType> ?
        MechanusComputedRef<CurrentVillageStore[K]> :
        MechanusRef<CurrentVillageStore[K]>;
};

////// FEATURES
export type FeaturesStore = TribalWarsGameDataType['features'];
export type PiniaFeaturesStoreType = {
    [K in keyof FeaturesStore]: Ref<FeaturesStore[K]>;
};
export type MechanusFeaturesStoreType = {
    [K in keyof FeaturesStore]: MechanusRef<FeaturesStore[K]>;
};

////// GROUPS
type GameDataGroups = TribalWarsGameDataType['groups'];
export interface GroupsStore extends GameDataGroups {
    /** Todos os grupos de aldeias referentes ao alias atual. */
    readonly all: Set<VillageGroup>;
};
export type PiniaGroupsStoreType = {
    [K in keyof GroupsStore]: Ref<GroupsStore[K]>;
};
export type MechanusGroupsStoreType = {
    [K in keyof GroupsStore]: MechanusRef<GroupsStore[K]>;
};

////// PLUNDER INFO
export type PlunderStore = PlunderInfoType;
export type PiniaPlunderStoreType = {
    [K in keyof PlunderStore]: Ref<PlunderStore[K]>;
};
export type MechanusPlunderStoreType = {
    [K in keyof PlunderStore]: MechanusRef<PlunderStore[K]>;
};

////// PLUNDER CONFIG
export interface PlunderConfigStore extends PlunderConfigType {
    raw(): PlunderConfigType;
};

export type PiniaPlunderConfigStoreActions = PlunderConfigStore['raw'];
export type PiniaPlunderConfigStoreType = {
    [K in keyof PlunderConfigStore]:
        PlunderConfigStore[K] extends PiniaPlunderConfigStoreActions ?
        PlunderConfigStore[K] :
        Ref<PlunderConfigStore[K]>;
};
export type MechanusPlunderConfigStoreType = {
    [K in keyof RemoveMethods<PlunderConfigStore>]: MechanusRef<RemoveMethods<PlunderConfigStore>[K]>;
};

////// PLUNDER HISTORY
export interface PlunderHistoryStore extends PlunderAttackDetails {
    raw(): PlunderAttackDetails;
    reset(): void;
};
export type PiniaPlunderHistoryStoreActions = PlunderHistoryStore['raw'] | PlunderHistoryStore['reset'];
export type PiniaPlunderHistoryStoreType = {
    [K in keyof PlunderHistoryStore]:
        PlunderHistoryStore[K] extends PiniaPlunderHistoryStoreActions ?
        PlunderHistoryStore[K] :
        Ref<PlunderHistoryStore[K]>;
}
export type MechanusPlunderHistoryStoreType = {
    [K in keyof RemoveMethods<PlunderHistoryStore>]: MechanusRef<RemoveMethods<PlunderHistoryStore>[K]>;
};

////// PLUNDER CACHE
export type PlunderCacheStore = PlunderCacheType;
export type MechanusPlunderCacheStoreType = {
    [K in keyof PlunderCacheStore]: MechanusRef<PlunderCacheStore[K]>;
};

////// UNITS
export interface UnitsStore extends UnitAmount {
    raw(): UnitAmount;
};

export type PiniaUnitsStoreActions = UnitsStore['raw'];
export type PiniaUnitsStoreType = {
    [K in keyof UnitsStore]:
        UnitsStore[K] extends PiniaUnitsStoreActions ?
        UnitsStore[K] :
        Ref<UnitsStore[K]>;
};
export type MechanusUnitsStoreType = {
    [K in keyof RemoveMethods<UnitsStore>]: MechanusRef<RemoveMethods<UnitsStore>[K]>;
};

////// WORLD CONFIG
export type WorldConfigStore = WorldConfigType;
export type MechanusWorldConfigStoreType = {
    [K in keyof WorldConfigStore]: MechanusRef<WorldConfigStore[K]>;
};

////// WORLD UNIT
export type WorldUnitStoresMap = ReadonlyMap<AllUnits, () => MechanusStore<UnitDetails>>;
export type MechanusWorldUnitStoreType = {
    [K in keyof UnitDetails]: MechanusRef<UnitDetails[K]>;
};

////// CACHE
export interface CacheStore {
    readonly world: World | null;
    readonly player: string | null;
    readonly userAlias: UserAlias | null;
};

export type MechanusCacheStoreType = {
    [K in keyof CacheStore]:
        K extends 'userAlias' ?
        MechanusComputedRef<CacheStore[K]> :
        MechanusRef<CacheStore[K]>;
};

////// BROWSER VIEW
export interface BrowserViewStore {
    /** Todos os WebContents de BrowserViews associados à janela principal. */
    readonly allWebContents: Set<WebContents>;
    /** Todos os WebContents de BrowserViews com eventos já registrados. */
    readonly registeredWebContents: WeakSet<WebContents>;
    /** O WebContents atualmente ativo (em primeiro plano). */
    readonly currentWebContents: WebContents | null;
    /** Função para remover o evento de redimensionamento do WebContents ativo. */
    readonly currentAutoResize: (() => void) | null;
};

export type MechanusBrowserViewStoreType = {
    [K in keyof BrowserViewStore]: MechanusRef<BrowserViewStore[K]>;
};

////// BROWSER
export interface BrowserStore {
    /** Indica se o Deimos está pronto para receber comandos. */
    readonly isDeimosReady: boolean;
};

export type PiniaBrowserStoreType = {
    [K in keyof BrowserStore]: Ref<BrowserStore[K]>;
};

////// PAINEL
export interface PanelStore {
    /** Indica se o painel está visível. */
    readonly isVisible: boolean;
};

export type PiniaPanelStoreType = {
    [K in keyof PanelStore]: Ref<PanelStore[K]>;
};