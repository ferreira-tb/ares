<script setup lang="ts">
import { shell } from 'electron';
import { NResult, NButton, NButtonGroup } from 'naive-ui';
import { discordURL, issuesURL } from '$global/utils/constants.js';
import { ipcSend } from '$global/ipc.js';

interface Props {
    title?: string;
    description?: string;
    size?: 'small' | 'medium' | 'large' | 'huge';
    showDefaultSlot?: boolean;
    showDefaultFooter?: boolean;
    userSelect?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Oops...',
    description: 'Houve um erro :(',
    size: 'medium',
    showDefaultSlot: true,
    showDefaultFooter: true,
    userSelect: false
});
</script>

<template>
    <div class="error-result">
        <NResult status="error" :title="props.title" :description="props.description" :size="props.size">
            <div class="default-slot">
                <slot>
                    <template v-if="props.showDefaultSlot">
                        <div>Por favor, feche a janela e tente novamente.</div>
                        <div>Se o problema persistir, consulte o Registro de Erros e envie os detalhes pelo Discord.</div>
                    </template>
                </slot>
            </div>

            <template #footer>
                <slot name="footer">
                    <template v-if="props.showDefaultFooter">
                        <NButtonGroup>
                            <NButton round @click="shell.openExternal(issuesURL)">Issues</NButton>
                            <NButton round @click="ipcSend('open-error-log-window')">Registro de Erros</NButton>
                            <NButton round @click="shell.openExternal(discordURL)">Discord</NButton>
                        </NButtonGroup>
                    </template>
                </slot>
            </template>
        </NResult>
    </div>
</template>

<style scoped lang="scss">
.error-result {
    user-select: v-bind("props.userSelect ? 'text' : 'none'");
    padding: 1rem;

    .default-slot {
        text-align: center;
    }
}
</style>