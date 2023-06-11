import { useCurrentVillageStore, usePlunderStore } from '$renderer/stores';
import { ipcSend } from '$renderer/ipc';

class PlunderPageList implements PlunderPageListType {
    readonly id: number;
    readonly all: PlunderPageType[] = [];

    constructor() {
        this.id = useCurrentVillageStore().getId();
    };
};

class PlunderPage implements PlunderPageType {
    readonly index: number;
    readonly done: boolean;

    constructor(plunderStore: ReturnType<typeof usePlunderStore>, index: number) {
        this.index = index;
        this.done = plunderStore.page === index;
    };
};

/** Obtém informações sobre a aldeia atual e as envia para o cache no processo principal. */
export function queryCurrentVillageInfo() {
    const pages = new PlunderPageList();
    const hasPages = queryPlunderPages(pages);

    if (hasPages) {
        ipcSend('plunder:update-pages-info', pages);
    } else {
        ipcSend('plunder:update-pages-info', null);
    };
};

function queryPlunderPages(pages: PlunderPageListType) {
    const plunderNav = document.querySelector('#plunder_list_nav table td:has(.paged-nav-item)');
    if (!plunderNav) return false;

    // A página atual está contida dentro de um elemento <strong> e não é um link.
    // Já as outras páginas são links, todas dentro de um elemento <a>.
    // Nas URLs e nas variáveis do jogo, as páginas são numeradas a partir de 0.
    // No entanto, no texto dos links, elas são numeradas a partir de 1.
    const indexList = plunderNav.queryAsArray('a.paged-nav-item').map((el) => el.parseIntStrict() - 1);

    // Adiciona a página atual.
    const plunderStore = usePlunderStore();
    const currentIndex = plunderStore.page;
    indexList.push(currentIndex);

    const lastIndex = indexList.reduce((a, b) => Math.max(a, b), -Infinity);
    for (let i = 0; i <= lastIndex; i++) {
        const plunderPage = new PlunderPage(plunderStore, i);
        pages.all.push(plunderPage);
    };

    return true;
};