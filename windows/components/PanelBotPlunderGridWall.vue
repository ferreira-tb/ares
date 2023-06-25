<script setup lang="ts">
import { usePlunderConfigStore } from '$renderer/stores';
import { ipcSend } from '$renderer/ipc';
import { formatFields, parseFields, formatWallLevel, parseWallLevel } from '$renderer/utils/format-input';
import { StandardWindowName } from '$common/enum';
import {
    NButton,
    NButtonGroup,
    NDivider,
    NGrid,
    NGridItem,
    NInputNumber,
    NSwitch
} from 'naive-ui';

const config = usePlunderConfigStore();
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Muralha</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.ignoreWall" round size="small" />
                    <div class="switch-label">Ignorar muralha</div>
                </div>
            </NGridItem>
            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.destroyWall" round size="small" />
                    <div class="switch-label">Demolir muralha</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Ignorar a partir de</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.wallLevelToIgnore"
                    class="config-input"
                    :disabled="!config.ignoreWall"
                    :min="1"
                    :max="20"
                    :step="1"
                    :validator="(v) => Number.isInteger(v) && (v >= 1 && v <= 20)"
                    :format="formatWallLevel"
                    :parse="parseWallLevel"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Demolir a partir de</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.wallLevelToDestroy"
                    class="config-input"
                    :disabled="!config.destroyWall"
                    :min="1"
                    :max="20"
                    :step="1"
                    :validator="(v) => Number.isInteger(v) && (v >= 1 && v <= 20)"
                    :format="formatWallLevel"
                    :parse="parseWallLevel"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Distância máxima de demolição</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.destroyWallMaxDistance"
                    class="config-input"
                    :disabled="!config.destroyWall"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isFinite(v) && v >= 1"
                    :format="formatFields"
                    :parse="parseFields"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Tropas de demolição</div>
            </NGridItem>
            <NGridItem>
                <NButtonGroup>
                    <NButton @click="ipcSend('window:open', StandardWindowName.PlunderDemolitionTemplate)">
                        Configurar
                    </NButton>
                </NButtonGroup>
            </NGridItem>
        </NGrid>
    </div>
</template>

<style scoped lang="scss">
.labeled-switch-wrapper {
    margin-bottom: 0.5rem;
}
</style>