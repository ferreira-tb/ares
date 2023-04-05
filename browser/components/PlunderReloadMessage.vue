<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    /** Indica se o Plunder está ativo. */
    active: boolean;
    /** Milisegundos entre cada recarregamento automático da página. */
    plunderTimeout: number;
}>();

/** Data do próximo recarregamento automático. */
const nextAutoReload = computed(() => {
    if (!props.active) return null;
    return new Date(Date.now() + props.plunderTimeout);
});

/** Mensagem exibida para o usuário acima da tabela. */
const autoReloadMessage = computed(() => {
    if (nextAutoReload.value === null) return null;
    const date = nextAutoReload.value.toLocaleDateString('pt-br', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = nextAutoReload.value.toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit' });
    return `A página será atualizada automaticamente em ${date} às ${time}`;
});
</script>

<template>
    <span class="auto-reload-message">
        <Transition name="tb-fade" mode="out-in">
            <span v-if="props.active && autoReloadMessage">
                {{ autoReloadMessage }}
            </span>
        </Transition>
    </span>
</template>

<style scoped>
.auto-reload-message {
    font-style: normal;
    position: absolute;
    right: 1em;
}
</style>