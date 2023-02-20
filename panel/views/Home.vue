<script setup lang="ts">
import { ref } from 'vue';
import { shell } from 'electron';
import { ipcInvoke } from '$global/ipc.js';
import { aresURL, repoURL, discordURL } from '$global/utils/constants.js';
import { VBtn as Button } from 'vuetify/components/VBtn';

const appName = ref<string>(await ipcInvoke('app-name'));
const appVersion = ref<string>(await ipcInvoke('app-version'));
</script>

<template>
    <main>
        <div class="title-area">
            <h1 class="green-text bold">{{ appName.toUpperCase() }}</h1>
            <h2>Uma ferramenta para Tribal Wars</h2>
        </div>
        <div class="button-area">
            <Button size="small" @click="shell.openExternal(aresURL)">Site</Button>
            <Button size="small" @click="shell.openExternal(repoURL)">Git Hub</Button>
            <Button size="small" @click="shell.openExternal(discordURL)">Discord</Button>
        </div>
        <div class="footer-area">
            <p>{{ appVersion }}</p>
        </div>
    </main>
</template>

<style scoped>
main {
    text-align: center;
    user-select: none;
}

.title-area {
    margin-bottom: 1em;
}

h1 {
    font-size: 2em;
}

h2 {
    font-size: 1.2em;
}

.button-area {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    justify-items: center;
}

.button-area > button {
    width: 95%;
    max-width: 150px;
}

.footer-area {
    margin-top: 1.5em;
}
</style>