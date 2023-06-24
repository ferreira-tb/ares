<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterView } from 'vue-router';
import { useUserAlias } from '$renderer/composables';
import GroupTemplateWelcome from '$windows/components/GroupTemplateWelcome.vue';
import ResultGuest from '$renderer/components/ResultGuest.vue';
import type { StandardWindowName } from '$common/enum';
import {
    NEllipsis,
    NLayout,
    NLayoutSider,
    NSpace,
    NSteps,
    NStep,
    type StepsProps
} from 'naive-ui';

const userAlias = useUserAlias();

const currentStep = ref(1);
const currentStatus = ref<NonNullable<StepsProps['status']>>('process');
const selectedTemplate = ref<StandardWindowName | null>(null);

const templateName = ref<string | null>(null);
const templateTitle = computed(() => templateName.value ? templateName.value : 'Modelo');
</script>

<template>
    <main v-if="userAlias" class="group-template-view">
        <NLayout has-sider position="absolute">
            <NLayoutSider bordered content-style="padding: 12px; overflow: hidden;" :width="200">
                <NSpace vertical>
                    <NSteps vertical :current="currentStep" :status="currentStatus">
                        <NStep title="Escolha um modelo" />
                        <NStep>
                            <template #title>
                                <div class="title-ellipsis">
                                    <NEllipsis :tooltip="false">{{ templateTitle }}</NEllipsis>
                                </div>
                            </template>
                        </NStep>
                    </NSteps>
                </NSpace>
            </NLayoutSider>
            <NLayout :native-scrollbar="false">
                <Transition name="tb-fade" mode="out-in">
                    <GroupTemplateWelcome
                        v-if="currentStep === 1"
                        v-model:template="selectedTemplate"
                        @next="currentStep = 2"
                    />
        
                    <template v-else>
                        <RouterView #default="{ Component }">
                            <template v-if="Component">
                                <Transition name="tb-fade" mode="out-in">
                                    <Suspense>
                                        <component
                                            :is="Component"
                                            @template-name="(name: string) => templateName = name"
                                        />
                                        <template #fallback>
                                            <span class="bold-green to-center">Carregando...</span>
                                        </template>
                                    </Suspense>
                                </Transition>
                            </template>
                        </RouterView>
                    </template>
                </Transition>
            </NLayout>
        </NLayout>
    </main>

    <ResultGuest
        v-else
        description="É necessário estar logado para criar grupos."
    />
</template>

<style scoped lang="scss">
.group-template-view {
    user-select: none;
}

.title-ellipsis {
    max-width: 130px;
}
</style>