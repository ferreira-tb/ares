import { ipcRenderer } from 'electron';
import { assertInteger } from '$shared/guards';
import { usePlunderStore, usePlunderHistoryStore, usePlunderConfigStore } from '$renderer/stores/plunder';
import { PanelPlunderError } from '$panel/error';

export function setPlunderEvents() {
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    ipcRenderer.on('plunder:stop', () => (plunderConfigStore.active = false));

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança.
    ipcRenderer.on('plunder:config-updated', <T extends keyof typeof plunderConfigStore>(
        _e: unknown, key: T, value: typeof plunderConfigStore[T]
    ) => {
        plunderConfigStore[key] = value;
    });

    ipcRenderer.on('plunder:attack-sent', <T extends keyof PlunderAttackLog>(_e: unknown, details: PlunderAttackLog) => {
        try {
            if (!plunderConfigStore.active) return;
            for (const [key, value] of Object.entries(details) as [T, PlunderAttackLog[T]][]) {
                if (key in plunderHistoryStore) {
                    assertInteger(value, `${key} amount is not an integer.`);
                    plunderHistoryStore[key] += value;
                };
            };
            
        } catch (err) {
            PanelPlunderError.catch(err);
        };
    });

    ipcRenderer.on('panel:patch-plunder-info', (_e, info: PlunderInfoType) => plunderStore.$patch(info));
    ipcRenderer.on('panel:patch-plunder-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
    ipcRenderer.on('panel:patch-plunder-history', (_e, history: PlunderHistoryType) => plunderHistoryStore.$patch(history));
};