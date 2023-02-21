<script setup lang="ts">
import { computed, watch } from 'vue';
import { usePlunderConfigStore, usePlunderHistoryStore } from '$vue/stores/plunder.js';
import { ipcSend } from '$global/ipc.js';
import { Deimos } from '$deimos/shared/ipc.js';
import Resources from '$panel/components/Resources.vue';
import { NButton, NButtonGroup, NSwitch, NPopover, NGrid, NGridItem } from 'naive-ui';

const config = usePlunderConfigStore();
const history = usePlunderHistoryStore();

config.$subscribe(() => ipcSend('update-plunder-config', config.raw()));

watch(() => config.active, (value) => {
    // Se o Plunder for desativado, é preciso salvar as informações do histórico e então resetá-lo.
    if (value === false) {
        // Se não ocorreu saque, não é necessário salvar as informações.
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

const plunderButtonText = computed(() => config.active === false ? 'Saquear' : 'Parar');
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
                <template #fallback class="to-center green-text bold">
                    Carregando...
                </template>
            </Suspense>
        </Transition>

        <NGrid class="switch-area" :cols="2" :x-gap="12" :y-gap="10">
            <NGridItem>
                <div class="switch-grid-item">
                    <NSwitch v-model="config.ignoreWall" size="small"></NSwitch>
                    <NPopover :delay="800" :maxWidth="250" :maxHeight="150" animated scrollable keep-alive-on-hover>
                        <template #trigger><span class="span-label">Ignorar muralha</span></template>
                        <span>
                            Determina se o Ares deve evitar aldeias com muralha.
                            Nas configurações, é possível determinar a partir de qual nível ele deve ignorar.
                        </span>
                    </NPopover>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="switch-grid-item">
                    <NSwitch v-model="config.groupAttack" size="small"></NSwitch>
                    <NPopover :delay="800" :maxWidth="250" :maxHeight="150" animated scrollable keep-alive-on-hover>
                        <template #trigger><span class="span-label">Ataque em grupo</span></template>
                        <span>
                            Permite enviar ataques de mais de uma aldeia.
                            Recomenda-se que o grupo usado seja dinâmico.
                        </span>
                    </NPopover>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="switch-grid-item">
                    <NSwitch v-model="config.destroyWall" size="small"></NSwitch>
                    <NPopover :delay="800" :maxWidth="250" :maxHeight="150" animated scrollable keep-alive-on-hover>
                        <template #trigger><span class="span-label">Destruir muralha</span></template>
                        <span>
                            Determina se o Ares deve destruir as muralhas das aldeias.
                            Nas configurações, é possível determinar a partir de qual nível ele deve destruir,
                            assim como a quantidade de tropas que ele deve enviar.
                        </span>
                    </NPopover>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="switch-grid-item">
                    <NSwitch v-model="config.useC" size="small"></NSwitch>
                    <NPopover :delay="800" :maxWidth="250" :maxHeight="150" animated scrollable keep-alive-on-hover>
                        <template #trigger><span class="span-label">Usar modelo C</span></template>
                        <span>Determina se o Ares deve usar o modelo C para atacar.</span>
                    </NPopover>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="switch-grid-item">
                    <NSwitch v-model="config.ignoreDelay" size="small"></NSwitch>
                    <NPopover :delay="800" :maxWidth="250" :maxHeight="150" animated scrollable keep-alive-on-hover>
                        <template #trigger><span class="span-label">Ignorar delay</span></template>
                        <span>
                            O jogo possui um limite de cinco ações por segundo.
                            Sendo assim, o Ares impõe um pequeno atraso entre cada ataque.
                            Caso essa opção esteja ativada, o Ares não irá ter esse comportamento.
                        </span>
                    </NPopover>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="switch-grid-item">
                    <NSwitch v-model="config.blindAttack" size="small"></NSwitch>
                    <NPopover :delay="800" :maxWidth="250" :maxHeight="150" animated scrollable keep-alive-on-hover>
                        <template #trigger><span class="span-label">Ataque às cegas</span></template>
                        <span>Ataca mesmo se não houver informações sobre a aldeia.</span>
                    </NPopover>
                </div>
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

.span-label {
    margin-left: 0.5em;
}
</style>