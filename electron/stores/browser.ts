import { assertStringOrNull, assertIntegerOrNull, isString, assertBooleanOrNull } from '@tb-dev/ts-guard';
import { assertPanelWindow } from '$electron/utils/helpers.js';
import { MainProcessError } from '$electron/error.js';
import type { BrowserStoreType } from '$types/electron.js';

class BrowserStore implements BrowserStoreType {
    majorVersion: string | null = null;
    world: string | null = null;
    player: string | null = null;
    playerId: number | null = null;
    playerPoints: number | null = null;
    villageAmount: number | null = null;
    groupId: number | null = null;

    // Features
    premium: boolean | null = null;
    accountManager: boolean | null = null;
    farmAssistant: boolean | null = null;

    screen: string | null = null;
    screenMode: string | null = null;
    pregame: boolean | null = null;

    currentX: number | null = null;
    currentY: number | null = null;
    currentCoords: [number | null, number | null] = [null, null];
    currentVillageId: number | null = null;
    currentVillageName: string | null = null;
    currentVillagePopulation: number | null = null;
    currentVillageMaxPopulation: number | null = null;
    currentVillagePoints: number | null = null;
    currentVillageWood: number | null = null;
    currentVillageStone: number | null = null;
    currentVillageIron: number | null = null;
    currentVillageTotalResources: number | null = null;
    currentVillageMaxStorage: number | null = null;
};

export const browserStore = new Proxy(new BrowserStore(), {
    set(target, prop, value) {
        if (!isString(prop)) return false;

        const panelWindow = assertPanelWindow();

        switch (prop) {
            case 'majorVersion':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-current-major-version', value);
                break;
            case 'world':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-current-world', value);
                break;
            case 'player':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-current-player', value);
                break;
            case 'playerId':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-player-id', value);
                break;
            case 'playerPoints':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-player-points', value);
                break;
            case 'villageAmount':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-village-amount', value);
                break;
            case 'groupId':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-group-id', value);
                break;

            case 'premium':
                assertBooleanOrNull(value);
                panelWindow.webContents.send('update-premium-status', value);
                break;
            case 'accountManager':
                assertBooleanOrNull(value);
                panelWindow.webContents.send('update-account-manager-status', value);
                break;
            case 'farmAssistant':
                assertBooleanOrNull(value);
                panelWindow.webContents.send('update-farm-assistant-status', value);
                break;

            case 'screen':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-current-screen', value);
                break;
            case 'screenMode':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-screen-mode', value);
                break;
            case 'pregame':
                assertBooleanOrNull(value);
                panelWindow.webContents.send('update-pregame-status', value);
                break;

            case 'currentX':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-coords', value, browserStore.currentY);
                break;
            case 'currentY':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-coords', browserStore.currentX, value);
                break;
            case 'currentVillageId':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-village-id', value);
                break;
            case 'currentVillageName':
                assertStringOrNull(value);
                panelWindow.webContents.send('update-current-village-name', value);
                break;
            case 'currentVillagePopulation':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-village-population', value);
                break;
            case 'currentVillageMaxPopulation':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-village-max-population', value);
                break;
            case 'currentVillagePoints':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-village-points', value);
                break;
            case 'currentVillageWood':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-village-wood', value);
                break;
            case 'currentVillageStone':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-village-stone', value);
                break;
            case 'currentVillageIron':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-village-iron', value);
                break;
            case 'currentVillageMaxStorage':
                assertIntegerOrNull(value);
                panelWindow.webContents.send('update-current-village-max-storage', value);
                break;

            default:
                throw new MainProcessError(`A propriedade ${prop} não é válida para o BrowserStore.`);
        };

        return Reflect.set(target, prop, value);
    },
    get(target, prop) {
        switch (prop) {
            case 'currentCoords':
                return [target.currentX, target.currentY];
            case 'currentVillageTotalResources':
                const wood = target.currentVillageWood;
                const stone = target.currentVillageStone;
                const iron = target.currentVillageIron;
                if (wood === null || stone === null || iron === null) return null;
                return wood + stone + iron;
            default:
                return Reflect.get(target, prop);
        };
    }
});