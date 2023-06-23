<script setup lang="ts">
import { onActivated } from 'vue';
import { NList } from 'naive-ui';
import PanelOverviewPlunder from '$windows/components/PanelOverviewPlunder.vue';
import PanelOverviewMint from '$windows/components/PanelOverviewMint.vue';

const emit = defineEmits<{
    (e: 'title', title: string): void;
}>();

onActivated(() => {
    emit('title', 'Visão Geral');
});
</script>

<template>
	<section>
        <NList hoverable :show-divider="false">
            <PanelOverviewPlunder />
            <PanelOverviewMint />
        </NList>
    </section>
</template>

<style scoped lang="scss">

</style>