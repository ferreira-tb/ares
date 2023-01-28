<script setup lang="ts">
import { ref } from 'vue';
import { shell } from 'electron';
import { ipcInvoke } from '#/ipc.js';
import { authorURL, repoURL, helpURL } from '#/constants.js';
import Button from '@/components/Button.vue';

const appName = ref<string>(await ipcInvoke('app-name'));
</script>

<template>
    <main>
        <div class="title-area">
            <h1 class="green-text bold">{{ appName }}</h1>
            <h2>Uma ferramenta para Tribal Wars</h2>
        </div>
        <div class="link-area">
            <Button @click="shell.openExternal(authorURL)">Autor</Button>
            <Button @click="shell.openExternal(repoURL)">Repositório</Button>
            <Button @click="shell.openExternal(helpURL)">Suporte</Button>
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
    font-size: 1.5em;
}

h2 {
    font-size: 1.2em;
}

.link-area {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    justify-items: center;
}

.link-area > button {
    width: 90%;
    max-width: 150px;
}

.footer-area {
    margin-top: 1.5em;
}
</style>