<script setup lang="ts">
import { computed } from 'vue';
import { computedAsync } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { NSelect, NSkeleton } from 'naive-ui';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import { useFeaturesStore } from '$vue/stores/features.js';
import { usePanelStore } from '$panel/stores/panel.js';
import { ipcInvoke } from '$global/ipc.js';
import { PanelPlunderError } from '$panel/error.js';

const config = usePlunderConfigStore();
const features = useFeaturesStore();
const panel = usePanelStore();

const { premium } = storeToRefs(features);
const url = computedAsync(async () => {
    if (premium.value !== true) return null;
    const mainWindowUrl = await ipcInvoke('main-window-url');
    return new URL(mainWindowUrl);
}, null);

const parser = new DOMParser();
const groups = computedAsync(async () => {
    try {
        if (url.value === null) return null;
        const baseUrl = `${url.value.origin}${url.value.pathname}`;
        const village = url.value.searchParams.getStrict('village');

        const groupsUrl = `${baseUrl}?village=${village}&screen=overview_villages&&mode=groups&type=static`;
        const response = await fetch(groupsUrl);
        const html = await response.text();

        // Seleciona apenas os grupos dinâmicos.
        const doc = parser.parseFromString(html, 'text/html');
        const selector = '#group_management_content #paged_view_content .group-menu-item[data-group-type="dynamic" i]';

        // Cria um mapa cujas chaves são os ids dos grupos e os valores são os nomes.
        return Map.fromElements(doc.queryAsArray(selector),
            (el) => el.getAttributeAsIntStrict('data-group-id'),
            (el) => el.getTextContentStrict().replace(/(^\[|\]$)/g, '')
        );

    } catch (err) {
        PanelPlunderError.catch(err);
        return false;
    };
}, null);

const options = computed(() => {
    if (groups.value === null) return [];
    return Object.entries(groups.value).map(([id, name]) => ({
        label: name,
        value: id,
    }));
});
</script>

<template>
    <TransitionGroup name="tb-fade" tag="div">
        <template :key="1" v-if="groups && groups.size > 0">
            <NSelect v-model:value="config.plunderGroupID" :options="options" />
        </template>
        <template :key="2" v-else-if="groups && groups.size === 0">
            <span>Não há grupos dinâmicos</span>
        </template>
        <template :key="3" v-else-if="groups === null">
            <NSkeleton animated size="medium" />
        </template>
        <template :key="4" v-else>
            <span>Não foi possível obter os grupos :(</span>
        </template>
    </TransitionGroup>
</template>

<style scoped>

</style>