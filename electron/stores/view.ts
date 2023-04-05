import { ref, type Mechanus } from 'mechanus';
import type { WebContents } from 'electron';
import type { MechanusBrowserViewStoreType } from '$types/stores';

export function defineBrowserViewStore(mechanus: Mechanus) {
    return mechanus.define('browser-view', {
        allWebContents: ref<Set<WebContents>>(new Set()),
        registeredWebContents: ref<WeakSet<WebContents>>(new WeakSet()),
        currentWebContents: ref<WebContents | null>(null),
        currentAutoResize: ref<(() => void) | null>(null)
    } satisfies MechanusBrowserViewStoreType);
};