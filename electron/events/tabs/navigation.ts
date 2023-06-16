import { URL } from 'node:url';
import { ipcMain } from 'electron';
import { BrowserTab } from '$electron/tabs';
import { BrowserTabError } from '$electron/error';

export function setCurrentViewNavigationEvents() {
    ipcMain.on('current-tab:navigate-to-place', navigateToScreen('place'));
    ipcMain.on('current-tab:navigate-to-snob-train', navigateToScreen('snob', { mode: 'train' }));
    ipcMain.on('current-tab:navigate-to-snob-coin', async (e, villageId: number, groupId: number = 0) => {
        // `from=-1` garante que todas as aldeias do grupo serão listadas.
        const searchParams: { [key: string]: string } = { mode: 'coin', from: '-1' };
        if (Number.isInteger(groupId)) searchParams.group = groupId.toString(10);
        const navigate = navigateToScreen('snob', { mode: 'coin' });
        await navigate(e, villageId);
    });
};

function navigateToScreen(screen: GameScreen, searchParams: { [key: string]: string } = {}) {
    return async function(_e: Electron.IpcMainEvent, villageId: number) {
        try {
            if (!Number.isInteger(villageId)) {
                throw new BrowserTabError(`Cannot navigate to ${screen}: village id is invalid.`);
            };
    
            const contents = BrowserTab.current.webContents;
            const url = new URL(contents.getURL());
            url.search = `village=${villageId}&screen=${screen}`;
            
            for (const [key, value] of Object.entries(searchParams)) {
                url.searchParams.set(key, value);
            };

            await contents.loadURL(url.href);
    
        } catch (err) {
            BrowserTabError.catch(err);
        };
    };
};