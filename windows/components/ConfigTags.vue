<script setup lang="ts">
import { reactive, toRaw } from 'vue';
import { watchDeep } from '@vueuse/core';
import { NCheckbox, NDivider, NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';

const config = reactive(await ipcInvoke('config:get', 'tags'));
watchDeep(config, (newValue) => ipcSend('config:update', 'tags', toRaw(newValue)));
</script>

<template>
	<section id="tags-config">
        <NDivider title-placement="left" class="config-divider">Etiquetas</NDivider>
        <NGrid :cols="1" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-checkbox">
                    <NCheckbox v-model:checked="config.plunder" size="large">
                        Saque
                    </NCheckbox>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-checkbox">
                    <NCheckbox v-model:checked="config.snob" size="large">
                        Cunhagem
                    </NCheckbox>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-checkbox">
                    <NCheckbox v-model:checked="config.nextIncoming" size="large">
                        Próximo ataque
                    </NCheckbox>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-checkbox">
                    <NCheckbox v-model:checked="config.responseTime" size="large">
                        Tempo de resposta
                    </NCheckbox>
                </div>
            </NGridItem>
        </NGrid>
    </section>
</template>

<style scoped lang="scss">
#tags-config {
    padding: 0.5em;
}
</style>