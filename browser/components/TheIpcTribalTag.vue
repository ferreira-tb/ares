<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { tryOnUnmounted, whenever } from '@vueuse/core';
import { useBrowserStore } from '$browser/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { BrowserError } from '$browser/error';

const browserStore = useBrowserStore();
const { isIpcTribalReady } = storeToRefs(browserStore);
whenever(isIpcTribalReady, () => ipcSend('ipc-tribal:tag-is-ready'), { flush: 'sync' });

const ipcTribalFile = await ipcInvoke('ipc-tribal:get-file');
if (!ipcTribalFile) throw new BrowserError('IpcTribal file is not available');

const ipcBlob = new Blob([ipcTribalFile], { type: 'text/javascript' });
const objectURL = URL.createObjectURL(ipcBlob);

const scriptTag = document.createElement('script');
scriptTag.setAttribute('fetchpriority', 'high');
scriptTag.setAttribute('src', objectURL);
scriptTag.onload = () => (isIpcTribalReady.value = true);
document.head.appendChild(scriptTag);

tryOnUnmounted(() => {
    document.head.removeChild(scriptTag);
    URL.revokeObjectURL(objectURL);
});
</script>