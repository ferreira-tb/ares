<script setup lang="ts">
import { h, ref, shallowRef, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { NMenu, type MenuInst, type MenuOption } from 'naive-ui';
import { router } from '$windows/router';
import { isMenuRoute } from '$renderer/utils';
import { StandardWindowName } from '$common/enum';

const menuInst = shallowRef<MenuInst | null>(null);
const selectedKey = ref<StandardWindowName>(StandardWindowName.PanelBotOverview);

const menuOptions: MenuOption[] = [
    {
        label: () => h(RouterLink, { to: { name: StandardWindowName.PanelBotOverview } }, 'Automatização'),
        key: StandardWindowName.PanelBotOverview
    },
    {
        label: () => h(RouterLink, { to: { name: StandardWindowName.PanelTools } }, 'Ferramentas'),
        key: StandardWindowName.PanelTools
    }
];

watch([router.currentRoute, menuInst], () => {
    const routeName = router.currentRoute.value.name;
    if (typeof routeName === 'string' && isMenuRoute(routeName, menuOptions)) {
        selectedKey.value = routeName as StandardWindowName;
        menuInst.value?.showOption(routeName);
    }
});
</script>

<template>
	<NMenu ref="menuInst" v-model:value="selectedKey" mode="horizontal" :options="menuOptions" />
</template>