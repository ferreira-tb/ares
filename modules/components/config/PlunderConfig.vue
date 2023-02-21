<script setup lang="ts">
import { reactive } from 'vue';
import { useIpcRenderer } from '@vueuse/electron';
import { isObject, assertKeyOf } from '@tb-dev/ts-guard';
import { NDivider, NSpace } from 'naive-ui';
import { ipcInvoke } from '$global/ipc.js';
import { ModuleConfigError } from '$modules/error.js';
import ErrorResult from '$vue/components/ErrorResult.vue';
import WallInput from '$vue/components/WallInput.vue';
import Popover from '$vue/components/Popover.vue';
import type { PlunderConfigType, PlunderConfigKeys, PlunderConfigValues } from '$types/plunder.js';

const previousConfig = await ipcInvoke('get-plunder-config');
const config = isObject(previousConfig) ? reactive(previousConfig) : null;

const ipcRenderer = useIpcRenderer();
// Atualiza o estado local do Plunder sempre que ocorre uma mudança.
ipcRenderer.on('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
    try {
        if (!isObject(config)) return;
        assertKeyOf<PlunderConfigType>(key, config, `${key} não é uma configuração válida para o Plunder.`);
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

    <ErrorResult v-else description="Não foi possível carregar as configurações do assistente de saque :(" />
</template>

<style scoped>

</style>