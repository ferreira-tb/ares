<script setup lang="ts">
import { watchEffect } from 'vue';
import { usePlunderHistoryStore } from '$renderer/stores/plunder';
import { ipcInvoke } from '$renderer/ipc';
import StorageIcon from '$icons/buildings/StorageIcon.vue';

const props = defineProps<{
    plunderStatus: boolean;
}>();

const history = usePlunderHistoryStore();
const total = history.useTotal();

watchEffect(async () => {
    // Se o Plunder estiver ativado, atualiza o histórico com as informações salvas.
    if (props.plunderStatus) {
        const lastPlundered = await ipcInvoke('plunder:get-history');
        if (lastPlundered) {
            history.$patch({ 
                wood: lastPlundered.wood,
                stone: lastPlundered.stone,
                iron: lastPlundered.iron,
                attackAmount: lastPlundered.attackAmount
            });
        };
    };
});
</script>

<template>
    <div class="res-area">
        <StorageIcon />
        <span>{{ total.toLocaleString('pt-br') }}</span>
    </div>
</template>

<style scoped lang="scss">
.res-area {
    display: flex;
    align-items: center;
    justify-items: center;
    justify-content: center;
    width: 100%;
}
</style>