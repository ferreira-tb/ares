import { ref } from 'mechanus';

export function defineBrowserViewStore(mechanus: Mechanus) {
    return mechanus.define('browser-view', {
        allWebContents: ref<Set<Electron.WebContents>>(new Set()),
        registeredWebContents: ref<WeakSet<Electron.WebContents>>(new WeakSet()),
        currentWebContents: ref<Electron.WebContents | null>(null),
        currentAutoResize: ref<(() => void) | null>(null)
    } satisfies MechanusBrowserViewStoreType);
};