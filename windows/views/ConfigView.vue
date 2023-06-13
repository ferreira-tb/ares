<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { NLayout, NLayoutSider, NMenu, type MenuInst, type MenuOption } from 'naive-ui';
import { router } from '$windows/router';

const menuInst = ref<MenuInst | null>(null);
const selectedKey = ref<ConfigModuleRoutes>('config-general');

const menuOptions: MenuOption[] = [
    {
        label: renderLabel('config-general', 'Geral'),
        key: 'config-general'
    },
    {
        label: () => h('span', { style: 'padding-right: 20px;' }, 'Edifícios'),
        key: 'config-buildings',
        children: [
            {
                label: renderLabel('config-buildings-snob', 'Academia'),
                key: 'config-buildings-snob'
            }
        ]
    },
    {
        label: renderLabel('config-plunder', 'Saque'),
        key: 'config-plunder'
    },
    {
        label: renderLabel('config-notifications', 'Notificações'),
        key: 'config-notifications'
    },
    {
        label: renderLabel('config-advanced', 'Avançado'),
        key: 'config-advanced'
    }
];

function renderLabel(routeName: ConfigModuleRoutes, label: string) {
    return () => h('span', { style: 'padding-right: 20px;' }, [
         h(RouterLink, { to: { name: routeName } }, label)
    ]);
};

function isRoute(routeName: string, options: MenuOption[] = menuOptions): boolean {
    return options.some((o) => {
        if (o.key === routeName) {
            return true;
        } else if (Array.isArray(o.children)) {
            return isRoute(routeName, o.children);
        };

        return false;
    });
};

onMounted(() => {
    const routeName = router.currentRoute.value.name;
    if (typeof routeName === 'string' && isRoute(routeName)) {
        selectedKey.value = routeName as ConfigModuleRoutes;
        menuInst.value?.showOption(routeName);
    };
});
</script>

<template>
    <NLayout has-sider position="absolute">
        <NLayoutSider
            bordered
            content-style="padding: 6px;"
            :width="150"
        >
            <NMenu 
                ref="menuInst"
                v-model:value="selectedKey"
                :options="menuOptions"
                :root-indent="14"
                :indent="16"
            />
        </NLayoutSider>

        <NLayout :native-scrollbar="false">
            <RouterView #default="{ Component }">
                <template v-if="Component">
                    <Transition name="tb-fade" mode="out-in">
                        <KeepAlive>
                            <Suspense>
                                <component :is="Component" />
                                <template #fallback>
                                    <span class="bold-green to-center">Carregando...</span>
                                </template>
                            </Suspense>
                        </KeepAlive>
                    </Transition>
                </template>
            </RouterView>
        </NLayout>
    </NLayout>
</template>