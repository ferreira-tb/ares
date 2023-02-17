<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useIpcRenderer } from '@vueuse/electron';
import { assertInteger, assertArray } from '@tb-dev/ts-guard';
import { ipcInvoke, ipcSend } from '$global/ipc.js';
import { getLocaleDateString } from '$global/utils/helpers.js';
import { AresError } from '$global/error.js';
import type { DOMErrorLogType } from '$types/error.js';
import { VBtn as Button } from 'vuetify/components/VBtn';
import {
    VCard as Card,
    VCardItem as CardItem,
    VCardTitle as CardTitle,
    VCardSubtitle as CardSubtitle,
    VCardText as CardText,
    VCardActions as CardAction
} from 'vuetify/components/VCard';

const raw = await ipcInvoke('get-dom-error-log');
assertArray(raw, 'Houve um erro durante a conexão com o banco de dados.');
const errors = reactive(raw);
watchEffect(() => errors.sort((a, b) => b.time - a.time));

const ipcRenderer = useIpcRenderer();
ipcRenderer.on('dom-error-log-updated', (_e, newError: DOMErrorLogType) => errors.push(newError));

const getOrigin = (url: string) => new URL(url).origin;

function deleteError(id: number) {
    assertInteger(id, 'O ID do erro deve ser um número inteiro.');
    ipcSend('delete-dom-error-log', id);

    const index = errors.findIndex((error) => error.id === id);
    if (index === -1) throw new AresError('Não foi possível remover o erro da lista.');
    errors.splice(index, 1);
};
</script>

<template>
    <section>
        <template v-if="errors.length > 0">
            <TransitionGroup name="fade" mode="out-in">
                <Card v-for="error of errors" :key="error.id" class="error-log rounded">
                    <CardItem>
                        <CardTitle>{{ getOrigin(error.url) }}</CardTitle>
                        <CardSubtitle>{{ getLocaleDateString(error.time, true) }}</CardSubtitle>
                    </CardItem>
                    <CardText>{{ error.selector }}</CardText>
                    <CardAction>
                        <Button @click="deleteError(error.id)">Excluir</Button>
                    </CardAction>
                </Card>
            </TransitionGroup>
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

.error-log:last-of-type {
    margin-bottom: 1em;
}

.no-errors {
    text-align: center;
    margin-top: 1em;
}
</style>