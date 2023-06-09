import { ipcMain, type BrowserView } from 'electron';
import { BrowserViewError } from '$electron/error';

export function setCurrentViewNavigationEvents(currentView: MechanusComputedRef<BrowserView>) {
    ipcMain.on('current-view:navigate-to-place', navigateToScreen(currentView, 'place'));
    ipcMain.on('current-view:navigate-to-snob-train', navigateToScreen(currentView, 'snob', { mode: 'train' }));
    ipcMain.on('current-view:navigate-to-snob-coin', async (e, villageId: number, groupId: number = 0) => {
        // `from=-1` garante que todas as aldeias do grupo serão listadas.
        const searchParams: { [key: string]: string } = { mode: 'coin', from: '-1' };
        if (Number.isInteger(groupId)) searchParams.group = groupId.toString(10);
        const navigate = navigateToScreen(currentView, 'snob', { mode: 'coin' });
        await navigate(e, villageId);
    });
};

function navigateToScreen(
    currentView: MechanusComputedRef<BrowserView>,
    screen: GameScreen,
    searchParams: { [key: string]: string } = {}
) {
    return async function(_e: Electron.IpcMainEvent, villageId: number) {
        try {
            if (!Number.isInteger(villageId)) {
                const errMessage = `Cannot navigate to ${screen}: village id must be an integer.`;
                throw new BrowserViewError(errMessage);
            };
    
            const contents = currentView.value.webContents;
            const url = new URL(contents.getURL());
            url.search = `village=${villageId}&screen=${screen}`;
            
            for (const [key, value] of Object.entries(searchParams)) {
                url.searchParams.set(key, value);
            };

            await contents.loadURL(url.href);
    
        } catch (err) {
            BrowserViewError.catch(err);
        };
    };
};