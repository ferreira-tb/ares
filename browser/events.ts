import { ipcRenderer } from 'electron';
import { Deimos } from '$deimos/ipc.js';
import { assert, assertString, isString, isInteger } from '@tb-dev/ts-guard';
import { usePlunderStore } from '$vue/stores/plunder.js';
import { useAresStore } from '$vue/stores/ares.js';
import { ipcSend } from '$global/ipc.js';
import { AresError } from '$global/error.js';
import type { Pinia } from 'pinia';

export function setBrowserEvents(pinia: Pinia) {
    // Pinia.
    const plunderStore = usePlunderStore(pinia);
    const aresStore = useAresStore(pinia);

    ipcRenderer.on('page-url', (_e, url: unknown) => {
        assertString(url, 'A URL é inválida.');
        aresStore.currentURL = url;
    });
    
    ipcRenderer.on('update-deimos', async () => {
        try {
            const gameData = await Deimos.invoke('get-game-data');
            if (gameData === null) return;

            const world = isString(gameData.world) ? gameData.world : null;
            aresStore.currentWorld = world;
            ipcSend('update-current-world', world);

            const version = isString(gameData.majorVersion) ? gameData.majorVersion : null;
            ipcSend('update-current-major-version', version);

            const playerName = isString(gameData.player.name) ? gameData.player.name : null;
            aresStore.currentPlayer = playerName;
            ipcSend('update-current-player', playerName);

            const playerId = isInteger(gameData.player.id) ? gameData.player.id : null;
            aresStore.currentPlayerId = playerId;
            ipcSend('update-current-player-id', playerId);

            const groupId = isString(gameData.group_id) ? Number.assertInteger(gameData.group_id) : null;
            aresStore.currentGroupId = groupId;
            ipcSend('update-current-group-id', groupId);
            
        } catch (err) {
            AresError.handle(err);
        };
    });

    type PlunderKeys = keyof typeof plunderStore;
    type PlunderValue<T extends PlunderKeys> = typeof plunderStore[T];
    // Atualiza o estado local do Plunder sempre que ocorre uma mudança dele na janela filha.
    ipcRenderer.on('plunder-state-update', <K extends PlunderKeys>(_e: unknown, stateName: K, value: PlunderValue<K>) => {
        assert(stateName in plunderStore, `${stateName} não é um estado válido para o Plunder.`);
        plunderStore[stateName] = value;
    });
};