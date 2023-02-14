import type { BrowserStoreType } from '$types/electron.js';

class BrowserStore implements BrowserStoreType {
    version: string | null = null;
    world: string | null = null;
    player: string | null = null;
    playerId: number | null = null;
    groupId: string | null = null;
};

export const browserStore = new Proxy(new BrowserStore(), {

});