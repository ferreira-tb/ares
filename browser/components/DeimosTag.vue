<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { assertString } from '@tb-dev/ts-guard';
import { ipcInvoke, ipcSend } from '$global/ipc';

const deimos = await ipcInvoke('get-deimos-file');
assertString(deimos, 'Não foi possível iniciar o Deimos.');

const blob = new Blob([deimos], { type: 'text/javascript' });
const objectURL = URL.createObjectURL(blob);

const scriptTag = document.createElement('script');
scriptTag.setAttribute('fetchpriority', 'high');
scriptTag.setAttribute('src', objectURL);
scriptTag.onload = () => ipcSend('script-tag-is-ready');
document.head.appendChild(scriptTag);

onBeforeUnmount(() => {
    URL.revokeObjectURL(objectURL);
    document.head.removeChild(scriptTag);
});
</script>