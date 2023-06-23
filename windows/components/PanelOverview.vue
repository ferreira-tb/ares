<script setup lang="ts">
import { NList, NResult } from 'naive-ui';
import PanelOverviewPlunder from '$windows/components/PanelOverviewPlunder.vue';
import PanelOverviewMint from '$windows/components/PanelOverviewMint.vue';

defineProps<{
    userAlias: UserAlias | null;
}>();
</script>

<template>
	<section v-if="userAlias">
        <NList hoverable :show-divider="false">
            <PanelOverviewPlunder />
            <PanelOverviewMint />
        </NList>
    </section>

    <div v-else class="result-info">
        <NResult
            status="info"
            title="Você está logado?"
            description="É necessário estar logado para utilizar o painel."
        />
    </div>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

.result-info {
    @include main.to-center;
    width: 100%;
}
</style>