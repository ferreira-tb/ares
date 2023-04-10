import { ipcSend } from '$renderer/ipc';
import { usePlunderHistoryStore } from '$renderer/stores/plunder';

export function togglePlunder(newStatus: boolean) {
    ipcSend('plunder:update-config', 'active', newStatus);
    if (!newStatus) return;

    // Se o Plunder for desativado, é preciso salvar as informações do histórico e então resetá-lo.
    // Se não houve saque, não é necessário realizar essa operação.
    const history = usePlunderHistoryStore();
    const currentHistoryState = history.raw();
    if (Object.values(currentHistoryState).every((value) => value > 0)) {
        ipcSend('plunder:save-attack-details', currentHistoryState);
    };

    history.reset();
};