import { app, BrowserWindow } from 'electron';
import { assertInstanceOf, isInstanceOf } from '@tb-dev/ts-guard';
import { favicon, aresURL } from '$electron/utils/constants.js';
import { assertWorld } from '$electron/utils/guards.js';
import { MainProcessError } from '$electron/error.js';
import type { UserAlias } from '$types/electron.js';
import type { World } from '$types/game.js';

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

function createAresWebsiteWindow() {
    const aresWebsite = new Map<'ares', BrowserWindow>();

    return function() {
        // Se a janela já estiver aberta, foca-a.
        const previousWindow = aresWebsite.get('ares');
        if (isInstanceOf(previousWindow, BrowserWindow) && !previousWindow.isDestroyed()) {
            if (!previousWindow.isVisible()) {
                previousWindow.show();
            } else {
                previousWindow.focus();
            };
            return;
        };

        const aresWindow = new BrowserWindow({
            parent: getMainWindow(),
            width: 1200,
            height: 800,
            useContentSize: true,
            show: false,
            minimizable: true,
            maximizable: true,
            resizable: true,
            fullscreenable: false,
            title: 'Ares',
            icon: favicon,
            autoHideMenuBar: true,
            webPreferences: {
                spellcheck: false,
                devTools: process.env.ARES_MODE === 'dev'
            }
        });

        aresWindow.setMenu(null);
        aresWindow.loadURL(aresURL);
        aresWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

        aresWindow.once('ready-to-show', () =>  {
            aresWebsite.set('ares', aresWindow);
            aresWindow.show();
        });

        // Remove do mapa quando a janela for fechada.
        aresWindow.once('closed', () => aresWebsite.delete('ares'));
    };
};

/** Abre uma janela para o site do Ares. */
export const openAresWebsite = createAresWebsiteWindow();

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