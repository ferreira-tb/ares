import { URL } from 'url';
import { BrowserWindow } from 'electron';
import { assertInstanceOf, assertString } from '@tb-dev/ts-guard';
import type { UserAlias } from '$types/electron.js';

export const getMainWindow = () => {
    const id = Number.parseIntStrict(process.env.MAIN_WINDOW_ID ?? '', 10);
    return BrowserWindow.fromId(id);
};

export const assertMainWindow = () => {
    const mainWindow = getMainWindow();
    assertInstanceOf(mainWindow, BrowserWindow, 'Não foi possível obter a janela do browser.');
    return mainWindow;
};

export const getPanelWindow = () => {
    const id = Number.parseIntStrict(process.env.PANEL_WINDOW_ID ?? '', 10);
    return BrowserWindow.fromId(id);
};

export const assertPanelWindow = () => {
    const panelWindow = getPanelWindow();
    assertInstanceOf(panelWindow, BrowserWindow, 'Não foi possível obter a janela do painel.');
    return panelWindow;
};

export function getWorldFromURL(url: URL) {
    const index = url.hostname.indexOf('.tribalwars');
    if (index === -1) return null;
    
    let world = url.hostname.slice(0, index);
    world = world.replace(/www\.?/g, '');
    
    if (world.length < 1) return null;
    return world;
};

export function assertWorldFromURL(url: URL) {
    const world = getWorldFromURL(url);
    assertString(world, 'Não foi possível determinar o mundo a partir da URL.');
    return world;
};

export function togglePanelWindow() {
    const mainWindow = assertMainWindow();
    const panelWindow = assertPanelWindow();

    if (panelWindow.isVisible()) {
        panelWindow.hide();

        if (mainWindow.isVisible() && !mainWindow.isFocused()) {
            mainWindow.focus();
        };

    } else {
        panelWindow.show();
    };
};

/**
* Retorna o alias do usuário, no padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`.

* Ele é usado para diferenciar tanto diferentes jogadores quanto diferentes mundos do mesmo jogador.
* @param playerName Nome do jogador.
*/
export function generateUserAlias(world: string, playerName: string): UserAlias {
    playerName = encodeURIComponent(playerName);
    return `${world.toLowerCase()}__USERID__${playerName}`;
};