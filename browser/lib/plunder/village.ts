import { assertInteger } from '@tb-dev/ts-guard';
import { useCurrentVillageStore } from '$global/stores/village';
import { usePlunderStore } from '$global/stores/plunder';
import { ipcSend } from '$global/ipc';
import { plunderSearchParams } from '$global/utils/constants';
import type { PlunderCurrentVillageType, PlunderPageType } from '$types/plunder';

class PlunderCurrentVillageInfo implements PlunderCurrentVillageType {
    readonly id: number;
    readonly pageUrl: string;
    readonly pages: PlunderPageType[] = [];

    constructor() {
        const currentVillageStore = useCurrentVillageStore();
        assertInteger(currentVillageStore.id);
        this.id = currentVillageStore.id;

        const url = new URL(location.href);
        url.search = plunderSearchParams;
        this.pageUrl = url.href;
    };
};

class PlunderPage implements PlunderPageType {
    readonly page: number;
    readonly done: boolean;

    constructor(plunderStore: ReturnType<typeof usePlunderStore>, page: number) {
        this.page = page;
        this.done = plunderStore.page === page;
    };
};

/** Obtém informações sobre a aldeia atual e as envia para o cache no processo principal. */
export function queryCurrentVillageInfo() {
    const villageInfo = new PlunderCurrentVillageInfo();
    const hasPages = queryPlunderPages(villageInfo);

    if (hasPages) {
        ipcSend('update-plunder-cache-village-info', villageInfo);
    } else {
        ipcSend('update-plunder-cache-village-info', null);
    };
};

function queryPlunderPages(villageInfo: PlunderCurrentVillageType) {
    const plunderNav = document.querySelector('#plunder_list_nav table td:has(.paged-nav-item)');
    if (!plunderNav) return false;

    // A página atual está contida dentro de um elemento <strong> e não é um link.
    // Já as outras páginas são links, todas dentro de um elemento <a>.
    // Nas URLs e nas variáveis do jogo, as páginas são numeradas a partir de 0.
    // No entanto, no texto dos links, elas são numeradas a partir de 1.
    const pages = plunderNav.queryAsArray('a.paged-nav-item').map((el) => el.parseIntStrict() - 1);

    // Adiciona a página atual.
    const plunderStore = usePlunderStore();
    const currentPage = plunderStore.page;
    pages.push(currentPage);

    const lastPage = pages.reduce((a, b) => Math.max(a, b), -Infinity);
    for (let i = 0; i <= lastPage; i++) {
        const plunderPage = new PlunderPage(plunderStore, i);
        villageInfo.pages.push(plunderPage);
    };

    return true;
};