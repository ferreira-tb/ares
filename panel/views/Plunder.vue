<script setup lang="ts">
import { computed, watch } from 'vue';
import { usePlunderConfigStore, usePlunderHistoryStore } from '$vue/stores/plunder.js';
import { ipcSend } from '$global/ipc.js';
import { Deimos } from '$deimos/shared/ipc.js';
import { VBtn as Button } from 'vuetify/components/VBtn';
import { VTooltip as Tooltip } from 'vuetify/components/VTooltip';
import Resources from '$panel/components/Resources.vue';

const config = usePlunderConfigStore();
const history = usePlunderHistoryStore();

watch(() => config.ignoreWall, (value) => ipcSend('set-plunder-config', 'ignoreWall', value));
watch(() => config.destroyWall, (value) => ipcSend('set-plunder-config', 'destroyWall', value));
watch(() => config.groupAttack, (value) => ipcSend('set-plunder-config', 'groupAttack', value));
watch(() => config.useC, (value) => ipcSend('set-plunder-config', 'useC', value));
watch(() => config.ignoreDelay, (value) => ipcSend('set-plunder-config', 'ignoreDelay', value));
watch(() => config.blindAttack, (value) => ipcSend('set-plunder-config', 'blindAttack', value));

watch(() => config.active, (value) => {
    ipcSend('set-plunder-config', 'active', value);
    
    // Se o Plunder for desativado, é preciso salvar as informações do histórico e então resetá-lo.
    if (value === false) {
        const currentHistoryState = history.getState();
        ipcSend('save-plundered-amount', currentHistoryState);
        history.resetState();
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
            <Button @click="config.active = !config.active">{{ plunderButtonText }}</Button>
        </div>

        <Transition name="fade" mode="out-in">
            <Suspense>
                <Resources :plunder-status="config.active" />
                <template #fallback class="to-center green-text bold">
                    Carregando...
                </template>
            </Suspense>
        </Transition>
        
        <div class="checkbox-area">
            <label class="checkbox-label">
                <input type="checkbox" v-model="config.ignoreWall" disabled="true" />
                <span>Ignorar muralha</span>
                <Tooltip>
                    Determina se o Ares deve ignorar as aldeias com muralha.
                </Tooltip>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="config.destroyWall" disabled="true" />
                <span>Destruir muralha</span>
                <Tooltip>
                    Determina se o Ares deve destruir as muralhas das aldeias.
                </Tooltip>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="config.groupAttack" disabled="true" />
                <span>Usar grupo</span>
                <Tooltip>
                    Permite enviar ataques de mais de uma aldeia.
                </Tooltip>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="config.useC" disabled="true" />
                <span>Usar modelo C</span>
                <Tooltip>
                    Determina se o Ares deve usar o modelo C para atacar.
                </Tooltip>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="config.ignoreDelay" />
                <span>Ignorar delay</span>
                <Tooltip>
                    Diminui o intervalo entre os ataques.
                </Tooltip>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="config.blindAttack" disabled="true" />
                <span>Ataque às cegas</span>
                <Tooltip>
                    Ataca mesmo se não houver informações sobre a aldeia.
                </Tooltip>
            </label>
        </div>
    </main>
</template>

<style scoped>
main {
    user-select: none;
}

.button-area {
    text-align: center;
    margin-bottom: 0.5em;
}

.checkbox-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    -webkit-app-region: no-drag;
}

.checkbox-label {
    display: flex;
    align-items: center;
    width: 100%;
}

.checkbox-label > span {
    margin-left: 0.5em;
}
</style>