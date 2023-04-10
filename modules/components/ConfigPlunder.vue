<script setup lang="ts">
import { ref } from 'vue';
import { useIpcRendererOn } from '@vueuse/electron';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { ModuleConfigError } from '$modules/error';
import ResultInfo from '$renderer/components/ResultInfo.vue';
import ConfigPlunderGridAttack from '$modules/components/ConfigPlunderGridAttack.vue';
import ConfigPlunderGridGroups from '$modules/components/ConfigPlunderGridGroups.vue';
import ConfigPlunderGridWall from '$modules/components/ConfigPlunderGridWall.vue';
import ConfigPlunderGridOthers from '$modules/components/ConfigPlunderGridOthers.vue';
import type { PlunderConfigType } from '$types/plunder';

const previousConfig = await ipcInvoke('plunder:get-config');
const config = ref<PlunderConfigType | null>(previousConfig);

// Atualiza o estado local do Plunder sempre que ocorre uma mudança.
useIpcRendererOn('plunder-config-updated', <T extends keyof PlunderConfigType>(_e: unknown, name: T, value: PlunderConfigType[T]) => {
    try {
        if (!config.value) return;
        config.value[name] = value;
    } catch (err) {
        ModuleConfigError.catch(err);
    };
});

function updateConfig<T extends keyof PlunderConfigType>(name: T, value: PlunderConfigType[T]) {
    if (!config.value) return;
    config.value[name] = value;
    ipcSend('plunder:update-config', name, value);
};
</script>

<template>
    <section v-if="config" class="plunder-config">
        <ConfigPlunderGridAttack :config="config" @update:config="updateConfig" />
        <ConfigPlunderGridGroups :config="config" @update:config="updateConfig" />
        <ConfigPlunderGridWall :config="config" @update:config="updateConfig" />
        <ConfigPlunderGridOthers :config="config" @update:config="updateConfig" />
    </section>

    <ResultInfo
        v-else
        title="Você está logado?"
        description="É necessário estar logado para acessar as configurações do assistente de saque."
    />
</template>

<style scoped lang="scss">
.plunder-config {
    padding-bottom: 2em;

    :deep(.plunder-config-select) {
        margin-right: 0.5em;
    }
}
</style>