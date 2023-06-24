<script setup lang="ts">
import { NResult } from 'naive-ui';

interface Props {
    description: string;
    toCenter?: boolean;
}

withDefaults(defineProps<Props>(), {
    toCenter: false
});
</script>

<template>
	<div class="result-info">
        <NResult
            status="info"
            title="Você está logado?"
            :class="{ 'result-to-center': toCenter }"
            :description="description"
        />
    </div>
</template>

<style scoped lang="scss">
@use '$renderer/assets/mixins.scss';

.result-to-center {
    @include mixins.to-center;
    width: 100%;
}
</style>