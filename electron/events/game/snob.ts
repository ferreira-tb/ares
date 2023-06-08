import { ipcMain } from 'electron';
import { useSnobConfigStore } from '$electron/interface';

export function setSnobEvents() {
    const snobConfigStore = useSnobConfigStore();

    ipcMain.on('snob:update-config', <T extends keyof SnobConfigType>(
        _e: unknown, config: SnobConfigType
    ) => {
        for (const [key, value] of Object.entries(config) as [T, SnobConfigType[T]][]) {
            if (key in snobConfigStore) {
                snobConfigStore[key] = value;
            };
        };
    });
};