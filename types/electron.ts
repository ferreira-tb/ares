import type { World } from '$types/game.js';

export type UserAlias = `${World}__USERID__${string}`;

export interface CacheProxyType {
    world: World | null;
    player: string | null;
    userAlias: UserAlias | null;
};