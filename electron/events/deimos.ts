import { ipcMain } from 'electron';
import { readDeimosFile } from '$electron/app/deimos.js';
import { browserStore } from '$electron/stores/browser.js';

export function setDeimosEvents() {
    /** Conteúdo do arquivo `deimos.js`. */
    let deimos: string | null = null;

    ipcMain.handle('get-deimos-file', async () => {
        deimos ??= await readDeimosFile();
        return deimos;
    });

    ipcMain.on('update-current-world', (_e, world: string | null) => browserStore.world = world);
    ipcMain.on('update-current-major-version', (_e, version: string | null) => browserStore.majorVersion = version);
    ipcMain.on('update-current-player', (_e, player: string | null) => browserStore.player = player);
    ipcMain.on('update-current-player-id', (_e, playerId: number | null) => browserStore.playerId = playerId);
    ipcMain.on('update-current-player-points', (_e, playerPoints: number | null) => browserStore.playerPoints = playerPoints);
    ipcMain.on('update-village-amount', (_e, villageAmount: number | null) => browserStore.villageAmount = villageAmount);
    ipcMain.on('update-current-group-id', (_e, groupId: number | null) => browserStore.groupId = groupId);
    ipcMain.on('update-premium-status', (_e, premium: boolean | null) => browserStore.premium = premium);
    ipcMain.on('update-account-manager-status', (_e, accountManager: boolean | null) => browserStore.accountManager = accountManager);
    ipcMain.on('update-farm-assistant-status', (_e, farmAssistant: boolean | null) => browserStore.farmAssistant = farmAssistant);
    ipcMain.on('update-current-screen', (_e, screen: string | null) => browserStore.screen = screen);
    ipcMain.on('update-screen-mode', (_e, screenMode: string | null) => browserStore.screenMode = screenMode);
    ipcMain.on('update-pregame-status', (_e, pregame: boolean | null) => browserStore.pregame = pregame);
    ipcMain.on('update-current-coords', (_e, x: number | null, y: number | null) => {
        browserStore.currentX = x;
        browserStore.currentY = y;
    });
    ipcMain.on('update-current-village-id', (_e, villageId: number | null) => browserStore.currentVillageId = villageId);
    ipcMain.on('update-current-village-name', (_e, villageName: string | null) => browserStore.currentVillageName = villageName);
    ipcMain.on('update-current-village-population', (_e, villagePop: number | null) => browserStore.currentVillagePopulation = villagePop);
    ipcMain.on('update-current-village-max-population', (_e, maxPop: number | null) => browserStore.currentVillageMaxPopulation = maxPop);
    ipcMain.on('update-current-village-points', (_e, villagePoints: number | null) => browserStore.currentVillagePoints = villagePoints);
    ipcMain.on('update-current-village-wood', (_e, wood: number | null) => browserStore.currentVillageWood = wood);
    ipcMain.on('update-current-village-stone', (_e, stone: number | null) => browserStore.currentVillageStone = stone);
    ipcMain.on('update-current-village-iron', (_e, iron: number | null) => browserStore.currentVillageIron = iron);
    ipcMain.on('update-current-village-max-storage', (_e, maxStorage: number | null) => browserStore.currentVillageMaxStorage = maxStorage);
};