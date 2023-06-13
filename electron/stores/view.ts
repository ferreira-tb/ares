import { ref } from 'mechanus';

export function defineBrowserViewStore(mechanus: Mechanus) {
    return mechanus.define('browser-view', () => {
        const allWebContents = ref<Set<Electron.WebContents>>(new Set());
        const registeredWebContents = ref<WeakSet<Electron.WebContents>>(new WeakSet());
        const currentWebContents = ref<Electron.WebContents | null>(null);
        const currentAutoResize = ref<(() => void) | null>(null);

        return {
            allWebContents,
            registeredWebContents,
            currentWebContents,
            currentAutoResize
        } satisfies MechanusBrowserViewStoreType;
    });
};