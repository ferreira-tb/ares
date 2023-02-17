import type { PlunderStoreType } from '$types/electron.js';

class PlunderStore implements PlunderStoreType {
    hideAttacked: boolean = true;
    page: number = 0;
    pageSize: number = 15;
    plunderExhausted: boolean = false;
};

export const plunderStore = new Proxy(new PlunderStore(), { });