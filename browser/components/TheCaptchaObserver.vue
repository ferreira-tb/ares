<script setup lang="ts">
import { ref, watchSyncEffect, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useMutationObserver } from '@vueuse/core';
import { isInstanceOf } from '$common/guards';
import { useCacheStore } from '$renderer/stores';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { PlunderError } from '$browser/error';
import type { UseMutationObserverOptions } from '@vueuse/core';

const cache = useCacheStore();
const { captcha } = storeToRefs(cache);

captcha.value = thereIsBotCheck();
watchSyncEffect(() => ipcSend('captcha:update-status', captcha.value));

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
    const shouldReload = await ipcInvoke('config:should-reload-after-captcha');
    if (shouldReload) {
        await nextTick();
        ipcSend('main-tab:reload');
    };
};
</script>

<template>
    <div></div>
</template>