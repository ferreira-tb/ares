import type { ComputedRef, Ref } from 'vue';
import type { TribalWarsGameDataType } from '$types/game.js';
import type { PlunderInfoType, PlunderConfigType, PlunderAttackDetails } from '$types/plunder.js';
import type { UnitAmount } from '$types/game.js';
import type { RemoveMethods } from '$types/utils.js';
import type { WorldConfigType, WorldUnitType } from '$types/world.js';

////// ARES
export type AresStore = TribalWarsGameDataType['ares'];
export type PiniaAresKeys = keyof AresStore;
export type PiniaAresValues = Ref<AresStore[keyof AresStore]>;
export type PiniaAresStoreType = Record<keyof AresStore, PiniaAresValues>;

////// PLAYER
export type PlayerStore = TribalWarsGameDataType['player'];
export type PiniaPlayerKeys = keyof PlayerStore;
export type PiniaPlayerValues = Ref<PlayerStore[keyof PlayerStore]>;
export type PiniaPlayerStoreType = Record<PiniaPlayerKeys, PiniaPlayerValues>;

////// CURRENT VILLAGE
type CurrentVillageType = TribalWarsGameDataType['currentVillage'];
export interface CurrentVillageStore extends CurrentVillageType {
    coords: [CurrentVillageType['x'], CurrentVillageType['y']];
    totalResources: number | null;
};
export type PiniaCurrentVillageKeys = keyof CurrentVillageStore;
export type PiniaCurrentVillageValues = Ref<CurrentVillageStore[keyof CurrentVillageStore]>;
export type PiniaCurrentVillageStoreGetters =
    | ComputedRef<CurrentVillageStore['coords']>
    | ComputedRef<CurrentVillageStore['totalResources']>;
export type PiniaCurrentVillageStoreType = Record<PiniaCurrentVillageKeys, PiniaCurrentVillageValues | PiniaCurrentVillageStoreGetters>;

////// FEATURES
export type FeaturesStore = TribalWarsGameDataType['features'];
export type PiniaFeaturesKeys = keyof FeaturesStore;
export type PiniaFeaturesValues = Ref<FeaturesStore[keyof FeaturesStore]>;
export type PiniaFeaturesStoreType = Record<PiniaFeaturesKeys, PiniaFeaturesValues>;

////// PLUNDER INFO
export type PlunderStore = PlunderInfoType;
export type PiniaPlunderKeys = keyof PlunderStore;
export type PiniaPlunderValues = Ref<PlunderStore[keyof PlunderStore]>;
export type PiniaPlunderStoreType = Record<PiniaPlunderKeys, PiniaPlunderValues>;

////// PLUNDER CONFIG
export interface PlunderConfigStore extends PlunderConfigType {
    raw(): PlunderConfigType;
};

export type PiniaPlunderConfigKeys = keyof PlunderConfigStore;
export type PiniaPlunderConfigValues = Ref<PlunderConfigStore[keyof PlunderConfigStore]>;
export type PiniaPlunderConfigActions = PlunderConfigStore['raw'];
export type PiniaPlunderConfigStoreType = Record<PiniaPlunderConfigKeys, PiniaPlunderConfigValues | PiniaPlunderConfigActions>;

////// PLUNDER HISTORY
export interface PlunderHistoryStore extends PlunderAttackDetails {
    raw(): PlunderAttackDetails;
    reset(): void;
};

export type PiniaPlunderHistoryKeys = keyof PlunderHistoryStore;
export type PiniaPlunderHistoryValues = Ref<PlunderHistoryStore[keyof PlunderHistoryStore]>;
export type PiniaPlunderHistoryActions = PlunderHistoryStore['raw'] | PlunderHistoryStore['reset'];
export type PiniaPlunderHistoryStoreType = Record<PiniaPlunderHistoryKeys, PiniaPlunderHistoryValues | PiniaPlunderHistoryActions>;

////// PLUNDER FULL HISTORY
export interface PlunderFullHistoryStore {
    readonly last: RemoveMethods<PlunderHistoryStore>;
    readonly total: RemoveMethods<PlunderHistoryStore>;
};

////// UNITS
export interface UnitsStore extends UnitAmount {
    raw(): UnitAmount;
};

export type PiniaUnitsKeys = keyof UnitsStore;
export type PiniaUnitsValues = Ref<UnitsStore[keyof UnitsStore]>;
export type PiniaUnitsActions = UnitsStore['raw'];
export type PiniaUnitsStoreType = Record<PiniaUnitsKeys, PiniaUnitsValues | PiniaUnitsActions>;

////// WORLD CONFIG
export type WorldConfigStore = WorldConfigType;

////// WORLD UNIT
export type WorldUnitStore = WorldUnitType;