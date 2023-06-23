<script setup lang="ts">
import { h, ref, shallowRef, watch } from 'vue';
import { NMenu, type MenuInst, type MenuOption } from 'naive-ui';
import { RouterLink } from 'vue-router';
import { router } from '$windows/router';
import { isMenuRoute } from '$renderer/utils';
import { StandardWindowName } from '$common/enum';

const menuInst = shallowRef<MenuInst | null>(null);
const selectedKey = ref<StandardWindowName>(StandardWindowName.PanelOverview);

const menuOptions: MenuOption[] = [
    {
        label: renderLabel(StandardWindowName.PanelOverview, 'Visão geral'),
        key: StandardWindowName.PanelOverview
    },
    {
        label: () => h('span', { style: 'padding-right: 20px;' }, 'Edifícios'),
        key: 'config-buildings',
        children: [
            {
                label: renderLabel(StandardWindowName.PanelBuildingsSnob, 'Academia'),
                key: StandardWindowName.PanelBuildingsSnob
            }
        ]
    },
    {
        label: renderLabel(StandardWindowName.PanelPlunder, 'Saque'),
        key: StandardWindowName.PanelPlunder
    }
];

function renderLabel(routeName: StandardWindowName, label: string) {
    return () => h('span', { style: 'padding-right: 20px;' }, [
         h(RouterLink, { to: { name: routeName } }, label)
    ]);
}

watch([router.currentRoute, menuInst], () => {
    const routeName = router.currentRoute.value.name;
    if (typeof routeName === 'string' && isMenuRoute(routeName, menuOptions)) {
        selectedKey.value = routeName as StandardWindowName;
        menuInst.value?.showOption(routeName);
    }
});
</script>

<template>
	<NMenu
        ref="menuInst"
        v-model:value="selectedKey"
        :options="menuOptions"
        :root-indent="14"
        :indent="16"
    />
</template>