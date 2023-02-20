import * as fs from 'fs/promises';
import * as path from 'path';
import { app, dialog, BrowserWindow } from 'electron';
import { assertInstanceOf } from '@tb-dev/ts-guard';
import type { UserAlias } from '$types/electron.js';

export function restartAres() {
    app.relaunch();
    app.quit();
};

export async function createErrorLog(error: Error) {
    try {
        // Gera um arquivo de log com a data e a pilha de erros.
        const date = new Date().toLocaleString('pt-br');
        const logPath = path.join(app.getPath('userData'), 'ares_error.log');
        const logContent = `${date}\n${error.stack}\n\n`;
        await fs.appendFile(logPath, logContent);

    } catch {
        // Se não for possível gerar o log, emite um alerta.
        dialog.showErrorBox('ERRO CRÍTICO', `Um erro crítico ocorreu. Contate o desenvolvedor.\n\n${error.stack}`);
    };
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

/**
* Retorna o alias do usuário, no padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`.

* Ele é usado para diferenciar tanto diferentes jogadores quanto diferentes mundos do mesmo jogador.
* @param playerName Nome do jogador.
*/
export function generateUserAlias(world: string, playerName: string): UserAlias {
    playerName = encodeURIComponent(playerName);
    return `${world.toLowerCase()}__USERID__${playerName}`;
};