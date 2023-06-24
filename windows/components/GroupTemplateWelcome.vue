<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { NButton, NSelect } from 'naive-ui';
import { router } from '$windows/router';
import { StandardWindowName } from '$common/enum';
import GroupTemplateCard from '$windows/components/GroupTemplateCard.vue';

const props = defineProps<{
    template: StandardWindowName | null;
}>();

const emit = defineEmits<{
    (e: 'next'): void;
    (e: 'update:template', value: StandardWindowName | null): void;
}>();

const selectedTemplate = useVModel(props, 'template', emit);

const templates = [
    {
        label: 'Zona segura',
        value: StandardWindowName.GroupTemplateSafeZone
    }
] satisfies NSelectOptions<StandardWindowName>;

async function next() {
    if (!selectedTemplate.value) return;
    await router.push({ name: selectedTemplate.value });
    emit('next');
}
</script>

<template>
    <section>
        <div class="group-template-welcome">
            <div class="select-title">Escolha um modelo para começar</div>
            <NSelect
                v-model:value="selectedTemplate"
                clearable
                :options="templates"
                class="select-template"
            />
            <NButton :disabled="!selectedTemplate" @click="next">
                Confirmar
            </NButton>
        </div>

        <Transition name="tb-fade" mode="out-in">
            <div v-if="selectedTemplate" class="template-description">
                <Transition name="tb-fade" mode="out-in">
                    <GroupTemplateCard
                        v-if="selectedTemplate === StandardWindowName.GroupTemplateSafeZone"
                        title="Zona segura"
                        description="Manual"
                    >
                        Aldeias que estão longe de inimigos.
                    </GroupTemplateCard>
                </Transition>
            </div>
        </Transition>
    </section>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

.group-template-welcome {
    @include main.flex-x-center-y-center($flex-direction: column, $gap: 1em);

    .select-title {
        margin-top: 1em;
        font-size: 1.2em;
    }

    .select-template {
        max-width: calc(100% - 4em);
    }
}

.template-description {
    @include main.flex-x-start-y-center;
    margin-top: 2em;
}
</style>