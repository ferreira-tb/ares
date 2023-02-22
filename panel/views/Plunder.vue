<script setup lang="ts">
import { computed, watch } from 'vue';
import { NButton, NButtonGroup, NGrid, NGridItem } from 'naive-ui';
import { usePlunderConfigStore, usePlunderHistoryStore } from '$vue/stores/plunder.js';
import { ipcSend } from '$global/ipc.js';
import { Deimos } from '$deimos/shared/ipc.js';
import Resources from '$panel/components/Resources.vue';
import SwitchPopover from '$vue/components/popover/SwitchPopover.vue';

const config = usePlunderConfigStore();
const history = usePlunderHistoryStore();

const plunderButtonText = computed(() => config.active === false ? 'Saquear' : 'Parar');

watch(() => config.active, (value) => {
    ipcSend('update-plunder-config', 'active', value);

    // Se o Plunder for desativado, é preciso salvar as informações do histórico e então resetá-lo.
    if (value === false) {
        // Se não houve saque, não é necessário realizar essa operação.
        const currentHistoryState = history.raw();
        if (Object.values(currentHistoryState).every((value) => value > 0)) {
            ipcSend('save-plundered-amount', currentHistoryState);
        };

        history.reset();
        Deimos.send('show-ui-success-message', 'O saque foi interrompido.');
    } else {
        Deimos.send('show-ui-success-message', 'O saque foi iniciado.');
    };
});

watch(() => config.ignoreWall, (value) => ipcSend('update-plunder-config', 'ignoreWall', value));
watch(() => config.groupAttack, (value) => ipcSend('update-plunder-config', 'groupAttack', value));
watch(() => config.destroyWall, (value) => ipcSend('update-plunder-config', 'destroyWall', value));
watch(() => config.useC, (value) => ipcSend('update-plunder-config', 'useC', value));
watch(() => config.ignoreDelay, (value) => ipcSend('update-plunder-config', 'ignoreDelay', value));
watch(() => config.blindAttack, (value) => ipcSend('update-plunder-config', 'blindAttack', value));
</script>

<template>
    <main>
        <div class="button-area">
            <NButtonGroup>
                <NButton round disabled>Modelos</NButton>
                <NButton round @click="config.active = !config.active">{{ plunderButtonText }}</NButton>
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
                <SwitchPopover :value="config.ignoreWall" @switch-updated="(v) => config.ignoreWall = v">
                    <template #trigger>Ignorar muralha</template>
                    <span>
                        Determina se o Ares deve evitar aldeias com muralha.
                        Nas configurações, é possível determinar a partir de qual nível ele deve ignorar.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.groupAttack" @switch-updated="(v) => config.groupAttack = v">
                    <template #trigger>Ataque em grupo</template>
                    <span>
                        Permite enviar ataques de mais de uma aldeia.
                        Recomenda-se que o grupo usado seja dinâmico.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.destroyWall" @switch-updated="(v) => config.destroyWall = v">
                    <template #trigger>Destruir muralha</template>
                    <span>
                        Determina se o Ares deve destruir as muralhas das aldeias.
                        Nas configurações, é possível determinar a partir de qual nível ele deve destruir,
                        assim como a quantidade de tropas que ele deve enviar.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.useC" @switch-updated="(v) => config.useC = v">
                    <template #trigger>Usar modelo C</template>
                    <span>Determina se o Ares deve usar o modelo C para atacar.</span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.ignoreDelay" @switch-updated="(v) => config.ignoreDelay = v">
                    <template #trigger>Ignorar delay</template>
                    <span>
                        O jogo possui um limite de cinco ações por segundo.
                        Sendo assim, o Ares impõe um pequeno atraso entre cada ataque.
                        Caso essa opção esteja ativada, o Ares não irá ter esse comportamento.
                    </span>
                </SwitchPopover>
            </NGridItem>

            <NGridItem>
                <SwitchPopover :value="config.blindAttack" @switch-updated="(v) => config.blindAttack = v">
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