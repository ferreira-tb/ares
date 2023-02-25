<script setup lang="ts">
import { computed, watch } from 'vue';
import { NButton, NButtonGroup, NGrid, NGridItem } from 'naive-ui';
import { usePlunderConfigStore, usePlunderHistoryStore } from '$vue/stores/plunder.js';
import { ipcSend } from '$global/ipc.js';
import Resources from '$panel/components/Resources.vue';
import SwitchPopover from '$vue/components/popover/SwitchPopover.vue';
import type { PlunderConfigKeys, PlunderConfigValues } from '$types/plunder.js';

const config = usePlunderConfigStore();
const history = usePlunderHistoryStore();

const plunderButtonText = computed(() => config.active === false ? 'Saquear' : 'Parar');

watch(() => config.active, (value) => {
    if (value !== false) return;
    // Se o Plunder for desativado, é preciso salvar as informações do histórico e então resetá-lo.
    // Se não houve saque, não é necessário realizar essa operação.
    const currentHistoryState = history.raw();
    if (Object.values(currentHistoryState).every((value) => value > 0)) {
        ipcSend('save-plunder-attack-details', currentHistoryState);
    };

    history.reset();
});

function updateConfig(name: 'active', value: boolean): void;
function updateConfig(name: 'ignoreWall', value: boolean): void;
function updateConfig(name: 'groupAttack', value: boolean): void;
function updateConfig(name: 'destroyWall', value: boolean): void;
function updateConfig(name: 'useC', value: boolean): void;
function updateConfig(name: 'ignoreDelay', value: boolean): void;
function updateConfig(name: 'blindAttack', value: boolean): void;
function updateConfig(name: PlunderConfigKeys, value: PlunderConfigValues) {
    Reflect.set(config, name, value);
    ipcSend('update-plunder-config', name, value);
};
</script>

<template>
    <main>
        <div class="button-area">
            <NButtonGroup>
                <NButton round disabled>Modelos</NButton>
                <NButton round @click="updateConfig('active', !config.active)">{{ plunderButtonText }}</NButton>
                <NButton round @click="ipcSend('open-plunder-config-window')">Configurações</NButton>
            </NButtonGroup>
        </div>

        <Transition name="fade" mode="out-in">
            <Suspense>
                <Resources :plunder-status="config.active" />
                <template #fallback class="loading-text">
                    Carregando...
                </template>
            </Suspense>
        </Transition>

        <NGrid class="switch-area" :cols="2" :x-gap="12" :y-gap="10">
            <NGridItem>
                <SwitchPopover :value="config.ignoreWall" @switch-updated="(v) => updateConfig('ignoreWall', v)">
                    <template #trigger>Ignorar muralha</template>
                    <span>
                        Determina se o Ares deve evitar aldeias com muralha.
                        Nas configurações, é possível determinar a partir de qual nível ele deve ignorar.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.groupAttack" @switch-updated="(v) => updateConfig('groupAttack', v)">
                    <template #trigger>Ataque em grupo</template>
                    <span>
                        Permite enviar ataques de mais de uma aldeia.
                        Recomenda-se que o grupo usado seja dinâmico.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.destroyWall" @switch-updated="(v) => updateConfig('destroyWall', v)">
                    <template #trigger>Destruir muralha</template>
                    <span>
                        Determina se o Ares deve destruir as muralhas das aldeias.
                        Nas configurações, é possível determinar a partir de qual nível ele deve destruir,
                        assim como a quantidade de tropas que ele deve enviar.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.useC" @switch-updated="(v) => updateConfig('useC', v)">
                    <template #trigger>Usar modelo C</template>
                    <span>Determina se o Ares deve usar o modelo C quando possível.</span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.ignoreDelay" @switch-updated="(v) => updateConfig('ignoreDelay', v)">
                    <template #trigger>Ignorar delay</template>
                    <span>
                        O jogo possui um limite de cinco ações por segundo.
                        Sendo assim, o Ares impõe um pequeno atraso entre cada ataque.
                        Caso essa opção esteja ativada, o Ares não irá ter esse comportamento.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.blindAttack" @switch-updated="(v) => updateConfig('blindAttack', v)">
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