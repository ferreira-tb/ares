<script setup lang="ts">
import { useSorted } from '@vueuse/core';
import { ipcInvoke, ipcSend } from '$global/ipc.js';
import { getLocaleDateString } from '$global/utils/helpers.js';
import { assertInteger, assertArray } from '@tb-dev/ts-guard';
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
const errors = useSorted(raw, (a, b) => b.time - a.time);

const getOrigin = (url: string) => new URL(url).origin;

function deleteError(id: number) {
    assertInteger(id, 'O ID do erro deve ser um número inteiro.');
    ipcSend('delete-dom-error-log', id);
    errors.value = errors.value.filter((error) => error.id !== id);
};
</script>

<template>
    <section>
        <template v-if="errors.length > 0">
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