import { arrayIncludes } from '@tb-dev/ts-guard';
import { routeNames, router } from '$panel/router';
import { ipcSend } from '$renderer/ipc';
import { usePlunderHistoryStore } from '$renderer/stores/plunder';
import type { useAresStore } from '$renderer/stores/ares';

export async function pushRoute(screenName: ReturnType<typeof useAresStore>['screen']) {
    if (screenName && arrayIncludes(routeNames, screenName)) {
        await router.push({ name: screenName });
    } else {
        await router.push('/');
    };
};

export function togglePlunder(newStatus: boolean) {
    ipcSend('update-plunder-config', 'active', newStatus);
    if (!newStatus) return;

    // Se o Plunder for desativado, é preciso salvar as informações do histórico e então resetá-lo.
    // Se não houve saque, não é necessário realizar essa operação.
    const history = usePlunderHistoryStore();
    const currentHistoryState = history.raw();
    if (Object.values(currentHistoryState).every((value) => value > 0)) {
        ipcSend('save-plunder-attack-details', currentHistoryState);
    };

    history.reset();
};