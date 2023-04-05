import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { MainProcessEventError } from '$electron/error';
import { usePlunderStore, usePlunderConfigStore, usePlunderCacheStore } from '$electron/interface';
import { plunderSearchParams } from '$electron/utils/constants';
import { generateRandomDelay } from '$electron/utils/helpers';
import type { PlunderPageListType } from '$types/plunder';

export function setPlunderPageEvents() {
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const plunderCacheStore = usePlunderCacheStore();

    const { page: currentPage } = storeToRefs(plunderStore);
    const { pages } = storeToRefs(plunderCacheStore);

    // Retorna as informações sobre a aldeia atual armazenadas no cache do Plunder.
    ipcMain.handle('get-plunder-pages-info', () => pages.value);

    // Armazena informações relevantes sobre a aldeia atual no cache do Plunder.
    // Entre elas estão detalhes sobre as páginas do assistente de saque.
    ipcMain.on('update-plunder-pages-info', (_e, pagesInfo: PlunderPageListType | null) => {
        try {
            if (pagesInfo && pages.value?.id === pagesInfo.id) return;
            pages.value = pagesInfo;
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Navega para a primeira página do assistente de saque.
    ipcMain.handle('navigate-to-first-plunder-page', (e) => {
        try {
            const url = new URL(e.sender.getURL());
            url.search = plunderSearchParams;
            queueMicrotask(() => e.sender.loadURL(url.href).catch(MainProcessEventError.catch));
            return true;
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    // Navega para a próxima página do assistente de saque, se possível for.
    ipcMain.handle('navigate-to-next-plunder-page', (e) => {
        try {
            if (!pages.value || pages.value.all.length <= 1) return false;

            const availablePages = pages.value.all.filter(({ done }) => !done);
            let nextPage = availablePages.find(({ index }) => index > currentPage.value);
            if (!nextPage) nextPage = availablePages.find(({ index }) => index !== currentPage.value);
            if (!nextPage) return false;
            
            const url = new URL(e.sender.getURL());
            url.searchParams.set('Farm_page', nextPage.index.toString(10));

            const delay = generateRandomDelay(plunderConfigStore.pageDelay, 200);
            setTimeout(() => e.sender.loadURL(url.href).catch(MainProcessEventError.catch), delay);
            
            nextPage.done = true;
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });
};