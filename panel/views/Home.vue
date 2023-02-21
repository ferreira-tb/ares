<script setup lang="ts">
import { ref } from 'vue';
import { shell } from 'electron';
import { NButton, NButtonGroup } from 'naive-ui';
import { ipcInvoke } from '$global/ipc.js';
import { aresURL, repoURL, discordURL } from '$global/utils/constants.js';

const appName = ref<string>(await ipcInvoke('app-name'));
const appVersion = ref<string>(await ipcInvoke('app-version'));
</script>

<template>
    <main>
        <div class="title-area">
            <h1 class="green-text bold">{{ appName.toUpperCase() }}</h1>
            <h2>Uma ferramenta para Tribal Wars</h2>
        </div>
        <NButtonGroup>
            <NButton round @click="shell.openExternal(aresURL)">Site</NButton>
            <NButton round @click="shell.openExternal(repoURL)">Repositório</NButton>
            <NButton round @click="shell.openExternal(discordURL)">Discord</NButton>
        </NButtonGroup>
        <div class="footer-area">
            <p>{{ appVersion }}</p>
        </div>
    </main>
</template>

<style scoped>
.title-area {
    margin-bottom: 1em;
}

h1 {
    font-size: 2em;
}

h2 {
    font-size: 1.2em;
}

.footer-area {
    margin-top: 1.5em;
}
</style>