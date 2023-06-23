<script setup lang="ts">
import { nextTick } from 'vue';
import { watchDeep } from '@vueuse/core';
import { NResult } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { usePlunderConfigStore } from '$renderer/stores';
import PanelPlunderGridAttack from '$windows/components/PanelPlunderGridAttack.vue';
import PanelPlunderGridGroups from '$windows/components/PanelPlunderGridGroups.vue';
import PanelPlunderGridTemplateC from '$windows/components/PanelPlunderGridTemplateC.vue';
import PanelPlunderGridWall from '$windows/components/PanelPlunderGridWall.vue';
import PanelPlunderGridOthers from '$windows/components/PanelPlunderGridOthers.vue';

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
    <section v-if="userAlias" id="panel-plunder">
        <PanelPlunderGridAttack />
        <PanelPlunderGridTemplateC />
        <PanelPlunderGridGroups :user-alias="userAlias" />
        <PanelPlunderGridWall :user-alias="userAlias" />
        <PanelPlunderGridOthers />
    </section>

    <div v-else class="result-info">
        <NResult
            status="info"
            title="Você está logado?"
            description="É necessário estar logado para acessar as configurações do assistente de saque."
        />
    </div>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

#panel-plunder {
    padding: 0.5em;
}

.result-info {
    @include main.to-center;
    width: 100%;
}
</style>