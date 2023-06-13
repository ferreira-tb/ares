<script setup lang="ts">
import { nextTick } from 'vue';
import { watchDeep } from '@vueuse/core';
import { NResult } from 'naive-ui';
import { useIpcOn, useUserAlias } from '$renderer/composables';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { usePlunderConfigStore } from '$renderer/stores';
import ConfigPlunderGridAttack from '$modules/components/ConfigPlunderGridAttack.vue';
import ConfigPlunderGridGroups from '$modules/components/ConfigPlunderGridGroups.vue';
import ConfigPlunderGridTemplateC from '$modules/components/ConfigPlunderGridTemplateC.vue';
import ConfigPlunderGridWall from '$modules/components/ConfigPlunderGridWall.vue';
import ConfigPlunderGridOthers from '$modules/components/ConfigPlunderGridOthers.vue';

const userAlias = useUserAlias();

// Sincroniza a configuração com o processo principal.
const config = usePlunderConfigStore();
const previousConfig = await ipcInvoke('plunder:get-config');
if (previousConfig) {
    config.$patch(previousConfig);
    await nextTick();
};

// Atualiza o estado local do Plunder sempre que ocorre uma mudança.
useIpcOn('plunder:patch-config', (_e: unknown, newConfig: PlunderConfigType) => {
    config.$patch(newConfig);
});

watchDeep(config, () => {
    ipcSend('plunder:update-config', config.raw());
});
</script>

<template>
    <section v-if="userAlias" class="plunder-config">
        <ConfigPlunderGridAttack />
        <ConfigPlunderGridTemplateC />
        <ConfigPlunderGridGroups />
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