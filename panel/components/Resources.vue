<script setup lang="ts">
import { watchEffect } from 'vue';
import { usePlunderHistoryStore } from '$vue/stores/plunder';
import { ipcInvoke } from '$global/ipc';
import WoodIcon from '$icons/resources/WoodIcon.vue';
import StoneIcon from '$icons/resources/StoneIcon.vue';
import IronIcon from '$icons/resources/IronIcon.vue';
import StorageIcon from '$icons/buildings/StorageIcon.vue';

const props = defineProps<{
    plunderStatus: boolean;
}>();

const history = usePlunderHistoryStore();

watchEffect(async () => {
    // Se o Plunder estiver ativado, atualiza o histórico com as informações salvas.
    if (props.plunderStatus === true) {
        const lastPlundered = await ipcInvoke('get-last-plunder-attack-details');
        if (lastPlundered) history.$patch({ 
            wood: lastPlundered.wood,
            stone: lastPlundered.stone,
            iron: lastPlundered.iron,
            attackAmount: lastPlundered.attackAmount,
        });
    };
});
</script>

<template>
    <div class="res-area">
        <div>
            <WoodIcon />
            <span>{{ history.wood.toLocaleString('pt-br') }}</span>
        </div>
        <div>
            <StoneIcon />
            <span>{{ history.stone.toLocaleString('pt-br') }}</span>
        </div>
        <div>
            <IronIcon />
            <span>{{ history.iron.toLocaleString('pt-br') }}</span>
        </div>
        <div>
            <StorageIcon />
            <span>{{ history.total.toLocaleString('pt-br') }}</span>
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