import { ref, type Mechanus } from 'mechanus';
import { MechanusBrowserViewStoreType } from '$types/view';
import type { WebContents } from 'electron';

export function defineBrowserViewStore(mechanus: Mechanus) {
    return mechanus.define('browser-view', {
        allWebContents: ref<Set<WebContents>>(new Set()),
        registeredWebContents: ref<WeakSet<WebContents>>(new WeakSet()),
        currentWebContents: ref<WebContents | null>(null)
    } satisfies MechanusBrowserViewStoreType);
};