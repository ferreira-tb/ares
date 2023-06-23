<script setup lang="ts">
import { computed } from 'vue';
import { NTag } from 'naive-ui';

const props = defineProps<{
    active: boolean;
}>();

const tagText = computed(() => {
    return props.active ? 'Ativo' : 'Inativo';
});

const tagType = computed(() => {
    return props.active ? 'success' : 'error';
});
</script>

<template>
	<div class="tag-active-status">
        <Transition name="tb-fade" mode="out-in">
            <NTag :key="tagType" bordered round size="small" :type="tagType">
                {{ tagText }}
            </NTag>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
@use '$renderer/assets/mixins.scss';

.tag-active-status {
    @include mixins.flex-x-center-y-center;
}
</style>