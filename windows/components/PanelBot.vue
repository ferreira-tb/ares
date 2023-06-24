<script setup lang="ts">
import { RouterView } from 'vue-router';
import PanelBotSidebarMenu from '$windows/components/PanelBotSidebarMenu.vue';
import { NLayout, NLayoutSider } from 'naive-ui';

defineProps<{
    userAlias: UserAlias | null;
}>();
</script>

<template>
    <NLayoutSider bordered :native-scrollbar="false" :width="200">
        <PanelBotSidebarMenu />
    </NLayoutSider>

    <NLayout :native-scrollbar="false">
        <div id="panel-bot-router-view">
            <RouterView #default="{ Component }">
                <template v-if="Component">
                    <Transition name="tb-fade" mode="out-in">
                        <KeepAlive>
                            <Suspense>
                                <component :is="Component" :user-alias="userAlias" />
                                <template #fallback>
                                    <span class="bold-green to-center">Carregando...</span>
                                </template>
                            </Suspense>
                        </KeepAlive>
                    </Transition>
                </template>
            </RouterView>
        </div>
    </NLayout>
</template>

<style scoped lang="scss">
#panel-bot-router-view {
    margin-bottom: 1rem;
}
</style>