import type { ComputedRef, Ref } from 'vue';
import type { MechanusComputedRef, MechanusRef } from 'mechanus';
import type { TribalWarsGameDataType } from '$types/game.js';
import type { PlunderInfoType, PlunderConfigType, PlunderAttackDetails } from '$types/plunder.js';
import type { UnitAmount } from '$types/game.js';
import type { RemoveMethods } from '$types/utils.js';
import type { WorldConfigType, WorldUnitType } from '$types/world.js';

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
    coords: [CurrentVillageType['x'], CurrentVillageType['y']];
    totalResources: number | null;
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

////// WORLD UNIT
export type WorldUnitStore = WorldUnitType;