<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NLayout, NLayoutSider } from 'naive-ui';
import PanelBotSidebarMenu from '$windows/components/PanelBotSidebarMenu.vue';
import ResultGuest from '$renderer/components/ResultGuest.vue';

defineProps<{
    userAlias: UserAlias | null;
}>();
</script>

<template>
    <NLayout id="panel-bot" position="absolute" :has-sider="Boolean(userAlias)">
        <template v-if="userAlias">
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

        <ResultGuest
            v-else
            description="É necessário estar logado para utilizar o painel."
            to-center
        />
    </NLayout>
</template>

<style scoped lang="scss">
#panel-bot-router-view {
    margin-bottom: 1em;
}
</style>