import { BrowserWindow } from 'electron';
import { assertInstanceOf } from '@tb-dev/ts-guard';
import type { UserAlias } from '$types/electron.js';

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

/**
* Retorna o alias do usuário, no padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`.

* Ele é usado para diferenciar tanto diferentes jogadores quanto diferentes mundos do mesmo jogador.
* @param playerName Nome do jogador.
*/
export function generateUserAlias(world: string, playerName: string): UserAlias {
    playerName = encodeURIComponent(playerName);
    return `${world.toLowerCase()}__USERID__${playerName}`;
};