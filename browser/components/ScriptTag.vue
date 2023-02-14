<script setup lang="ts">
import { ipcInvoke } from '$global/ipc.js';
import { assertType } from '$global/utils/assert.js';
import { onBeforeUnmount } from 'vue';

const deimos = await ipcInvoke('get-deimos-file');
assertType(typeof deimos === 'string' && deimos.length > 0, 'Não foi possível iniciar o Deimos.');

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