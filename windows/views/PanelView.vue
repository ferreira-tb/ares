<script setup lang="ts">
import { shell } from 'electron';
import { computed, nextTick, ref } from 'vue';
import { RouterView } from 'vue-router';
import { MenuSharp } from '@vicons/ionicons5';
import { useElementSize, useUserAlias } from '$renderer/composables';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { useGameDataStore } from '$renderer/stores';
import { WebsiteUrl } from '$common/enum';
import PanelMenu from '$windows/components/PanelMenu.vue';
import {
    NButton,
    NDropdown,
    NEllipsis,
    NIcon,
    NLayout,
    NLayoutHeader,
    NLayoutSider,
    NPageHeader
} from 'naive-ui';

const userAlias = useUserAlias();
const version = await ipcInvoke('app:version');

// Sincroniza com o processo principal.
const gameData = useGameDataStore();
const currentData = await ipcInvoke('game:data');
if (currentData) {
    gameData.$patch(currentData);
    await nextTick();
}

const playerName = computed(() => {
    if (!userAlias.value) return 'Ares';
    return gameData.player.name ?? 'Ares';
});

const pageHeader = ref<HTMLDivElement | null>(null);
const { height: headerHeight } = useElementSize(pageHeader);

const dropdown = [
    {
        label: 'Ajuda',
        key: WebsiteUrl.HowToUse
    },
    {
        label: 'Discord',
        key: WebsiteUrl.Discord
    },
    {
        label: 'Repositório',
        key: WebsiteUrl.Repository
    }
];

function handleSelect(key: WebsiteUrl) {
    if (key === WebsiteUrl.Discord) {
        shell.openExternal(key);
        return;
    }

    ipcSend('website:open', key);
}
</script>

<template>
    <main id="panel">
        <NLayout position="absolute">
            <NLayoutHeader id="panel-layout-header" bordered>
                <div id="header-wrapper" ref="pageHeader">
                    <NPageHeader>
                        <template #title>
                            <Transition name="tb-fade" mode="out-in">
                                <span id="header-title" :key="playerName">{{ playerName }}</span>
                            </Transition>
                        </template>
                        <template #extra>
                            <div id="header-extra">
                                <NEllipsis id="app-version" :tooltip="false">{{ version }}</NEllipsis>

                                <NDropdown :options="dropdown" @select="handleSelect">
                                    <NButton id="menu-button" text :bordered="false">
                                        <NIcon>
                                            <MenuSharp />
                                        </NIcon>
                                    </NButton>
                                </NDropdown>
                            </div>
                        </template>
                    </NPageHeader>
                </div>
            </NLayoutHeader>
            <NLayout id="panel-layout-content" position="absolute" has-sider>
                <NLayoutSider bordered :native-scrollbar="false" :width="200">
                    <PanelMenu />
                </NLayoutSider>
        
                <NLayout :native-scrollbar="false">
                    <div id="panel-router-view">
                        <RouterView #default="{ Component }">
                            <template v-if="Component">
                                <Transition name="tb-fade" mode="out-in">
                                    <KeepAlive>
                                        <Suspense>
                                            <component :is="Component" :user-alias="userAlias" />
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
        </NLayout>
    </main>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

#panel {
    user-select: none;
}

#panel-layout-header {
    height: v-bind("`${headerHeight}px`");

    #header-wrapper {
        padding: 0.5em;
    }

    #header-title {
        font-size: 1.2em;
        font-weight: 500;
        color: var(--color-green);
    }

    #header-extra {
        @include main.flex-x-end-y-center($height: 100%);
        gap: 1em;

        #app-version {
            font-size: 0.9em;
        }

        #menu-button {
            font-size: 30px;
        }
    }
}

#panel-layout-content {
    top: v-bind("`${headerHeight}px`");

    #panel-router-view {
        margin-bottom: 1rem;
    }
}
</style>