import { ipcRenderer } from 'electron';
import { assert, assertString } from '@tb-dev/ts-guard';
import { Deimos } from '$deimos/shared/ipc.js';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import { useAresStore } from '$vue/stores/ares.js';
import { ipcSend } from '$global/ipc.js';
import { AresError } from '$global/error.js';
import type { Pinia } from 'pinia';

export function setBrowserEvents(pinia: Pinia) {
    // Pinia.
    const plunderConfigStore = usePlunderConfigStore(pinia);
    const aresStore = useAresStore(pinia);

    ipcRenderer.on('page-url', (_e, url: unknown) => {
        try {
            assertString(url, 'A URL é inválida.');
            aresStore.currentURL = url;
        } catch (err) {
            AresError.capture(err);
        };
    });
    
    ipcRenderer.on('get-game-data', async () => {
        try {
            const gameData = await Deimos.invoke('get-game-data');
            if (gameData === null) return;

            aresStore.$patch(gameData);
            ipcSend('update-game-data', gameData);

        } catch (err) {
            AresError.capture(err);
        };
    });

    type PlunderKeys = keyof typeof plunderConfigStore;
    type PlunderValues<T extends PlunderKeys> = typeof plunderConfigStore[T];
    // Atualiza o estado local do Plunder sempre que ocorre uma mudança é provocada a partir do painel.
    ipcRenderer.on('plunder-state-update', <K extends PlunderKeys>(_e: unknown, stateName: K, value: PlunderValues<K>) => {
        assert(stateName in plunderConfigStore, `${stateName} não é um estado válido para o Plunder.`);
        plunderConfigStore[stateName] = value;
    });
};