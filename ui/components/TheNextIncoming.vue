<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { NTag } from 'naive-ui';
import { useIncomingsStore } from '$renderer/stores';

const incomingsStore = useIncomingsStore();
const { incomings } = storeToRefs(incomingsStore);

const nextIncoming = computed<string | null>(() => {
    const filtered = incomings.value.filter((incoming) => incoming.arrivalTime > Date.now());
    filtered.sort((a, b) => a.arrivalTime - b.arrivalTime);
    if (filtered.length === 0) return null;
    return new Date(filtered[0].arrivalTime).toLocaleTimeString();
});
</script>

<template>
    <div class="next-incoming-tag">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="incomings.length > 0 && nextIncoming" class="tag-wrapper">
                <NTag round type="info" size="small">
                    {{ `Próximo ataque: ${nextIncoming}` }}
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

.next-incoming-tag {
    @include ui.ui-tag;

    .tag-wrapper {
        @include ui.tag-wrapper;
    }
}
</style>