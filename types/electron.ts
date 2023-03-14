import type { WebContents } from 'electron';
import type { MechanusComputedRef, MechanusRef } from 'mechanus';
import type { World } from '$types/game';
import type { DemolitionTemplateType } from '$types/plunder';

export type WindowOpenHandler = ReturnType<Parameters<WebContents['setWindowOpenHandler']>[0]>;

export type UserAlias = `${World}__USERID__${string}`;

export interface CacheStore {
    world: World | null;
    player: string | null;
    userAlias: UserAlias | null;

    /** Modelos usados no assistente de saque para demolição de muralhas. */
    demolitionTroops: DemolitionTemplateType | null;
};

export type MechanusCacheStoreType = {
    world: MechanusRef<World | null>;
    player: MechanusRef<string | null>;
    userAlias: MechanusComputedRef<UserAlias | null>;

    demolitionTroops: MechanusRef<DemolitionTemplateType | null>;
};