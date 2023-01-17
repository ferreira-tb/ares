<script setup lang="ts">
import { shell } from 'electron';
import { authorURL, repoURL, helpURL } from '@/constants.js';
import Button from '@/components/Button.vue';
</script>

<template>
    <main>
        <div class="title-area">
            <h1 class="green-text bold">Claustrophobia</h1>
            <h2>Uma ferramenta para Tribal Wars</h2>
        </div>
        <div class="link-area">
            <Button @click="shell.openExternal(authorURL)">Autor</Button>
            <Button @click="shell.openExternal(repoURL)">Repositório</Button>
            <Button @click="shell.openExternal(helpURL)">Suporte</Button>
        </div>
        <div class="footer-area">
            <span>ferreira-tb © 2023</span>
        </div>
    </main>
</template>

<style scoped>
main {
    text-align: center;
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
    margin-top: 2em;
}
</style>