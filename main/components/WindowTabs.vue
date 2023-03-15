<script setup lang="ts">
import WindowButtons from '$main/components/WindowButtons.vue';
import LightIcon from '$icons/units/LightIcon.vue';
</script>

<template>
    <div class="main-window-tabs-container">
        <div class="main-window-tab-area">
            <div class="main-browser-view-tab">
                <LightIcon /> <span class="main-browser-view-title">Ares</span>
            </div>
        </div>

        <!-- Botões para controle da janela -->
        <Suspense>
            <WindowButtons />
        </Suspense>
    </div>
</template>

<style scoped lang="scss">
.main-window-tabs-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    width: 100%;
    height: 40px;
    
    display: flex;
    align-items: center;
    user-select: none;
}

.main-window-tab-area {
    display: flex;
    align-items: center;
    justify-self: start;

    width: 100%;
    height: 100%;

    & > div:not(.main-browser-view-tab) {
        height: 100%;
        border-radius: 5px; 
    }

    .main-browser-view-tab {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;

        width: 100px;
        height: 100%;
        border-radius: 10%;

        color: var(--color-text);
        background-color: var(--color-background-mute);

        & > .main-browser-view-title {
            margin-left: 0.2em;
        }
    }
}
</style>