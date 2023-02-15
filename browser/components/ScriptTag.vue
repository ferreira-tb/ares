<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { assertString } from '@tb-dev/ts-guard';
import { ipcInvoke } from '$global/ipc.js';

const deimos = await ipcInvoke('get-deimos-file');
assertString(deimos, 'Não foi possível iniciar o Deimos.');

const blob = new Blob([deimos], { type: 'text/javascript' });
const objectURL = URL.createObjectURL(blob);

const scriptTag = document.createElement('script');
document.head.appendChild(scriptTag);
scriptTag.setAttribute('src', objectURL);

onBeforeUnmount(() => {
    URL.revokeObjectURL(objectURL);
    document.head.removeChild(scriptTag);
});
</script>