<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlunderStore } from '@/stores/plunder.js';
import { ipcInvoke } from '@/ipc.js';
import { ClaustrophobicError } from '@/error.js';
import Button from '@/components/Button.vue';

import type { PlunderState, PlunderStateValue } from '@/stores/plunder.js';

const { 
    status,
    ignoreWall,
    destroyWall,
    groupAttack,
    useCModel,
    ignoreDelay,
    blindAttack
} = storeToRefs(usePlunderStore());

watch(status, value => updatePlunderState('status', value));
watch(ignoreWall, value => updatePlunderState('ignoreWall', value));
watch(destroyWall, value => updatePlunderState('destroyWall', value));
watch(groupAttack, value => updatePlunderState('groupAttack', value));
watch(useCModel, value => updatePlunderState('useCModel', value));
watch(ignoreDelay, value => updatePlunderState('ignoreDelay', value));
watch(blindAttack, value => updatePlunderState('blindAttack', value));

async function updatePlunderState(name: keyof PlunderState, value: PlunderStateValue) {
    try {
        const response = await ipcInvoke('set-plunder-state', name, value);
        if (typeof response === 'string' || response === false) throw response;
    } catch (err) {
        if (err instanceof Error) throw err;
        if (err === false) throw new ClaustrophobicError('Erro ao salvar as configurações');
        if (typeof err === 'string') throw new ClaustrophobicError(err);
    };
};

const plunderButtonText = computed(() => {
    return status.value === false ? 'Saquear' : 'Parar';
});
</script>

<template>
    <main>
        <div class="button-area">
            <Button @click="status = !status">{{ plunderButtonText }}</Button>
        </div>

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