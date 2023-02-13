<script setup lang="ts">
import { useSorted } from '@vueuse/core';
import { ipcInvoke } from '$global/ipc.js';
import { getLocaleDateString } from '$global/helpers.js';
import { assertType } from '$global/error.js';

const raw = await ipcInvoke('get-dom-error-log');
assertType(Array.isArray(raw), 'Houve um erro durante a conexão com o banco de dados.');
const errors = useSorted(raw, (a, b) => b.time - a.time);
</script>

<template>
    <section>
        <template v-if="errors.length > 0">
            <div v-for="error of errors" :key="error.id" class="error-log">
                <p class="bold">{{ error.selector }} <span>{{ getLocaleDateString(error.time, true) }}</span></p>
                <p>{{ error.url }}</p>
            </div>
        </template>
        <div v-else class="no-errors green-text bold">
            Nenhum erro registrado :)
        </div>
    </section>
</template>

<style scoped>
.error-log {
    margin-bottom: 0.5em;
}

.error-log p:nth-of-type(2) {
    margin-top: 0.3em;
}

.error-log p>span {
    margin-left: 1em;
    font-weight: normal;
    font-size: smaller;
}

.no-errors {
    text-align: center;
    margin-top: 1em;
}
</style>