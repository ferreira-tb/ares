<script setup lang="ts">
import { shell } from 'electron';
import { NResult, NButton, NButtonGroup } from 'naive-ui';
import { WebsiteUrl } from '$global/constants';
import { ipcSend } from '$renderer/ipc';

interface Props {
    title?: string;
    description?: string;
    size?: 'huge' | 'large' | 'medium' | 'small';
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
                            <NButton round @click="ipcSend('open-github-issues')">Issues</NButton>
                            <NButton round @click="ipcSend('open-error-log-window')">Registro de Erros</NButton>
                            <NButton round @click="shell.openExternal(WebsiteUrl.Discord)">Discord</NButton>
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