<script setup lang="ts">
import { nextTick } from 'vue';
import { watchDeep } from '@vueuse/core';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { usePlunderConfigStore } from '$renderer/stores';
import PanelBotPlunderGridAttack from '$windows/components/PanelBotPlunderGridAttack.vue';
import PanelBotPlunderGridGroups from '$windows/components/PanelBotPlunderGridGroups.vue';
import PanelBotPlunderGridTemplateC from '$windows/components/PanelBotPlunderGridTemplateC.vue';
import PanelBotPlunderGridWall from '$windows/components/PanelBotPlunderGridWall.vue';
import PanelBotPlunderGridOthers from '$windows/components/PanelBotPlunderGridOthers.vue';

defineProps<{
    userAlias: UserAlias | null;
}>();

// Sincroniza a configuração com o processo principal.
const config = usePlunderConfigStore();
const currentConfig = await ipcInvoke('plunder:get-config');
if (currentConfig) {
    config.$patch(currentConfig);
    await nextTick();
}

watchDeep(config, () => {
    ipcSend('plunder:update-config', config.raw());
});
</script>

<template>
    <section id="panel-plunder">
        <PanelBotPlunderGridAttack />
        <PanelBotPlunderGridTemplateC />
        <PanelBotPlunderGridGroups :user-alias="userAlias" />
        <PanelBotPlunderGridWall :user-alias="userAlias" />
        <PanelBotPlunderGridOthers />
    </section>
</template>

<style scoped lang="scss">
#panel-plunder {
    padding: 0.5em;
}
</style>