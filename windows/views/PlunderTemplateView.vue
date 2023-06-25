<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { NButton, NButtonGroup, NGrid, NGridItem, NResult } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { useArcherWorld, useUserAlias } from '$renderer/composables';
import PlunderTemplateModal from '$windows/components/PlunderTemplateModal.vue';
import PlunderTemplateCard from '$windows/components/PlunderTemplateCard.vue';

const userAlias = useUserAlias();
const isArcherWorld = useArcherWorld();

const locale = await ipcInvoke('app:locale');
const previousTemplates = await ipcInvoke('plunder:get-custom-templates');

const showTemplateModal = ref<boolean>(false);
const templates = ref<PlunderCustomTemplateType[]>(previousTemplates ?? []);
watchEffect(() => templates.value.sort((a, b) => a.name.localeCompare(b.name, locale)));

let templateKey = 0;
const uuid = (type: string) => `${type}-${++templateKey}`;

function removeTemplate(template: PlunderCustomTemplateType) {
    const index = templates.value.findIndex((t) => t.alias === template.alias && t.name === template.name);
    if (index === -1) return;
    templates.value.splice(index, 1);
}
</script>

<template>
    <main>
        <div v-if="previousTemplates && userAlias">
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
                    <NGridItem v-for="template of templates" :key="uuid(template.name)">
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