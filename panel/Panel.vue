<script setup lang="ts">
import { watchEffect, Transition } from 'vue';
import { RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import { NConfigProvider, darkTheme } from 'naive-ui';
import { computedEager } from '@vueuse/core';
import { useIpcRendererOn } from '@vueuse/electron';
import { router } from '$panel/router/router';
import { useAresStore } from '$vue/stores/ares';
import { usePanelStore } from '$panel/stores/panel';
import { pushRoute } from '$panel/utils/helpers';

const aresStore = useAresStore();
const panelStore = usePanelStore();

const { captcha, screen: screenName } = storeToRefs(aresStore);
const { isVisible } = storeToRefs(panelStore);

// https://github.com/ferreira-tb/ares/issues/50
const wrapper = computedEager(() => isVisible.value ? Transition : 'div', { flush: 'sync' });

useIpcRendererOn('captcha-status-did-update', (_e, status: boolean) => {
    captcha.value = status;
});

useIpcRendererOn('panel-visibility-did-change', (_e, status: boolean) => {
    isVisible.value = status;
});

// Define a janela de acordo com a página atual no jogo.
watchEffect(() => pushRoute(screenName.value));
// Redireciona para a janela do captcha caso ele esteja ativo.
watchEffect(() => {
    if (captcha.value === true) {
        router.push({ name: 'captcha' });
    };
});
</script>

<template>
    <NConfigProvider :theme="darkTheme">
        <RouterView v-slot="{ Component }">
            <template v-if="Component">
                <component :is="wrapper" name="tb-fade" mode="out-in">
                    <Suspense>
                        <component :is="Component" />
                        <template #fallback>
                            <span class="to-center bold-green">Carregando...</span>
                        </template>
                    </Suspense>
                </component>
            </template>
        </RouterView>
    </NConfigProvider>
</template>