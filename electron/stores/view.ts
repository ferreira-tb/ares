import { ref, type Mechanus } from 'mechanus';
import { MechanusBrowserViewStoreType } from '$types/electron';
import type { WebContents } from 'electron';

export function defineBrowserViewStore(mechanus: Mechanus) {
    return mechanus.define('browser-view', {
        currentWebContents: ref<WebContents | null>(null)
    } satisfies MechanusBrowserViewStoreType);
};