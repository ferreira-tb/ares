<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { NTag } from 'naive-ui';
import { computedWithControl, whenever } from '@vueuse/core';
import { useIncomingsStore } from '$renderer/stores';
import { getLocaleDateString } from '$renderer/utils/helpers';
import { ipcInvoke, ipcSend } from '$renderer/ipc';

defineProps<{
    userAlias: UserAlias | null;
}>();

const locale = await ipcInvoke('app:locale');

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

whenever(amount, () => filteredIncomings.trigger());
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
                    @click="ipcSend('current-view:navigate-to-place', nextIncoming.target)"
                >
                    {{ `Próximo ataque: ${getLocaleDateString(locale, nextIncoming.arrivalTime)}` }}
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
    }
}
</style>