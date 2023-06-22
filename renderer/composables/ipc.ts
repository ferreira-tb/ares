import { ipcRenderer } from 'electron';
import { tryOnScopeDispose } from '@vueuse/core';
import { ipcOn } from '$renderer/ipc';

export function useIpcOn(channel: string, listener: Parameters<typeof Electron.ipcRenderer.on>[1]) {
    ipcOn(channel, listener);
    
    tryOnScopeDispose(() => {
        ipcRenderer.removeListener(channel, listener);
    });
}