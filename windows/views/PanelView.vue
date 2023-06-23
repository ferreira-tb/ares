<script setup lang="ts">
import { shell } from 'electron';
import { ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import { MenuSharp } from '@vicons/ionicons5';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { StandardWindowName, WebsiteUrl } from '$common/enum';
import {
    NButton,
    NButtonGroup,
    NDropdown,
    NEllipsis,
    NIcon,
    NList,
    NListItem,
    NLayout,
    NLayoutHeader,
    NLayoutSider,
    NPageHeader
} from 'naive-ui';

const version = await ipcInvoke('app:version');

const pageHeader = ref<HTMLDivElement | null>(null);
const { height: headerHeight } = useElementSize(pageHeader, { width: 0, height: 0 }, { box: 'border-box' });

const routeTitle = ref('Visão Geral');

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
                            <span id="header-title">{{ routeTitle }}</span>
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
                <NLayoutSider bordered :native-scrollbar="false">
                    Teste
                </NLayoutSider>
        
                <NLayout :native-scrollbar="false">
                    <NList hoverable :show-divider="false">
                        <NListItem>
                            <NEllipsis :tooltip="false">Saque</NEllipsis>
                            <template #suffix>
                                <NButtonGroup>
                                    <NButton round @click="ipcSend('window:open', StandardWindowName.PlunderTemplate)">
                                        Modelos
                                    </NButton>
                                    <NButton>
                                        Saquear
                                    </NButton>
                                    <NButton round @click="ipcSend('window:open', StandardWindowName.ConfigPlunder)">
                                        Configurações
                                    </NButton>
                                </NButtonGroup>
                            </template>
                        </NListItem>
                    </NList>
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
}
</style>