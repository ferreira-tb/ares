<script setup lang="ts">
import { ref } from 'vue';
import { useIpcRenderer } from '@vueuse/electron';
import { isObject, assertKeyOf, toNull } from '@tb-dev/ts-guard';
import { NDivider, NSpace } from 'naive-ui';
import { ipcInvoke } from '$global/ipc.js';
import { ModuleConfigError } from '$modules/error.js';
import InfoResult from '$vue/components/result/InfoResult.vue';
import WallInput from '$vue/components/WallInput.vue';
import Popover from '$vue/components/popover/Popover.vue';
import type { PlunderConfigType, PlunderConfigKeys, PlunderConfigValues } from '$types/plunder.js';

const previousConfig = toNull(await ipcInvoke('get-plunder-config'), isObject);
const config = ref<PlunderConfigType | null>(previousConfig);

const ipcRenderer = useIpcRenderer();
// Atualiza o estado local do Plunder sempre que ocorre uma mudança.
ipcRenderer.on('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
    try {
        if (!isObject(config.value)) return;
        assertKeyOf<PlunderConfigType>(key, config.value, `${key} não é uma configuração válida para o Plunder.`);
        Reflect.set(config, key, value);
    } catch (err) {
        ModuleConfigError.catch(err);
    };
});
</script>

<template>
    <section v-if="config">
        <NDivider title-placement="left">Muralha</NDivider>
        <NSpace>
            <Popover>
                <template #trigger>Ignorar muralhas maiores que</template>
                <span>Determina a partir de qual nível de muralha o Ares deve ignorar aldeias.</span>
            </Popover>
            <WallInput :value="config.wallLevelToIgnore" @level-updated="(l) => config!.wallLevelToIgnore = l" />
        </NSpace>
    </section>

    <InfoResult v-else
        title="Você está logado?"
        description="É necessário estar logado para acessar as configurações do assistente de saque."
    />
</template>

<style scoped>

</style>