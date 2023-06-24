<script setup lang="ts">
import { ref } from 'vue';
import { NTag } from 'naive-ui';
import { useIpcOn } from '$renderer/composables';

defineProps<{
    userAlias: UserAlias | null;
}>();

const isHandlingIncoming = ref<boolean>(false);

useIpcOn('tribal-worker:will-handle-incoming-attack', () => {
    isHandlingIncoming.value = true;
});

useIpcOn('tribal-worker:did-handle-incoming-attack', () => {
    isHandlingIncoming.value = false;
});

useIpcOn('tribal-worker:did-fail-to-handle-incoming-attack', () => {
    isHandlingIncoming.value = false;
});
</script>

<template>
    <div class="incoming-handler-tag-container">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="userAlias && isHandlingIncoming" class="tag-wrapper">
                <NTag round type="warning" size="small">
                    Analisando ataques...
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

.incoming-handler-tag-container {
    @include ui.ui-tag;

    .tag-wrapper {
        @include ui.tag-wrapper;
    }
}
</style>