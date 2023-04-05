<script setup lang="ts">
import { ref, watchSyncEffect, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useMutationObserver } from '@vueuse/core';
import { isInstanceOf } from '@tb-dev/ts-guard';
import { useAresStore } from '$global/stores/ares';
import { ipcSend, ipcInvoke } from '$global/ipc';
import { PlunderError } from '$browser/error';
import type { UseMutationObserverOptions } from '@vueuse/core';

const aresStore = useAresStore();
const { captcha } = storeToRefs(aresStore);

captcha.value = thereIsBotCheck();
watchSyncEffect(() => ipcSend('update-captcha-status', captcha.value));

const content = ref(document.querySelector<HTMLTableElement>('table#contentContainer'));
const options: UseMutationObserverOptions = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
};

useMutationObserver(content, (mutations) => {
    mutations.forEach((mutation) => {
        if (thereIsBotCheckAmongNodes(mutation.addedNodes)) {
            captcha.value = true;
        } else if (thereIsBotCheckAmongNodes(mutation.removedNodes)) {
            captcha.value = false;
            reloadMainView().catch(PlunderError.catch);
        };
    });
}, options);

function thereIsBotCheck() {
    const botCheck = document.querySelector('#bot_check');
    return isInstanceOf(botCheck, HTMLElement);
};

function thereIsBotCheckAmongNodes(rawNodes: NodeList) {
    const nodes = Array.from(rawNodes);
    return nodes.some(isBotCheck);
};

function isBotCheck(node: Node) {
    if (!isInstanceOf(node, HTMLElement)) return false;
    return node.matches('#bot_check');
};

async function reloadMainView() {
    const shouldReload = await ipcInvoke('should-reload-after-captcha');
    if (shouldReload) {
        await nextTick();
        ipcSend('reload-main-view');
    };
};
</script>

<template>
    <div></div>
</template>

<style scoped>

</style>