<script setup lang="ts">
import { NResult } from 'naive-ui';

interface Props {
    title?: string;
    description?: string;
    size?: 'small' | 'medium' | 'large' | 'huge';
    userSelect?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Tudo certo!',
    description: 'Perfeitamente balanceado :)',
    size: 'medium',
    userSelect: false
});
</script>

<template>
    <div class="sucess-result">
        <NResult status="success" :title="props.title" :description="props.description" :size="props.size">
            <div class="default-slot">
                <slot></slot>
            </div>

            <template #footer>
                <slot name="footer"></slot>
            </template>
        </NResult>
    </div>
</template>

<style scoped lang="scss">
.sucess-result {
    user-select: v-bind("props.userSelect ? 'text' : 'none'");
    padding: 1rem;

    .default-slot {
        text-align: center;
    }
}
</style>