<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterView } from 'vue-router';
import { NEllipsis, NLayout, NLayoutSider, NResult, NSpace, NSteps, NStep, type StepsProps } from 'naive-ui';
import { useUserAlias } from '$renderer/composables';
import type { StandardWindowName } from '$common/constants';
import GroupTemplateWelcome from '$windows/components/GroupTemplateWelcome.vue';

const userAlias = useUserAlias();

const currentStep = ref(1);
const currentStatus = ref<NonNullable<StepsProps['status']>>('process');
const selectedTemplate = ref<StandardWindowName | null>(null);

const templateName = ref<string | null>(null);
const templateTitle = computed(() => templateName.value ? templateName.value : 'Modelo');
</script>

<template>
    <template v-if="userAlias">
        <NLayout has-sider position="absolute">
            <NLayoutSider bordered content-style="padding: 12px; overflow: hidden;" :width="200">
                <NSpace vertical>
                    <NSteps vertical :current="currentStep" :status="currentStatus">
                        <NStep title="Início" />
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
    </template>

    <div v-else class="result-info">
        <NResult
            status="info"
            title="Você está logado?"
            description="É necessário estar logado para criar grupos."
        />
    </div>
</template>

<style scoped lang="scss">
.title-ellipsis {
    max-width: 130px;
}
</style>