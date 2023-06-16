<script setup lang="ts">
import { shell } from 'electron';
import { NButton, NButtonGroup } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { WebsiteUrl } from '$common/constants';

const appName = await ipcInvoke('app:name');
const appVersion = await ipcInvoke('app:version');
</script>

<template>
    <main>
        <div class="title-area">
            <h1 class="bold-green">{{ appName.toUpperCase() }}</h1>
            <h2>Uma ferramenta para Tribal Wars</h2>
        </div>
        <NButtonGroup>
            <NButton round @click="ipcSend('website:how-to-use')">Ajuda</NButton>
            <NButton round @click="ipcSend('website:repository')">Repositório</NButton>
            <NButton round @click="shell.openExternal(WebsiteUrl.Discord)">Discord</NButton>
        </NButtonGroup>
        <div class="footer-area">
            <p>{{ appVersion }}</p>
        </div>
    </main>
</template>

<style scoped lang="scss">
.title-area {
    margin-bottom: 1em;

    h1 {
        font-size: 2em;
    }

    h2 {
        font-size: 1.2em;
    }
}

.footer-area {
    margin-top: 1.5em;
}
</style>