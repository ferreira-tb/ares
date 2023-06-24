<script setup lang="ts">
import { shell } from 'electron';
import { nextTick, ref } from 'vue';
import { RouterView } from 'vue-router';
import { NButton, NDropdown, NEllipsis, NIcon, NLayout, NLayoutHeader } from 'naive-ui';
import { MenuSharp } from '@vicons/ionicons5';
import { useElementSize, useUserAlias } from '$renderer/composables';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { useGameDataStore } from '$renderer/stores';
import { WebsiteUrl } from '$common/enum';
import PanelHeaderMenu from '$windows/components/PanelHeaderMenu.vue';

const userAlias = useUserAlias();
const version = await ipcInvoke('app:version');

// Sincroniza com o processo principal.
const gameData = useGameDataStore();
const currentData = await ipcInvoke('game:data');
if (currentData) {
    gameData.$patch(currentData);
    await nextTick();
}

const layoutHeader = ref<HTMLDivElement | null>(null);
const { height: headerHeight } = useElementSize(layoutHeader);

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
                <div id="header-wrapper" ref="layoutHeader">
                    <div>
                        <PanelHeaderMenu />
                    </div>

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
                </div>
            </NLayoutHeader>

            <NLayout id="panel-layout-content" position="absolute">
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
        @include main.flex-x-between-y-center($height: 48px);
        padding: 0.5em;
    }

    #header-extra {
        @include main.flex-x-end-y-center($gap: 1em, $height: 100%);

        #app-version {
            font-size: 0.8em;
        }

        #menu-button {
            font-size: 30px;
        }
    }
}

#panel-layout-content {
    top: v-bind("`${headerHeight}px`");
}
</style>