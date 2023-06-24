<script setup lang="ts">
import { h, nextTick, ref, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { NLayout, NLayoutSider, NMenu, type MenuInst, type MenuOption } from 'naive-ui';
import { router } from '$windows/router';
import { useGameDataStore } from '$renderer/stores';
import { ipcInvoke } from '$renderer/ipc';
import { isMenuRoute } from '$renderer/utils';
import { StandardWindowName } from '$common/enum';

const gameData = useGameDataStore();
const previousGameData = await ipcInvoke('game:data');
if (previousGameData) gameData.$patch(previousGameData);
await nextTick();

const menuInst = ref<MenuInst | null>(null);
const selectedKey = ref<StandardWindowName>(StandardWindowName.ConfigGeneral);

const menuOptions: MenuOption[] = [
    {
        label: renderLabel(StandardWindowName.ConfigGeneral, 'Geral'),
        key: StandardWindowName.ConfigGeneral
    },
    {
        label: renderLabel(StandardWindowName.ConfigTags, 'Etiquetas'),
        key: StandardWindowName.ConfigTags
    },
    {
        label: renderLabel(StandardWindowName.ConfigNotifications, 'Notificações'),
        key: StandardWindowName.ConfigNotifications
    },
    {
        label: renderLabel(StandardWindowName.ConfigAdvanced, 'Avançado'),
        key: StandardWindowName.ConfigAdvanced
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
    <NLayout has-sider position="absolute">
        <NLayoutSider bordered content-style="padding: 6px;" :width="150">
            <NMenu
                ref="menuInst"
                v-model:value="selectedKey"
                :options="menuOptions"
                :root-indent="14"
                :indent="16"
            />
        </NLayoutSider>

        <NLayout :native-scrollbar="false">
            <div id="config-router-view">
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
            </div>
        </NLayout>
    </NLayout>
</template>

<style scoped lang="scss">
#config-router-view {
    margin-bottom: 1rem;
}
</style>