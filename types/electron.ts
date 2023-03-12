import type { WebContents } from 'electron';
import type { World } from '$types/game.js';
import type { DemolitionTemplateType } from '$types/plunder.js';

export type WindowOpenHandler = ReturnType<Parameters<WebContents['setWindowOpenHandler']>[0]>;

export type UserAlias = `${World}__USERID__${string}`;

export interface CacheProxyType {
    world: World | null;
    player: string | null;
    userAlias: UserAlias | null;

    /** Modelos usados no assistente de saque para demolição de muralhas. */
    demolitionTroops: DemolitionTemplateType | null;
};