import type { ComputedRef, Ref } from 'vue';
import type { MechanusComputedRef, MechanusRef, MechanusStore } from 'mechanus';
import type { AllUnits, TribalWarsGameDataType } from '$types/game';
import type { PlunderInfoType, PlunderConfigType, PlunderAttackDetails } from '$types/plunder';
import type { UnitAmount, VillageGroup } from '$types/game';
import type { RemoveMethods } from '$types/utils';
import type { WorldConfigType } from '$types/world';
import type { UnitDetails } from '$types/world';

////// ARES
export type AresStore = TribalWarsGameDataType['ares'];
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
};

export type PiniaCurrentVillageStoreType = {
    [K in keyof CurrentVillageStore]:
        K extends keyof Omit<CurrentVillageStore, keyof CurrentVillageType> ?
        ComputedRef<CurrentVillageStore[K]> :
        Ref<CurrentVillageStore[K]>;
};

export type MechanusCurrentVillageStoreType = {
    [K in keyof CurrentVillageStore]:
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
    readonly all: VillageGroup[];
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