<script setup lang="ts">
import { toRef } from 'vue';
import { storeToRefs } from 'pinia';
import { NTag } from 'naive-ui';
import { useSnobConfigStore } from '$renderer/stores';
import { useVillage } from '$renderer/composables/village';
import { ipcSend } from '$renderer/ipc';

const config = useSnobConfigStore();
const { active, group, mode } = storeToRefs(config);
const village = useVillage(toRef(() => config.village));

function navigateToSnob() {
    if (!village.value) return;
    if (mode.value === 'single') {
        ipcSend('current-view:navigate-to-snob-train', village.value.id);
    } else {
        ipcSend('current-view:navigate-to-snob-coin', village.value.id, group.value);
    };
};
</script>

<template>
    <div class="minting-status-tag-container">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="active" class="tag-wrapper">
                <NTag
                    round
                    class="minting-status-tag"
                    type="success"
                    size="small"
                    @click="navigateToSnob"
                >
                    Cunhando
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

.minting-status-tag-container {
    @include ui.ui-tag;

    .tag-wrapper {
        @include ui.tag-wrapper;

        .minting-status-tag {
            cursor: pointer;
        }
    }
}
</style>