<script setup lang="ts">
import { whenever, useObjectUrl } from '@vueuse/core';
import { ipcInvoke } from '$global/ipc.js';
import { assertType } from '$global/error.js';

const deimos = await ipcInvoke('get-deimos');
assertType(typeof deimos === 'string' && deimos.length > 0, 'Não foi possível iniciar o Deimos.');

const blob = new Blob([deimos], { type: 'text/javascript' });
const objectURL = useObjectUrl(blob);

whenever(objectURL, (current) => {
    const scriptTag = document.createElement('script');
    document.head.appendChild(scriptTag);
    scriptTag.setAttribute('src', current);
});
</script>