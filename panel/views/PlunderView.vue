<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue';
import { NButton, NButtonGroup, NGrid, NGridItem } from 'naive-ui';
import { usePlunderConfigStore } from '$global/stores/plunder';
import { useFeaturesStore } from '$global/stores/features';
import { useGroupsStore } from '$global/stores/groups';
import { ipcSend } from '$global/ipc';
import { togglePlunder } from '$panel/utils/helpers';
import PlunderResources from '$panel/components/PlunderResources.vue';
import SwitchPopover from '$global/components/SwitchPopover.vue';

const config = usePlunderConfigStore();
const features = useFeaturesStore();
const groups = useGroupsStore();

const plunderButtonText = computed(() => config.active ? 'Parar' : 'Saquear');

// Não deve ser possível ativar o ataque em grupo se não houver grupos dinâmicos.
const dynamicGroupsAmount = computed<number>(() => {
    const allGroups = Array.from(groups.all);
    return allGroups.reduce((amount, group) => {
        if (group.type === 'dynamic') amount += 1;
        return amount;
    }, 0);
});

watch(() => config.active, togglePlunder);
watch(() => config.ignoreWall, (v) => ipcSend('update-plunder-config', 'ignoreWall', v));
watch(() => config.destroyWall, (v) => ipcSend('update-plunder-config', 'destroyWall', v));
watch(() => config.groupAttack, (v) => ipcSend('update-plunder-config', 'groupAttack', v));
watch(() => config.useC, (v) => ipcSend('update-plunder-config', 'useC', v));
watch(() => config.ignoreDelay, (v) => ipcSend('update-plunder-config', 'ignoreDelay', v));
watch(() => config.blindAttack, (v) => ipcSend('update-plunder-config', 'blindAttack', v));

watchEffect(() => {
    if (features.premium === false || dynamicGroupsAmount.value === 0) {
        config.groupAttack = false;
    } else if (features.farmAssistant === false) {
        config.active = false;
    };
});
</script>

<template>
    <main>
        <div class="button-area">
            <NButtonGroup>
                <NButton round @click="ipcSend('open-custom-plunder-template-window')">
                    Modelos
                </NButton>
                <NButton round :disabled="features.farmAssistant === false" @click="config.active = !config.active">
                    {{ plunderButtonText }}
                </NButton>
                <NButton round @click="ipcSend('open-settings-window', 'config-plunder')">
                    Configurações
                </NButton>
            </NButtonGroup>
        </div>

        <PlunderResources :plunder-status="config.active" />

        <NGrid class="switch-area" :cols="2" :x-gap="12" :y-gap="10">
            <NGridItem>
                <SwitchPopover v-model:value="config.ignoreWall">
                    <template #trigger>Ignorar muralha</template>
                    <span>
                        Determina se o Ares deve evitar aldeias com muralha.
                        Nas configurações, é possível determinar a partir de qual nível ele deve ignorar.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover
                    v-model:value="config.groupAttack"
                    :disabled="features.premium === false || dynamicGroupsAmount === 0"
                >
                    <template #trigger>Ataque em grupo</template>
                    <span>Permite enviar ataques de mais de uma aldeia. Grupos manuais geram loops infinitos,
                        que aumentam, e muito, a chance de surgirem captchas. Por causa disso, apenas grupos dinâmicos são permitidos.
                        Não é possível utilizar essa opção sem uma conta premium ativa.</span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover v-model:value="config.destroyWall">
                    <template #trigger>Destruir muralha</template>
                    <span>
                        Determina se o Ares deve destruir as muralhas das aldeias.
                        Nas configurações, é possível determinar a partir de qual nível ele deve destruir,
                        assim como a quantidade de tropas que ele deve enviar.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover v-model:value="config.useC">
                    <template #trigger>Usar modelo C</template>
                    <span>Determina se o Ares deve usar o modelo C quando possível.</span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover v-model:value="config.ignoreDelay">
                    <template #trigger>Ignorar delay</template>
                    <span>
                        O jogo possui um limite de cinco ações por segundo.
                        Sendo assim, o Ares impõe um pequeno atraso entre cada ataque.
                        Caso essa opção esteja ativada, o Ares não irá ter esse comportamento.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover v-model:value="config.blindAttack">
                    <template #trigger>Ataque às cegas</template>
                    <span>Ataca mesmo se não houver informações sobre a aldeia.</span>
                </SwitchPopover>
            </NGridItem>
        </NGrid>
    </main>
</template>

<style scoped>
.button-area {
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
}

.switch-area {
    -webkit-app-region: no-drag;
    margin-top: 1em;
}
</style>