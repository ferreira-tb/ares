<script setup lang="ts">
import { nextTick } from 'vue';
import { watchDeep } from '@vueuse/core';
import { NResult } from 'naive-ui';
import { useUserAlias } from '$renderer/composables';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { usePlunderConfigStore } from '$renderer/stores';
import ConfigPlunderGridAttack from '$windows/components/ConfigPlunderGridAttack.vue';
import ConfigPlunderGridGroups from '$windows/components/ConfigPlunderGridGroups.vue';
import ConfigPlunderGridTemplateC from '$windows/components/ConfigPlunderGridTemplateC.vue';
import ConfigPlunderGridWall from '$windows/components/ConfigPlunderGridWall.vue';
import ConfigPlunderGridOthers from '$windows/components/ConfigPlunderGridOthers.vue';

const userAlias = useUserAlias();

// Sincroniza a configuração com o processo principal.
const config = usePlunderConfigStore();
const previousConfig = await ipcInvoke('plunder:get-config');
if (previousConfig) {
    config.$patch(previousConfig);
    await nextTick();
};

watchDeep(config, () => {
    ipcSend('plunder:update-config', config.raw());
});
</script>

<template>
    <section v-if="userAlias" class="plunder-config">
        <ConfigPlunderGridAttack />
        <ConfigPlunderGridTemplateC />
        <ConfigPlunderGridGroups :user-alias="userAlias" />
        <ConfigPlunderGridWall :user-alias="userAlias" />
        <ConfigPlunderGridOthers />
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
.plunder-config {
    padding: 0.5em;
}
</style>