import { assertInteger } from '$common/guards';
import { usePlunderStore, usePlunderHistoryStore, usePlunderConfigStore } from '$renderer/stores';
import { PanelPlunderViewError } from '$panel/error';
import { ipcOn } from '$renderer/ipc';

export function setPlunderEvents() {
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    ipcOn('plunder:stop', () => (plunderConfigStore.active = false));

    ipcOn('plunder:attack-sent', <T extends keyof PlunderAttackLog>(_e: unknown, details: PlunderAttackLog) => {
        try {
            if (!plunderConfigStore.active) return;
            for (const [key, value] of Object.entries(details) as [T, PlunderAttackLog[T]][]) {
                if (key in plunderHistoryStore) {
                    assertInteger(value, `${key} amount is not an integer.`);
                    plunderHistoryStore[key] += value;
                };
            };
            
        } catch (err) {
            PanelPlunderViewError.catch(err);
        };
    });

    ipcOn('plunder:patch-info', (_e, info: PlunderInfoType) => plunderStore.$patch(info));
    ipcOn('plunder:patch-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
    ipcOn('plunder:patch-history', (_e, history: PlunderHistoryType) => plunderHistoryStore.$patch(history));
};