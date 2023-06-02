<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { NButton, NButtonGroup, NGrid, NGridItem } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { isUserAlias } from '$shared/guards';
import PlunderTemplateModal from '$modules/components/PlunderTemplateModal.vue';
import ResultError from '$renderer/components/ResultError.vue';
import ResultInfo from '$renderer/components/ResultInfo.vue';
import PlunderTemplateCard from '$modules/components/PlunderTemplateCard.vue';

const userAlias = await ipcInvoke('user-alias');
const isArcherWorld = await ipcInvoke('game:is-archer-world');
const previousTemplates = await ipcInvoke('plunder:get-custom-templates');

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
                <PlunderTemplateModal
                    v-model:show="showTemplateModal"
                    v-model:templates="templates"
                    :user-alias="userAlias"
                    :game:is-archer-world="isArcherWorld"
                />
            </Suspense>

            <div v-if="templates.length > 0" class="tb-scrollbar template-grid">
                <NGrid :cols="4" :x-gap="8" :y-gap="10">
                    <NGridItem v-for="template of templates" :key="uuid(template.type)">
                        <PlunderTemplateCard :template="template" @template-destroyed="removeTemplate" />
                    </NGridItem>
                </NGrid>
            </div>

            <ResultInfo
                v-else
                title="Não há modelos salvos"
                description="Experimente criar um modelo para começar"
            />
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