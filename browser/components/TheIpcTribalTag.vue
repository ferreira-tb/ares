<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useVModel, whenever } from '@vueuse/core';
import { IpcTribal } from '$ipc/interface';
import { useBrowserStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { gameOriginRegex } from '$common/regex';
import { BrowserError } from '$browser/error';

const props = defineProps<{
    ready: boolean;
}>();

const emit = defineEmits<{
    (event: 'update:ready', value: boolean): void;
}>();

const browserStore = useBrowserStore();

const readyRef = useVModel(props, 'ready', emit);
whenever(readyRef, () => ipcSend('ipc-tribal:tag-is-ready'));

const ipcTribalFile = await ipcInvoke('ipc-tribal:get-file');
if (!ipcTribalFile) throw new BrowserError('IpcTribal file is not available');

const ipcBlob = new Blob([ipcTribalFile], { type: 'text/javascript' });
const objectURL = URL.createObjectURL(ipcBlob);

const scriptTag = document.createElement('script');
scriptTag.setAttribute('fetchpriority', 'high');
scriptTag.setAttribute('src', objectURL);
scriptTag.onload = () => (readyRef.value = true);
document.head.appendChild(scriptTag);

whenever(readyRef, async () => {
    if (gameOriginRegex.test(location.origin)) {
        const responseTime = await IpcTribal.invoke('ipc-tribal:response-time');
        ipcSend('browser:update-response-time', responseTime);
        browserStore.responseTime = responseTime;
    }
});

onUnmounted(() => {
    document.head.removeChild(scriptTag);
    URL.revokeObjectURL(objectURL);
});
</script>