<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { NCountdown, NTag } from 'naive-ui';
import { computedWithControl, whenever } from '@vueuse/core';
import { useIncomingsStore } from '$renderer/stores';
import { ipcSend } from '$renderer/ipc';

defineProps<{
    userAlias: UserAlias | null;
}>();

const incomingsStore = useIncomingsStore();
const { amount, incomings } = storeToRefs(incomingsStore);

const filteredIncomings = computedWithControl(incomings, () => {
    const filtered = incomings.value.filter((incoming) => incoming.arrivalTime > Date.now());
    filtered.sort((a, b) => a.arrivalTime - b.arrivalTime);
    return filtered;
});

const nextIncoming = computed<IncomingAttack | null>(() => {
    if (filteredIncomings.value.length === 0) return null;
    const arrivalTime = filteredIncomings.value[0].arrivalTime;
    if (arrivalTime <= Date.now()) return null;
    return filteredIncomings.value[0];
});

const duration = computed(() => {
    if (!nextIncoming.value) return 0;
    return nextIncoming.value.arrivalTime - Date.now();
});

whenever(amount, () => trigger());

function trigger() {
    filteredIncomings.trigger();
}
</script>

<template>
    <div class="next-incoming-tag-container">
        <Transition name="tb-fade" mode="out-in">
            <div
                v-if="userAlias && amount && incomings.length > 0 && nextIncoming"
                :key="nextIncoming.id"
                class="tag-wrapper"
            >
                <NTag
                    round
                    class="next-incoming-tag"
                    type="info"
                    size="small"
                    @click="ipcSend('current-tab:navigate-to-place', nextIncoming.target)"
                >
                    <span class="next-incoming-label">Próximo ataque:</span>
                    <NCountdown :duration="duration" @finish="trigger" />
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

.next-incoming-tag-container {
    @include ui.ui-tag;

    .tag-wrapper {
        @include ui.tag-wrapper;

        .next-incoming-tag {
            cursor: pointer;
        }

        .next-incoming-label {
            margin-right: 0.3rem;
        }
    }
}
</style>