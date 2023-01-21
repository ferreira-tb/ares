<script setup lang="ts">
import { usePlunderHistoryStore } from '@/stores/plunder.js';

const history = usePlunderHistoryStore();
</script>

<template>
    <div class="res-area">
        <div>
            <span class="wood icon"></span>
            <span>{{ history.wood }}</span>
        </div>
        <div>
            <span class="stone icon"></span>
            <span>{{ history.stone }}</span>
        </div>
        <div>
            <span class="iron icon"></span>
            <span>{{ history.iron }}</span>
        </div>
        <div>
            <span class="storage icon"></span>
            <span>{{ history.total }}</span>
        </div>
    </div>
</template>

<style scoped>
.res-area {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    justify-items: center;
}

.res-area > div {
    display: flex;
    justify-content: center;
}
</style>