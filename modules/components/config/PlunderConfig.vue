<script setup lang="ts">
import { reactive } from 'vue';
import { isObject } from '@tb-dev/ts-guard';
import { NDivider, NSpace } from 'naive-ui';
import { ipcInvoke } from '$global/ipc.js';
import ErrorResult from '$vue/components/ErrorResult.vue';
import WallInput from '$vue/components/WallInput.vue';
import Popover from '$vue/components/Popover.vue';

const previousConfig = await ipcInvoke('get-plunder-config');
const config = isObject(previousConfig) ? reactive(previousConfig) : null;
</script>

<template>
    <section v-if="config">
        <NDivider title-placement="left">Muralha</NDivider>
        <NSpace>
            <Popover>
                <template #trigger>Ignorar muralhas maiores que</template>
                <span>Determina a partir de qual nível de muralha o Ares deve ignorar aldeias.</span>
            </Popover>
            <WallInput :value="config.wallLevelToIgnore" @update-level="(l) => config!.wallLevelToIgnore = l" />
        </NSpace>
    </section>

    <ErrorResult v-else description="Não foi possível carregar as configurações do assistente de saque :(" />
</template>

<style scoped>

</style>