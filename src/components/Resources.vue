<script setup lang="ts">
import { usePlunderHistoryStore } from '@/stores/plunder.js';
import { ipcInvoke } from '@/ipc.js';

const props = defineProps<{
    plunderStatus: boolean;
}>();

const history = usePlunderHistoryStore();

// Se o Plunder estiver ativado, atualiza o histórico com as informações salvas.
if (props.plunderStatus === true) {
    const lastPlundered = await ipcInvoke('get-last-plundered-amount');
    if (lastPlundered) history.$patch({ 
        wood: lastPlundered.wood,
        stone: lastPlundered.stone,
        iron: lastPlundered.iron,
        attackAmount: lastPlundered.attackAmount,
    });
};
</script>

<template>
    <div class="res-area">
        <div>
            <span class="wood icon"></span>
            <span>{{ history.wood }}</span>
        </div>
        <div>
            <span class="stone icon"></span>
            <span>{{ history.stone }}</span>
        </div>
        <div>
            <span class="iron icon"></span>
            <span>{{ history.iron }}</span>
        </div>
        <div>
            <span class="storage icon"></span>
            <span>{{ history.total }}</span>
        </div>
    </div>
</template>

<style scoped>
.res-area {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    justify-items: center;
}

.res-area > div {
    display: flex;
    justify-content: center;
}
</style>