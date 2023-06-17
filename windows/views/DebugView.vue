<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import { NCard, NSelect, NSpace, NTag } from 'naive-ui';
import { ipcSend } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import { scopeRegex } from '$common/regex';

const debugView = ref<HTMLElement | null>(null);

const isOptionsVisible = ref(false);
const optionsContainer = ref<HTMLElement | null>(null);
const { height: optionsHeight } = useElementSize(optionsContainer, { height: 0, width: 0 }, { box: 'border-box' });
const cardsContainerTop = computed(() => `${optionsHeight.value + 10}px`);

const debugInfo = ref<AppDebugInfo[]>([]);

const scopes = computed<string[]>(() => {
    return debugInfo.value.filter((info) => scopeRegex.test(info.channel)).reduce((acc, info) => {
        let scope = info.channel.match(scopeRegex)?.[0];
        if (!scope) return acc;
        scope = scope.slice(0, scope.indexOf(':'));
        if (!acc.includes(scope)) acc.push(scope);
        return acc;
    }, [] as string[]);
});

const sources = computed<string[]>(() => {
    return debugInfo.value.reduce((acc, info) => {
        if (!acc.includes(info.from)) acc.push(info.from);
        return acc;
    }, [] as string[]);
});

const targets = computed<string[]>(() => {
    return debugInfo.value.reduce((acc, info) => {
        if (!acc.includes(info.to)) acc.push(info.to);
        return acc;
    }, [] as string[]);
});

const { selected: selectedScopes, options: scopesOptions } = useOptions(scopes);
const { selected: selectedSources, options: sourcesOptions } = useOptions(sources);
const { selected: selectedTargets, options: targetsOptions } = useOptions(targets);

const cards = computed(() => {
    const onlySelected = debugInfo.value.filter((info) => {
        if (selectedSources.value.length > 0 && !selectedSources.value.includes(info.from)) return false;
        if (selectedTargets.value.length > 0 && !selectedTargets.value.includes(info.to)) return false;

        if (selectedScopes.value.length > 0) {
            let scope = info.channel.match(scopeRegex)?.[0];
            if (!scope) return false;
            scope = scope.slice(0, scope.indexOf(':'));
            if (!selectedScopes.value.includes(scope)) return false;
        };

        return true;
    });
    
    const mappedInfo = onlySelected.map((info) => {
        return {
            uuid: info.uuid,
            time: info.time,
            content: info.data,
            header: info.channel,
            headerExtra: {
                from: info.from,
                to: info.to
            }
        };
    });

    mappedInfo.sort((a, b) => b.time - a.time);
    return mappedInfo;
});

function onCardClose(uuid: string) {
    const index = debugInfo.value.findIndex((info) => info.uuid === uuid);
    if (index === -1) return;

    debugInfo.value.splice(index, 1);
};

function useOptions(sourceRef: Ref<string[]>) {
    const selected = ref<string[]>([]);
    const options = computed(() => {
        return sourceRef.value.map((source) => {
            return { label: source, value: source };
        });
    });

    return { selected, options };
};

useIpcOn('debug:did-receive-report', (_e, info: AppDebugInfo) => {
    debugInfo.value.push(info);
});

useIpcOn('debug:toggle-options', () => {
    isOptionsVisible.value = !isOptionsVisible.value;
});

useIpcOn('debug:clear', () => {
    debugInfo.value = [];
});

onMounted(() => {
    debugView.value?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ipcSend('debug:show-context-menu', isOptionsVisible.value);
    });
});
</script>

<template>
    <div ref="debugView" class="debug-view">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="isOptionsVisible" ref="optionsContainer" class="options-container">
                <NSpace vertical>
                    <NSelect v-model:value="selectedScopes" clearable multiple :options="scopesOptions" />
                    <NSelect v-model:value="selectedSources" clearable multiple :options="sourcesOptions" />
                    <NSelect v-model:value="selectedTargets" clearable multiple :options="targetsOptions" />
                </NSpace>
            </div>
        </Transition>

        <div class="cards-container tb-scrollbar">
            <TransitionGroup name="tb-fade">
                <NCard
                    v-for="card of cards"
                    :key="card.uuid"
                    bordered
                    closable
                    class="debug-card"
                    @close="onCardClose(card.uuid)"
                >
                    <template #header>
                        {{ card.header }}
                    </template>
                    <template #header-extra>
                        <div class="card-header-extra">
                            <NTag class="card-tag" size="large" type="success">{{ card.headerExtra.from }}</NTag>
                            <NTag class="card-tag" size="large" type="warning">{{ card.headerExtra.to }}</NTag>
                        </div>
                    </template>
                    <pre
                        v-for="(item, index) of card.content"
                        :key="`${card.uuid}-${index}`"
                        class="card-pre"
                    >
                        {{ JSON.stringify(item, null, 2) }}
                    </pre>
                </NCard>
            </TransitionGroup>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

.options-container {
    padding: 0.5em;
}

.cards-container {
    position: absolute;
    top: v-bind("cardsContainerTop");
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.5em;

    .card-header-extra {
        @include main.flex-x-center-y-center;
        gap: 1em;

        .card-tag {
            padding-left: 1em;
            padding-right: 1em;
        }
    }

    .debug-card, .card-pre {
        margin-bottom: 0.5em;
    }
}
</style>