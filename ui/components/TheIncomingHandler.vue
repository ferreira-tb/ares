<script setup lang="ts">
import { ref } from 'vue';
import { useIpcRendererOn } from '@vueuse/electron';
import { NTag } from 'naive-ui';

const isHandlingIncoming = ref<boolean>(false);

useIpcRendererOn('tribal-worker:will-handle-incoming-attack', () => {
    isHandlingIncoming.value = true;
});

useIpcRendererOn('tribal-worker:did-handle-incoming-attack', () => {
    isHandlingIncoming.value = false;
});

useIpcRendererOn('tribal-worker:did-fail-to-handle-incoming-attack', () => {
    isHandlingIncoming.value = false;
});
</script>

<template>
    <div class="incoming-handler-tag">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="isHandlingIncoming" class="tag-wrapper">
                <NTag round type="warning" size="small">
                    Analisando ataque
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

.incoming-handler-tag {
    @include ui.ui-tag;

    .tag-wrapper {
        @include ui.tag-wrapper;
    }
}
</style>