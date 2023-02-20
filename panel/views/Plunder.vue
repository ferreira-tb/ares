<script setup lang="ts">
import { computed, watch } from 'vue';
import { usePlunderConfigStore, usePlunderHistoryStore } from '$vue/stores/plunder.js';
import { ipcSend } from '$global/ipc.js';
import { Deimos } from '$deimos/shared/ipc.js';
import Resources from '$panel/components/Resources.vue';
import { VBtn as Button } from 'vuetify/components/VBtn';
import { VTooltip as Tooltip } from 'vuetify/components/VTooltip';
import { VSwitch as Switch } from 'vuetify/components/VSwitch';
import { VContainer as Container, VRow as Row, VCol as Column } from 'vuetify/components/VGrid';

const config = usePlunderConfigStore();
const history = usePlunderHistoryStore();

config.$subscribe(() => ipcSend('update-plunder-config', config.raw()));

watch(() => config.active, (value) => {
    // Se o Plunder for desativado, é preciso salvar as informações do histórico e então resetá-lo.
    if (value === false) {
        // Se não ocorreu saque, não é necessário salvar as informações.
        const currentHistoryState = history.raw();
        if (Object.values(currentHistoryState).every((value) => value > 0))  {
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
            <Button @click="config.active = !config.active">{{ plunderButtonText }}</Button>
            <Button @click="ipcSend('open-plunder-config-window')">Configurações</Button>
        </div>

        <Transition name="fade" mode="out-in">
            <Suspense>
                <Resources :plunder-status="config.active" />
                <template #fallback class="to-center green-text bold">
                    Carregando...
                </template>
            </Suspense>
        </Transition>
        
        <Container fluid class="plunder-switch-area">
            <Row dense justify="center">
                <Column>
                    <Switch v-model="config.ignoreWall" color="#00bd7e" inset density="compact" hide-details>
                        <template #label>
                            <span>Ignorar muralha</span>
                            <Tooltip :open-delay="800">Determina se o Ares deve ignorar as aldeias com muralha</Tooltip>
                        </template>
                    </Switch>
                </Column>
                <Column>
                    <Switch v-model="config.groupAttack" color="#00bd7e" inset density="compact" hide-details>
                        <template #label>
                            <span>Usar grupo</span>
                            <Tooltip :open-delay="800">Permite enviar ataques de mais de uma aldeia</Tooltip>
                        </template>
                    </Switch>
                </Column>
            </Row>
            <Row dense justify="center">
                <Column>
                    <Switch v-model="config.destroyWall" color="#00bd7e" inset density="compact" hide-details>
                        <template #label>
                            <span>Destruir muralha</span>
                            <Tooltip :open-delay="800">Determina se o Ares deve destruir as muralhas das aldeias</Tooltip>
                        </template>
                    </Switch>
                </Column>
                <Column>
                    <Switch v-model="config.useC" color="#00bd7e" inset density="compact" hide-details>
                        <template #label>
                            <span>Usar modelo C</span>
                            <Tooltip :open-delay="800">Determina se o Ares deve usar o modelo C para atacar</Tooltip>
                        </template>
                    </Switch>
                </Column>
            </Row>
            <Row dense justify="center">
                <Column>
                    <Switch v-model="config.ignoreDelay" color="#00bd7e" inset density="compact" hide-details>
                        <template #label>
                            <span>Ignorar delay</span>
                            <Tooltip :open-delay="800">Diminui o intervalo entre os ataques</Tooltip>
                        </template>
                    </Switch>  
                </Column>
                <Column>
                    <Switch v-model="config.blindAttack" color="#00bd7e" inset density="compact" hide-details>
                        <template #label>
                            <span>Ataque às cegas</span>
                            <Tooltip :open-delay="800">Ataca mesmo se não houver informações sobre a aldeia</Tooltip>
                        </template>
                    </Switch>
                </Column>
            </Row>
        </Container>
    </main>
</template>

<style scoped>
main {
    user-select: none;
}

.button-area {
    text-align: center;
    margin-bottom: 1em;
}

.button-area > button:not(:last-of-type) {
    margin-right: 0.5em;
}

.plunder-switch-area {
    -webkit-app-region: no-drag;
}
</style>