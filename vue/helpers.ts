import { assertType } from "$global/error.js";
import { parseCoordsFromTextContent } from '$global/helpers.js';
import { useAresStore } from '$vue/stores/store.js';
import { ipcSend } from '$global/ipc.js';
import type { RouteRecordRaw } from 'vue-router';

// As funções aqui presentes dependem do Vue em algum grau.

/**
 * Obtêm as coordenadas da aldeia atual a partir do DOM e as salva no Pinia.
 * Essa função deve ser chamada apenas no contexto do browser.
 */
export function queryCurrentVillageCoords() {
    const selector = '#header_info tr#menu_row2 td:not(:has(a[href*="screen=overview"])):has(b)';
    const coordsField = document.queryAndAssert(selector);

    const coords = parseCoordsFromTextContent(coordsField.textContent);
    assertType(Array.isArray(coords), 'O valor obtido para as coordenadas não é uma array.');

    const aresStore = useAresStore();
    aresStore.currentX = coords[0];
    aresStore.currentY = coords[1];

    // Notifica o processo principal, que então notificará a janela do painel.
    ipcSend('update-current-coords', coords[0], coords[1]);
};

/** Calcula distância em campos entre duas coordenadas. */
export function calcDistance(destX: number, destY: number, originX?: number, originY?: number) {
    const aresStore = useAresStore();
    if (typeof originX !== 'number') originX = aresStore.currentX;
    if (typeof originY !== 'number') originY = aresStore.currentY;

    return Math.sqrt(((destX - originX) ** 2) + ((destY - originY) ** 2));
};

export function getRouteNames(routes: RouteRecordRaw[]) {
    const names: string[] = [];

    for (const route of routes) {
        if (typeof route.name === 'string') {
            names.push(route.name)
        } else if (Array.isArray(route.children)) {
            names.push(...getRouteNames(route.children))
        };
    };

    return names;
};