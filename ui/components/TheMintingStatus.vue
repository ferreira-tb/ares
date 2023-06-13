<script setup lang="ts">
import { toRef } from 'vue';
import { storeToRefs } from 'pinia';
import { NTag } from 'naive-ui';
import { useSnobConfigStore, useSnobHistoryStore } from '$renderer/stores';
import { useVillage } from '$renderer/composables/village';
import { ipcInvoke, ipcSend } from '$renderer/ipc';

defineProps<{
    userAlias: UserAlias | null;
}>();

const locale = await ipcInvoke('app:locale');

const config = useSnobConfigStore();
const { active, group, mode } = storeToRefs(config);
const village = useVillage(toRef(() => config.village));

const history = useSnobHistoryStore();
const { coins } = storeToRefs(history);

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
            <div v-if="userAlias && active" :key="coins" class="tag-wrapper">
                <NTag
                    round
                    class="minting-status-tag"
                    type="success"
                    size="small"
                    @click="navigateToSnob"
                >
                    {{ `Cunhando (${coins.toLocaleString(locale)})` }}
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