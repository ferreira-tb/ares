<script setup lang="ts">
import { computed, nextTick, watchEffect } from 'vue';
import { watchDeep } from '@vueuse/core';
import { NButton, NButtonGroup, NGrid, NGridItem, NSwitch } from 'naive-ui';
import { useGameDataStore, usePlunderConfigStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { useGroups } from '$renderer/composables';
import { StandardWindowName } from '$common/enum';
import ThePlunderedResources from '$panel/components/ThePlunderedResources.vue';

const config = usePlunderConfigStore();
const gameData = useGameDataStore();

// Sincroniza a configuração com o processo principal.
const previousConfig = await ipcInvoke('plunder:get-config');
if (previousConfig) {
    config.$patch(previousConfig);
    await nextTick();
};

const plunderButtonText = computed(() => config.active ? 'Parar' : 'Saquear');

// Não deve ser possível ativar o ataque em grupo se não houver grupos dinâmicos.
const allGroups = useGroups();
const hasDynamicGroup = computed<boolean>(() => {
    const groups = Array.from(allGroups.value);
    return groups.some((group) => group.type === 'dynamic');
});

const canUseGroupAttack = computed<boolean>(() => {
    if (gameData.features.premium === false) return false;
    return hasDynamicGroup.value;
});

watchDeep(config, () => {
    ipcSend('plunder:update-config', config.raw());
});

watchEffect(() => {
    if (gameData.features.premium === false || !hasDynamicGroup.value) {
        config.groupAttack = false;
    } else if (gameData.features.farmAssistant === false) {
        config.active = false;
    };
});
</script>

<template>
    <main>
        <div class="button-area">
            <NButtonGroup>
                <NButton round @click="ipcSend('plunder:open-custom-template-window')">
                    Modelos
                </NButton>
                <NButton
                    round
                    :disabled="gameData.features.farmAssistant === false"
                    @click="config.active = !config.active"
                >
                    {{ plunderButtonText }}
                </NButton>
                <NButton round @click="ipcSend('config:open', StandardWindowName.ConfigPlunder)">
                    Configurações
                </NButton>
            </NButtonGroup>
        </div>

        <ThePlunderedResources />

        <NGrid class="switch-area" :cols="2" :x-gap="12" :y-gap="10">
            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.ignoreWall" round size="small" />
                    <div class="switch-label">Ignorar muralha</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.groupAttack" round size="small" :disabled="!canUseGroupAttack" />
                    <div class="switch-label">Ataque em grupo</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.destroyWall" round size="small" />
                    <div class="switch-label">Destruir muralha</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.useC" round size="small" />
                    <div class="switch-label">Usar modelo C</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.ignoreDelay" round size="small" />
                    <div class="switch-label">Ignorar delay</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.blindAttack" round size="small" />
                    <div class="switch-label">Ataque às cegas</div>
                </div>
            </NGridItem>
        </NGrid>
    </main>
</template>

<style scoped lang="scss">
@use '$panel/assets/main.scss';

.button-area {
    @include main.flex-x-center-y-center;
    margin-bottom: 1em;
}

.switch-area {
    -webkit-app-region: no-drag;
    margin-top: 1em;
}
</style>