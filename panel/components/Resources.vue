<script setup lang="ts">
import { usePlunderHistoryStore } from '#/vue/stores/plunder.js';
import { ipcInvoke } from '#/ipc.js';
import WoodIcon from '#/vue/components/images/WoodIcon.vue';
import StoneIcon from '#/vue/components/images/StoneIcon.vue';
import IronIcon from '#/vue/components/images/IronIcon.vue';
import StorageIcon from '#/vue/components/images/StorageIcon.vue';

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
            <WoodIcon />
            <span>{{ history.wood }}</span>
        </div>
        <div>
            <StoneIcon />
            <span>{{ history.stone }}</span>
        </div>
        <div>
            <IronIcon />
            <span>{{ history.iron }}</span>
        </div>
        <div>
            <StorageIcon />
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