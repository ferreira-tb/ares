<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlunderStore } from '@/stores/plunder.js';
import { ipcSend } from '@/ipc.js';
import Button from '@/components/Button.vue';
import Resources from '@/components/Resources.vue';

const plunderStore = usePlunderStore();
const { 
    status,
    ignoreWall,
    destroyWall,
    groupAttack,
    useCModel,
    ignoreDelay,
    blindAttack
} = storeToRefs(plunderStore);

watch(status, value => ipcSend('set-plunder-state', 'status', value));
watch(ignoreWall, value => ipcSend('set-plunder-state', 'ignoreWall', value));
watch(destroyWall, value => ipcSend('set-plunder-state', 'destroyWall', value));
watch(groupAttack, value => ipcSend('set-plunder-state', 'groupAttack', value));
watch(useCModel, value => ipcSend('set-plunder-state', 'useCModel', value));
watch(ignoreDelay, value => ipcSend('set-plunder-state', 'ignoreDelay', value));
watch(blindAttack, value => ipcSend('set-plunder-state', 'blindAttack', value));

const plunderButtonText = computed(() => status.value === false ? 'Saquear' : 'Parar');
</script>

<template>
    <main>
        <div class="button-area">
            <Button @click="status = !status">{{ plunderButtonText }}</Button>
        </div>

        <Resources />

        <div class="checkbox-area">
            <label class="checkbox-label">
                <input type="checkbox" v-model="ignoreWall" />
                <span>Ignorar muralha</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="destroyWall" />
                <span>Destruir muralha</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="groupAttack" />
                <span>Usar grupo</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="useCModel" />
                <span>Usar modelo C</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="ignoreDelay" />
                <span>Ignorar delay</span>
            </label>
            <label class="checkbox-label">
                <input type="checkbox" v-model="blindAttack" />
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