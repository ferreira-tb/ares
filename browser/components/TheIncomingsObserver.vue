<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { watchImmediate, useMutationObserver } from '@vueuse/core';
import { usePlayerStore } from '$renderer/stores';
import { IpcTribal } from '$ipc/interface';
import { ipcSend } from '$renderer/ipc';
import type { UseMutationObserverOptions } from '@vueuse/core';

const playerStore = usePlayerStore();
const { incomings } = storeToRefs(playerStore);

const incomingsElement = ref(document.querySelector<HTMLSpanElement>('#incomings_cell #incomings_amount'));
const options: UseMutationObserverOptions = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
};

useMutationObserver(incomingsElement, async (mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length === 0) continue;
        incomings.value = await IpcTribal.invoke('get-incoming-attacks');
    };
}, options);

watchImmediate(incomings, (newAmount) => ipcSend('game:update-incoming-attacks', newAmount));
</script>