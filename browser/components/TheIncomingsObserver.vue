<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMutationObserver, type UseMutationObserverOptions } from '@vueuse/core';
import { useIncomingsStore } from '$renderer/stores';
import { IpcTribal } from '$ipc/interface';
import { ipcSend } from '$renderer/ipc';

const incomingsStore = useIncomingsStore();
const { amount } = storeToRefs(incomingsStore);
const incomingsElement = ref(document.querySelector<HTMLSpanElement>('#incomings_cell #incomings_amount'));
await updateAmount();

const options: UseMutationObserverOptions = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
};

useMutationObserver(incomingsElement, async (mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length === 0) continue;
        await updateAmount();
    };
}, options);

async function updateAmount() {
    const current = incomingsElement.value ? await IpcTribal.invoke('ipc-tribal:incoming-attacks') : null;
    amount.value = current;
    ipcSend('game:update-incomings-amount', current);
};
</script>