<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { NButton, NButtonGroup, NGrid, NGridItem, NResult } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { isUserAlias } from '$common/guards';
import { useUserAlias } from '$renderer/composables';
import { RendererProcessError } from '$renderer/error';
import PlunderTemplateModal from '$windows/components/PlunderTemplateModal.vue';
import ResultError from '$renderer/components/ResultError.vue';
import PlunderTemplateCard from '$windows/components/PlunderTemplateCard.vue';

const userAlias = useUserAlias();
const locale = await ipcInvoke('app:locale');
const isArcherWorld = await ipcInvoke('world:is-archer-world');
const previousTemplates = await ipcInvoke('plunder:get-custom-templates');

if (typeof isArcherWorld !== 'boolean') {
    throw new RendererProcessError('Could not determine if world is archer world.');
}

const showTemplateModal = ref<boolean>(false);
const templates = ref<CustomPlunderTemplateType[]>(previousTemplates ?? []);
watchEffect(() => templates.value.sort((a, b) => a.type.localeCompare(b.type, 'pt-br')));

let templateKey = 0;
const uuid = (type: string) => `${type}-${++templateKey}`;

function removeTemplate(template: CustomPlunderTemplateType) {
    const index = templates.value.findIndex((t) => t.alias === template.alias && t.type === template.type);
    if (index === -1) return;
    templates.value.splice(index, 1);
}
</script>

<template>
    <main>
        <div v-if="Array.isArray(previousTemplates) && isUserAlias(userAlias)">
            <div class="button-area">
                <NButtonGroup>
                    <NButton @click="showTemplateModal = true">Criar</NButton>
                </NButtonGroup>
            </div>

            <Suspense>
                <PlunderTemplateModal
                    v-model:show="showTemplateModal"
                    v-model:templates="templates"
                    :user-alias="userAlias"
                    :is-archer-world="isArcherWorld"
                />
            </Suspense>

            <div v-if="templates.length > 0" class="tb-scrollbar template-grid">
                <NGrid :cols="4" :x-gap="8" :y-gap="10">
                    <NGridItem v-for="template of templates" :key="uuid(template.type)">
                        <PlunderTemplateCard
                            :locale="locale"
                            :template="template"
                            @template-destroyed="removeTemplate"
                        />
                    </NGridItem>
                </NGrid>
            </div>

            <div v-else class="result-info">
                <NResult
                    status="info"
                    title="Não há modelos salvos"
                    description="Experimente criar um modelo para começar"
                />
            </div>
        </div>
        
        <ResultError v-else />
    </main>
</template>

<style scoped lang="scss">
.button-area {
    position: absolute;
    top: 0;
    padding-top: 10px;
}

.template-grid {
    position: absolute;
    top: 40px;
    bottom: 0;
    overflow: auto;
    margin-top: 1em;
    margin-bottom: 2em;
}
</style>