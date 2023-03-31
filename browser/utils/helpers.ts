import { ipcSend } from '$global/ipc';
import { Deimos } from '$deimos/shared/ipc';
import { useAresStore } from '$global/stores/ares';
import { useFeaturesStore } from '$global/stores/features';
import { useGroupsStore } from '$global/stores/groups';
import { usePlayerStore } from '$global/stores/player';
import { useCurrentVillageStore } from '$global/stores/village';
import { BrowserError } from '$browser/error';

export async function updateGameData() {
    try {
        const aresStore = useAresStore();
        const featuresStore = useFeaturesStore();
        const groupsStore = useGroupsStore();
        const playerStore = usePlayerStore();
        const currentVillageStore = useCurrentVillageStore();

        const gameData = await Deimos.invoke('get-game-data');
        if (!gameData) return;

        ipcSend('update-game-data', gameData);
        aresStore.$patch(gameData.ares);
        featuresStore.$patch(gameData.features);
        groupsStore.$patch(gameData.groups);
        playerStore.$patch(gameData.player);
        currentVillageStore.$patch(gameData.currentVillage);
        
    } catch (err) {
        BrowserError.catch(err);
    };
};

/**
 * Cria um breve atraso tendo como base o tempo de resposta do servidor.
 * @param extra Tempo adicional (em milisegundos).
 */
export function wait(extra?: number) {
    const aresStore = useAresStore();
    let responseTime = aresStore.responseTime ?? 200;
    if (extra) responseTime += extra;
    
    return new Promise<void>((resolve) => setTimeout(resolve, responseTime));
};