import { useAresStore } from '$vue/stores/store.js';
import { assertType } from "$global/error.js";
import { parseCoordsFromTextContent } from '$global/helpers.js';
import { ipcSend } from '$global/ipc.js';

/** Obtêm as coordenadas da aldeia atual a partir do DOM e as salva no Pinia. */
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