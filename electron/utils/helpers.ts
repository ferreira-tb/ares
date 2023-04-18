import { app, BrowserWindow } from 'electron';
import { assertInstanceOf } from '$global/guards';
import { assertWorld } from '$global/guards';
import { MainProcessError } from '$electron/error';
import type { UserAlias } from '$types/electron';
import type { World } from '$types/game';
import type { WorldUnitType } from '$types/world';
import type { createWorldUnitStoresMap } from '$stores/world';

export function restartAres() {
    app.relaunch();
    app.quit();
};

export const getMainWindow = () => {
    const id = Number.parseIntStrict(process.env.MAIN_WINDOW_ID ?? '');
    const mainWindow = BrowserWindow.fromId(id);
    assertInstanceOf(mainWindow, BrowserWindow, 'Could not get main window.');
    return mainWindow;
};

export const getPanelWindow = () => {
    const id = Number.parseIntStrict(process.env.PANEL_WINDOW_ID ?? '');
    const panelWindow = BrowserWindow.fromId(id);
    assertInstanceOf(panelWindow, BrowserWindow, 'Could not get panel window.');
    return panelWindow;
};

/** Exibe ou oculta a janela do painel. */
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

    panelWindow.webContents.send('panel:visibility-did-change', panelWindow.isVisible());
};

/**
 * Maximiza ou restaura a janela, dependendo do estado atual.
 * @param window Janela a ser maximizada ou restaurada.
 * @returns Booleano indicando se a janela está maximizada.
 */
export function maximizeOrRestoreWindow(window: BrowserWindow) {
    if (window.isMaximized()) {
        window.restore();
    } else {
        window.maximize();
    };

    return window.isMaximized();
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

/**
 * Obtém o nome do jogador a partir do alias, decodificando-o.
 * @param alias Alias do jogador.
 */
export function getPlayerNameFromAlias(alias: UserAlias): string {
    const encodedPlayerName = alias.replace(/^[a-z]+\d+__USERID__/, '');
    return decodeURIComponent(encodedPlayerName);
};

/**
 * Obtém informações sobre as unidades do mundo a partir do mapa contendo as stores de cada unidade.
 * @param worldUnitsMap Mapa contendo as stores de cada unidade.
 */
export function extractWorldUnitsFromMap(worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>): WorldUnitType {
    const entries = Array.from(worldUnitsMap.entries());
    return entries.reduce((acc, [key, useStore]) => {
        const unitStore = useStore();
        acc[key] = { ...unitStore };
        return acc;
    }, {} as WorldUnitType);
};