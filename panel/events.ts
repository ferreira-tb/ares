import { ipcRenderer } from 'electron';
import { assert, assertBooleanOrNull, assertInteger, assertIntegerOrNull, assertString, assertStringOrNull } from '@tb-dev/ts-guard';
import { useAresStore } from '$vue/stores/ares.js';
import { usePlunderHistoryStore, usePlunderStore } from '$vue/stores/plunder.js';
import { resources as resourceList } from '$global/utils/constants.js';
import { AresError } from '$global/error';
import type { Pinia } from 'pinia';
import type { PlunderedResources } from '$lib/farm/resources.js';

export function setPanelWindowEvents(pinia: Pinia) {
    const aresStore = useAresStore(pinia);
    const plunderStore = usePlunderStore(pinia);
    const plunderHistoryStore = usePlunderHistoryStore(pinia);

    ipcRenderer.on('page-url', (_e, url: unknown) => {
        try {
            assertString(url, 'A URL é inválida.');
            aresStore.currentURL = url;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-plundered-amount', (_e, resources: PlunderedResources) => {
        try {
            if (plunderStore.status === false) return;
        
            resourceList.forEach((res) => {
                assert(res in resources, 'Não foi possível atualizar a quantidade de recursos saqueados.');
                assertInteger(resources[res], 'A quantidade de recursos não é um número inteiro.');
                plunderHistoryStore[res] += resources[res];
            });
    
            plunderHistoryStore.attackAmount++;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-major-version', (_e, majorVersion: unknown) => {
        try {
            assertStringOrNull(majorVersion, 'A versão do jogo é inválida.');
            aresStore.majorVersion = majorVersion;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-world', (_e, world: unknown) => {
        try {
            assertStringOrNull(world, 'O mundo é inválido.');
            aresStore.currentWorld = world;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-player', (_e, player: unknown) => {
        try {
            assertStringOrNull(player, 'O nome do jogador é inválido.');
            aresStore.currentPlayer = player;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-player-id', (_e, playerId: unknown) => {
        try {
            assertIntegerOrNull(playerId, 'O ID do jogador é inválido.');
            aresStore.currentPlayerId = playerId;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-player-points', (_e, playerPoints: unknown) => {
        try {
            assertIntegerOrNull(playerPoints, 'Os pontos do jogador são inválidos.');
            aresStore.currentPlayerPoints = playerPoints;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-village-amount', (_e, villageAmount: unknown) => {
        try {
            assertIntegerOrNull(villageAmount, 'A quantidade de aldeias é inválida.');
            aresStore.villageAmount = villageAmount;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-group-id', (_e, groupId: unknown) => {
        try {
            assertIntegerOrNull(groupId, 'O ID do grupo de aldeias é inválido.');
            aresStore.currentGroupId = groupId;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-premium-status', (_e, premiumStatus: unknown) => {
        try {
            assertBooleanOrNull(premiumStatus, 'O status premium é inválido.');
            aresStore.premium = premiumStatus;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-account-manager-status', (_e, accountManagerStatus: unknown) => {
        try {
            assertBooleanOrNull(accountManagerStatus, 'O status do gerente de conta é inválido.');
            aresStore.accountManager = accountManagerStatus;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-farm-assistant-status', (_e, farmAssistantStatus: unknown) => {
        try {
            assertBooleanOrNull(farmAssistantStatus, 'O status do assistente de saque é inválido.');
            aresStore.farmAssistant = farmAssistantStatus;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-screen', (_e, currentScreen: unknown) => {
        try {
            assertStringOrNull(currentScreen, 'A janela atual é inválida.');
            aresStore.currentScreen = currentScreen;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-screen-mode', (_e, screenMode: unknown) => {
        try {
            assertStringOrNull(screenMode, 'O modo de tela é inválido.');
            aresStore.screenMode = screenMode;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-pregame-status', (_e, pregameStatus: unknown) => {
        try {
            assertBooleanOrNull(pregameStatus, 'O status do pré-jogo é inválido.');
            aresStore.pregame = pregameStatus;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-coords', (_e, currentX: number, currentY: number) => {
        try {
            assertInteger(currentX, 'A coordenada X da aldeia atual é inválida.');
            assertInteger(currentY, 'A coordenada Y da aldeia atual é inválida.');
            aresStore.currentX = currentX;
            aresStore.currentY = currentY;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-id', (_e, villageId: unknown) => {
        try {
            assertIntegerOrNull(villageId, 'O ID da aldeia atual é inválido.');
            aresStore.currentVillageId = villageId;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-name', (_e, villageName: unknown) => {
        try {
            assertStringOrNull(villageName, 'O nome da aldeia atual é inválido.');
            aresStore.currentVillageName = villageName;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-population', (_e, villagePopulation: unknown) => {
        try {
            assertIntegerOrNull(villagePopulation, 'A população da aldeia atual é inválida.');
            aresStore.currentVillagePopulation = villagePopulation;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-max-population', (_e, villageMaxPopulation: unknown) => {
        try {
            assertIntegerOrNull(villageMaxPopulation, 'A população máxima da aldeia atual é inválida.');
            aresStore.currentVillageMaxPopulation = villageMaxPopulation;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-points', (_e, villagePoints: unknown) => {
        try {
            assertIntegerOrNull(villagePoints, 'Os pontos da aldeia atual são inválidos.');
            aresStore.currentVillagePoints = villagePoints;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-wood', (_e, villageWood: unknown) => {
        try {
            assertIntegerOrNull(villageWood, 'A quantidade de madeira da aldeia atual é inválida.');
            aresStore.currentVillageWood = villageWood;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-stone', (_e, villageStone: unknown) => {
        try {
            assertIntegerOrNull(villageStone, 'A quantidade de argila da aldeia atual é inválida.');
            aresStore.currentVillageStone = villageStone;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-iron', (_e, villageIron: unknown) => {
        try {
            assertIntegerOrNull(villageIron, 'A quantidade de ferro da aldeia atual é inválida.');
            aresStore.currentVillageIron = villageIron;
        } catch (err) {
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-current-village-max-storage', (_e, villageMaxStorage: unknown) => {
        try {
            assertIntegerOrNull(villageMaxStorage, 'O armazenamento máximo da aldeia atual é inválido.');
            aresStore.currentVillageMaxStorage = villageMaxStorage;
        } catch (err) {
            AresError.handle(err);
        };
    });
};