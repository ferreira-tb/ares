import { app, BrowserWindow } from 'electron';
import { assertInstanceOf } from '@tb-dev/ts-guard';
import { assertWorld } from '$electron/utils/guards';
import { MainProcessError } from '$electron/error';
import { browserCss, favicon } from '$electron/utils/constants';
import type { MechanusStore } from 'mechanus';
import type { UserAlias, WindowOpenHandler } from '$types/electron';
import type { AllUnits, World } from '$types/game';
import type { UnitDetails, WorldUnitType } from '$types/world';
import type { createWorldUnitStoresMap } from '$stores/world';

export function restartAres() {
    app.relaunch();
    app.quit();
};

export const getMainWindow = () => {
    const id = Number.parseIntStrict(process.env.MAIN_WINDOW_ID ?? '');
    const mainWindow = BrowserWindow.fromId(id);
    assertInstanceOf(mainWindow, BrowserWindow, 'Não foi possível obter a janela do browser.');
    return mainWindow;
};

export const getPanelWindow = () => {
    const id = Number.parseIntStrict(process.env.PANEL_WINDOW_ID ?? '');
    const panelWindow = BrowserWindow.fromId(id);
    assertInstanceOf(panelWindow, BrowserWindow, 'Não foi possível obter a janela do painel.');
    return panelWindow;
};

export function togglePanelWindow() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

    if (panelWindow.isVisible()) {
        panelWindow.hide();

        if (mainWindow.isVisible() && !mainWindow.isFocused()) {
            mainWindow.focus();
        };

    } else {
        panelWindow.show();
    };
};

export function getWindowOpenHandler(child: boolean = true): WindowOpenHandler {
    const windowOpenHandler: Required<WindowOpenHandler> = {
        action: 'allow',
        outlivesOpener: false,
        overrideBrowserWindowOptions: {
            show: false,
            width: 1200,
            height: 1000,
            icon: favicon,
            webPreferences: {
                spellcheck: false,
                nodeIntegration: false,
                contextIsolation: true,
                devTools: process.env.ARES_MODE === 'dev'
            }
        }
    };

    if (child) {
        windowOpenHandler.overrideBrowserWindowOptions.parent = getMainWindow();
    };

    return windowOpenHandler;
};

/**
 * Insere CSS na janela.
 * @param win Instância do BrowserWindow.
 * @param css CSS a ser inserido. Se omitido, será usado o CSS padrão do browser.
 */
export async function insertCSS(win: BrowserWindow, css: string = browserCss) {
    try {
        await win.webContents.insertCSS(css);
    } catch (err) {
        MainProcessError.catch(err);
    };
};

/**
* Retorna o alias do usuário, no padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`.

* Ele é usado para diferenciar tanto diferentes jogadores quanto diferentes mundos do mesmo jogador.
* @param playerName Nome do jogador.
*/
export function generateUserAlias(world: World, playerName: string): UserAlias {
    playerName = encodeURIComponent(playerName);
    assertWorld(world, MainProcessError);
    return `${world}__USERID__${playerName}`;
};

export function getPlayerNameFromAlias(alias: UserAlias): string {
    const encodedPlayerName = alias.replace(/^[a-z]+\d+__USERID__/, '');
    return decodeURIComponent(encodedPlayerName);
};

export function extractWorldUnitsFromMap(worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>): WorldUnitType {
    type UnitsMapEntries = [AllUnits, () => MechanusStore<UnitDetails>];
    return Object.entries(worldUnitsMap).reduce((acc, [key, useStore]: UnitsMapEntries) => {
        const unitStore = useStore();
        acc[key] = { ...unitStore };
        return acc;
    }, {} as WorldUnitType);
};