<script setup lang="ts">
import { computed, watch } from 'vue';
import { usePlunderStore, usePlunderHistoryStore } from '@/stores/plunder.js';
import { ipcSend } from '@/ipc.js';
import Button from '@/components/Button.vue';
import Resources from '@/components/Resources.vue';

const store = usePlunderStore();
const history = usePlunderHistoryStore();

watch(() => store.ignoreWall, (value) => ipcSend('set-plunder-state', 'ignoreWall', value));
watch(() => store.destroyWall, (value) => ipcSend('set-plunder-state', 'destroyWall', value));
watch(() => store.groupAttack, (value) => ipcSend('set-plunder-state', 'groupAttack', value));
watch(() => store.useCModel, (value) => ipcSend('set-plunder-state', 'useCModel', value));
watch(() => store.ignoreDelay, (value) => ipcSend('set-plunder-state', 'ignoreDelay', value));
watch(() => store.blindAttack, (value) => ipcSend('set-plunder-state', 'blindAttack', value));

watch(() => store.status, (value) => {
    ipcSend('set-plunder-state', 'status', value);

    // Se o Plunder for desativado, é preciso salvar as informações do histórico e então resetá-lo.
    if (value === false) {
        const currentHistoryState = history.getState();
        ipcSend('save-plundered-amount', currentHistoryState);
        history.resetState();
    };
});

const plunderButtonText = computed(() => store.status === false ? 'Saquear' : 'Parar');
</script>

<template>
    <main>
        <div class="button-area">
            <Button @click="store.status = !store.status">{{ plunderButtonText }}</Button>
        </div>

        <Transition name="fade" mode="out-in">
            <Suspense>
                <Resources :plunder-status="store.status" />
                <template #fallback class="to-center green-text bold">
                    Carregando...
                </template>
            </Suspense>
        </Transition>
        
        <div class="checkbox-area">
            <label class="checkbox-label">
                <input type="checkbox" v-model="store.ignoreWall" />
                <span>Ignorar muralha</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="store.destroyWall" />
                <span>Destruir muralha</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="store.groupAttack" />
                <span>Usar grupo</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="store.useCModel" />
                <span>Usar modelo C</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="store.ignoreDelay" />
                <span>Ignorar delay</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="store.blindAttack" />
                <span>Ataque às cegas</span>
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