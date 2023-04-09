<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { whenever } from '@vueuse/core';
import { assertString } from '@tb-dev/ts-guard';
import { useBrowserStore } from '$browser/stores/browser';
import { ipcInvoke, ipcSend } from '$renderer/ipc';

const browserStore = useBrowserStore();
const { isDeimosReady } = storeToRefs(browserStore);
whenever(isDeimosReady, () => ipcSend('deimos-tag-is-ready'), { flush: 'sync' });

const deimos = await ipcInvoke('get-deimos-file');
assertString(deimos, 'Could not get Deimos file');

const deimosBlob = new Blob([deimos], { type: 'text/javascript' });
const objectURL = URL.createObjectURL(deimosBlob);

const scriptTag = document.createElement('script');
scriptTag.setAttribute('fetchpriority', 'high');
scriptTag.setAttribute('src', objectURL);
scriptTag.onload = () => (isDeimosReady.value = true);
document.head.appendChild(scriptTag);

onBeforeUnmount(() => {
    document.head.removeChild(scriptTag);
    URL.revokeObjectURL(objectURL);
});
</script>