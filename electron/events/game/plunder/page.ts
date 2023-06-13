import { URL } from 'node:url';
import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { MainProcessEventError } from '$electron/error';
import { usePlunderStore, usePlunderConfigStore, usePlunderCacheStore } from '$electron/stores';
import { GameSearchParams } from '$common/constants';
import { generateRandomDelay } from '$common/helpers';

export function setPlunderPageEvents() {
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const plunderCacheStore = usePlunderCacheStore();

    const { page: currentPage } = storeToRefs(plunderStore);
    const { pages } = storeToRefs(plunderCacheStore);

    // Retorna as informações sobre a aldeia atual armazenadas no cache do Plunder.
    ipcMain.handle('plunder:get-pages-info', () => pages.value);

    // Armazena informações relevantes sobre a aldeia atual no cache do Plunder.
    // Entre elas estão detalhes sobre as páginas do assistente de saque.
    ipcMain.on('plunder:update-pages-info', (_e, pagesInfo: PlunderPageListType | null) => {
        try {
            if (pagesInfo && pages.value?.id === pagesInfo.id) return;
            pages.value = pagesInfo;
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Navega para a primeira página do assistente de saque.
    ipcMain.on('plunder:navigate-to-first-page', async (e) => {
        try {
            const url = new URL(e.sender.getURL());
            url.search = GameSearchParams.Farm;
            await e.sender.loadURL(url.href);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Navega para a próxima página do assistente de saque, se possível for.
    ipcMain.handle('plunder:navigate-to-next-page', (e) => {
        try {
            if (!pages.value || pages.value.all.length <= 1) return false;

            const availablePages = pages.value.all.filter(({ done }) => !done);
            let nextPage = availablePages.find(({ index }) => index > currentPage.value);
            if (!nextPage) nextPage = availablePages.find(({ index }) => index !== currentPage.value);
            if (!nextPage) return false;
            
            const url = new URL(e.sender.getURL());
            url.searchParams.set('Farm_page', nextPage.index.toString(10));

            const delay = generateRandomDelay(plunderConfigStore.pageDelay, 200);
            e.sender.send('plunder:set-navigation-timer', url.href, delay);
            
            nextPage.done = true;
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });
};