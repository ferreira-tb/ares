<script setup lang="ts">
import { NList } from 'naive-ui';
import PanelBotOverviewPlunder from '$windows/components/PanelBotOverviewPlunder.vue';
import PanelBotOverviewMint from '$windows/components/PanelBotOverviewMint.vue';
</script>

<template>
	<section>
        <NList hoverable :show-divider="false">
            <PanelBotOverviewPlunder />
            <PanelBotOverviewMint />
        </NList>
    </section>
</template>