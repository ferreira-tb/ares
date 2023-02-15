import { ipcRenderer } from 'electron';
import { Deimos } from '$deimos/ipc.js';
import { assert, assertString, isBoolean, isString, isInteger, toNull } from '@tb-dev/ts-guard';
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
        try {
            assertString(url, 'A URL é inválida.');
            aresStore.currentURL = url;
        } catch (err) {
            AresError.handle(err);
        };
    });
    
    ipcRenderer.on('update-deimos', async () => {
        try {
            const gameData = await Deimos.invoke('get-game-data');
            if (gameData === null) return;

            const world = toNull(gameData.world, isString);
            aresStore.currentWorld = world;
            ipcSend('update-current-world', world);

            const majorVersion = toNull(gameData.majorVersion, isString);
            aresStore.currentMajorVersion = majorVersion;
            ipcSend('update-current-major-version', majorVersion);

            const playerName = toNull(gameData.player.name, isString);
            aresStore.currentPlayer = playerName;
            ipcSend('update-current-player', playerName);

            const playerId = toNull(gameData.player.id, isInteger);
            aresStore.currentPlayerId = playerId;
            ipcSend('update-current-player-id', playerId);

            const playerPoints = isString(gameData.player.points) ? Number.parseIntStrict(gameData.player.points) : null;
            aresStore.currentPlayerPoints = playerPoints;
            ipcSend('update-current-player-points', playerPoints);

            const villageAmount = isString(gameData.player.villages) ? Number.parseIntStrict(gameData.player.villages) : null;
            aresStore.villageAmount = villageAmount;
            ipcSend('update-village-amount', villageAmount);

            const groupId = isString(gameData.group_id) ? Number.parseIntStrict(gameData.group_id) : null;
            aresStore.currentGroupId = groupId;
            ipcSend('update-current-group-id', groupId);

            const premium = toNull(gameData.features.Premium.active, isBoolean);
            aresStore.premium = premium;
            ipcSend('update-premium-status', premium);

            const accountManager = toNull(gameData.features.AccountManager.active, isBoolean);
            aresStore.accountManager = accountManager;
            ipcSend('update-account-manager-status', accountManager);

            // No jogo consta como FarmAssistent, mas no Deimos está como FarmAssistant.
            const farmAssistant = toNull(gameData.features.FarmAssistent.active, isBoolean);
            aresStore.farmAssistant = farmAssistant;
            ipcSend('update-farm-assistant-status', farmAssistant);

            const screen = toNull(gameData.screen, isString);
            aresStore.currentScreen = screen;
            ipcSend('update-current-screen', screen);

            const screenMode = toNull(gameData.mode, isString);
            aresStore.screenMode = screenMode;
            ipcSend('update-screen-mode', screenMode);

            const pregame = toNull(gameData.pregame, isBoolean);
            aresStore.pregame = pregame;
            ipcSend('update-pregame-status', pregame);

            const x = toNull(gameData.village.x, isInteger);
            aresStore.currentX = x;
            const y = toNull(gameData.village.y, isInteger);
            aresStore.currentY = y;
            ipcSend('update-current-coords', x, y);

            const villageId = toNull(gameData.village.id, isInteger);
            aresStore.currentVillageId = villageId;
            ipcSend('update-current-village-id', villageId);

            const villageName = toNull(gameData.village.name, isString);
            aresStore.currentVillageName = villageName;
            ipcSend('update-current-village-name', villageName);

            const villagePop = toNull(gameData.village.pop, isInteger);
            aresStore.currentVillagePopulation = villagePop;
            ipcSend('update-current-village-population', villagePop);

            const villageMaxPop = toNull(gameData.village.pop_max, isInteger);
            aresStore.currentVillageMaxPopulation = villageMaxPop;
            ipcSend('update-current-village-max-population', villageMaxPop);

            const villagePoints = toNull(gameData.village.points, isInteger);
            aresStore.currentVillagePoints = villagePoints;
            ipcSend('update-current-village-points', villagePoints);

            const wood = toNull(gameData.village.wood, isInteger);
            aresStore.currentVillageWood = wood;
            ipcSend('update-current-village-wood', wood);

            const stone = toNull(gameData.village.stone, isInteger);
            aresStore.currentVillageStone = stone;
            ipcSend('update-current-village-stone', stone);

            const iron = toNull(gameData.village.iron, isInteger);
            aresStore.currentVillageIron = iron;
            ipcSend('update-current-village-iron', iron);

            const maxStorage = toNull(gameData.village.storage_max, isInteger);
            aresStore.currentVillageMaxStorage = maxStorage;
            ipcSend('update-current-village-max-storage', maxStorage);

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