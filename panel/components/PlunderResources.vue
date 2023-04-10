<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useElementSize } from '@vueuse/core';
import { usePlunderHistoryStore } from '$renderer/stores/plunder';
import { ipcInvoke } from '$renderer/ipc';
import WoodIcon from '$icons/resources/WoodIcon.vue';
import StoneIcon from '$icons/resources/StoneIcon.vue';
import IronIcon from '$icons/resources/IronIcon.vue';
import StorageIcon from '$icons/buildings/StorageIcon.vue';

const props = defineProps<{
    plunderStatus: boolean;
}>();

const history = usePlunderHistoryStore();

const resArea = ref<HTMLElement | null>(null);
const storage = ref<HTMLElement | null>(null);

const { width: resAreaWidth } = useElementSize(resArea);
const { width: storageWidth } = useElementSize(storage);

const shouldShowOtherResources = computed(() => {
    const totalWidth = (storageWidth.value * 4) + 50;
    return totalWidth < resAreaWidth.value;
});

const gridSize = computed(() => {
    return shouldShowOtherResources.value ? 'repeat(4, 1fr)' : '1fr';
});

watchEffect(async () => {
    // Se o Plunder estiver ativado, atualiza o histórico com as informações salvas.
    if (props.plunderStatus) {
        const lastPlundered = await ipcInvoke('get-last-plunder-attack-details');
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
    <div ref="resArea" class="res-area">
        <div v-if="shouldShowOtherResources">
            <WoodIcon />
            <span>{{ history.wood.toLocaleString('pt-br') }}</span>
        </div>
        <div v-if="shouldShowOtherResources">
            <StoneIcon />
            <span>{{ history.stone.toLocaleString('pt-br') }}</span>
        </div>
        <div v-if="shouldShowOtherResources">
            <IronIcon />
            <span>{{ history.iron.toLocaleString('pt-br') }}</span>
        </div>
        <div ref="storage">
            <StorageIcon />
            <span>{{ history.total.toLocaleString('pt-br') }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.res-area {
    display: grid;
    grid-template-columns: v-bind("gridSize");
    align-items: center;
    justify-items: center;
    column-gap: 0.5em;
    width: 100%;

    & > div {
        display: flex;
        justify-content: center;
    }
}
</style>