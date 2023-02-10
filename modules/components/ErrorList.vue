<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { ipcInvoke } from '$global/ipc.js';
import { getLocaleDateString } from '$global/helpers.js';
import { AresError } from '$global/error.js';
import type { ErrorLogResponse } from '$types/electron.js';

const port = await ipcInvoke('deimos-port');
const response = await fetch(`http://127.0.0.1:${port}/deimos/error/normal`);

if (!response.ok) {
    const reason = await response.text();
    throw new AresError(reason);
};

const json = await response.json() as ErrorLogResponse[];
const errorList = reactive(json.filter((err) => err.message));

watchEffect(() => errorList.sort((a, b) => b.time - a.time));
</script>

<template>
    <section>
        <template v-if="errorList.length > 0">
            <div v-for="error of errorList" :key="error.id" class="error-log">
                <p class="bold">{{ error.name }} <span>{{ getLocaleDateString(error.time, true) }}</span></p>
                <p>{{ error.message }}</p>
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

.error-log p > span {
    margin-left: 1em;
    font-weight: normal;
    font-size: smaller;
}

.no-errors {
    text-align: center;
    margin-top: 1em;
}
</style>