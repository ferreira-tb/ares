<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { NButton, NButtonGroup, NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke } from '$global/ipc';
import { isUserAlias } from '$global/utils/guards';
import TemplateModal from '$modules/components/plunder/TemplateModal.vue';
import ErrorResult from '$global/components/result/ErrorResult.vue';
import InfoResult from '$global/components/result/InfoResult.vue';
import TemplateCard from '$modules/components/plunder/TemplateCard.vue';
import type { CustomPlunderTemplateType } from '$types/plunder';

const userAlias = await ipcInvoke('user-alias');
const isArcherWorld = await ipcInvoke('is-archer-world');
const previousTemplates = await ipcInvoke('get-custom-plunder-templates');

const showTemplateModal = ref<boolean>(false);
const templates = ref<CustomPlunderTemplateType[]>(previousTemplates ?? []);
watchEffect(() => templates.value.sort((a, b) => a.type.localeCompare(b.type, 'pt-br')));

let templateKey = 0;
const uuid = (type: string) => `${type}-${++templateKey}`;

function removeTemplate(template: CustomPlunderTemplateType) {
    const index = templates.value.findIndex((t) => t.alias === template.alias && t.type === template.type);
    if (index === -1) return;
    templates.value.splice(index, 1);
};
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
                <TemplateModal
                    v-model:show="showTemplateModal"
                    v-model:templates="templates"
                    :userAlias="userAlias"
                    :isArcherWorld="isArcherWorld"
                />
            </Suspense>

            <div v-if="templates.length > 0" class="template-grid tb-scrollbar">
                <NGrid :cols="4" :x-gap="8" :y-gap="10">
                    <NGridItem v-for="template of templates" :key="uuid(template.type)">
                        <TemplateCard :template="template" @template-destroyed="removeTemplate" />
                    </NGridItem>
                </NGrid>
            </div>

            <InfoResult v-else title="Não há modelos salvos" description="Experimente criar um modelo para começar" />
        </div>
        
        <ErrorResult v-else />
    </main>
</template>

<style scoped>
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